# AGENTS.md — Horizon Properties

Notes that are not obvious from the manifests. Everything here is specific to running this repo in
the Base44 sandbox.

## Running the app

- Always use **`docker-compose.base44.yml`** (never the repo's other compose files, if any appear
  later). `docker compose -f docker-compose.base44.yml up -d --build`.
- `web` is the only public entry point: **host 3000 → container 5173** (Vite dev server, HMR on).
  `server` (Express) listens on 4000 and is also published for direct API calls.
- Single-origin setup: the browser calls `/api/...` and **Vite proxies `/api` to `http://server:4000`**
  (`VITE_API_PROXY_TARGET`). Do not point the client at a public API host — that would break the
  same-origin story for no benefit.
- `db-setup` is a one-shot service: it installs dependencies, applies `server/src/db/schema.sql` and
  seeds the catalogue, then exits. `server` waits for it with
  `condition: service_completed_successfully`. Re-run it after editing seed data with
  `docker compose -f docker-compose.base44.yml exec server npm run setup` (schema and seed are
  idempotent, upserting by slug).

## Gotchas worth knowing

- **Seeding keeps ids stable** (`on conflict (slug) do update`), which is what makes saved properties
  survive a re-seed. Anything that deletes and re-inserts property rows would orphan
  `favorites.property_id`.
- **Tailwind opacity steps.** The design leans on fine opacities (`/15`, `/35`, `/45`, `/65`, `/96`,
  `/98`). Those steps are *not* in Tailwind's default opacity scale, and an unknown step silently
  produces **no class at all** (an invisible overlay, a missing border). `client/tailwind.config.js`
  therefore registers the full `0–100` scale — keep it.
- **Saved properties need no account.** The client generates an anonymous visitor id in
  `localStorage` (`horizon.visitor-id`, `client/src/lib/visitor.ts`) and sends it as `x-visitor-id`;
  the API validates the format (`[A-Za-z0-9_-]{8,64}`). There is no authentication in this app.
- **Images are stored as base URLs** without resize parameters, in `server/src/db/data.ts`
  (catalogue) and `client/src/lib/editorial.ts` (marketing imagery). `client/src/lib/images.ts`
  appends sizing only for hosts known to support it — do not append params to the `media.base44.com`
  hero asset.
- **Carousel drag** is pointer-based for the mouse only (`pointerType === 'mouse'`); touch uses
  native scrolling with CSS snap. A drag of more than 6px suppresses the following click so cards do
  not navigate by accident — keep that pair together if you touch `PropertyCarousel`.

## The hero film

The homepage hero is a scroll-scrubbed film, not a background video. `client/src/hooks/useScrollScrub.ts`
owns it; the section is a `300vh` runway with a `100svh` sticky frame, so 200vh of scroll maps onto the
film's whole timeline, in both directions. It is never played — no `play()`, no autoplay, no loop.

- **Seeks are the whole game.** The film must keep a keyframe every ~6 frames (`-g 6` at 24fps, plus
  `-sc_threshold 0`) and `+faststart`. The master supplied for this build had **one** keyframe across
  9s, so any seek had to decode from frame one and scrubbing was unusable. Re-encode with the ffmpeg
  line in `client/src/lib/editorial.ts` if the film is replaced.
- **A seek drops `readyState` to 1 while it resolves.** Readiness has to be *latched* once (see `armed`
  in the hook). Testing `readyState` live sends the timeline back to the first frame on every seek and
  the film stalls there — that bug is easy to reintroduce.
- `hero-scrub-mobile.mp4` is the phone encode, chosen **once on mount** by `matchMedia('(max-width: 767px)')`.
  Swapping the source later would restart the download.
- The copy fades out over the first ~27% of the runway; that is written straight to the DOM inside the
  animation frame, so scroll progress never passes through React state.
- `prefers-reduced-motion` skips the film entirely and renders the brand photograph instead.
- Verifying it: scroll to a share of the runway, wait for the timeline to settle (a seek takes a few
  hundred ms in the sandbox), then compare `video.currentTime` with `progress × video.duration`.

## Sandbox overrides (all gated on `BASE44_PREVIEW_MODE === "1"`)

Nothing else in the app depends on the flag; with it unset (or any other value) the original
behaviour applies.

| Where | What it does | Why |
| ----- | ------------ | --- |
| `client/vite.config.ts` → `server.allowedHosts` | Appends `.${BASE44_SANDBOX_HOST_DOMAIN}` | The proxied preview host is `3000-<sandbox id>.<domain>` and the sandbox id rotates, so a wildcard is the only safe form. Never hardcode a resolved host. |
| `client/vite.config.ts` → `server.hmr` | `{ protocol: 'wss', clientPort: 443 }` | The preview is served over HTTPS while the dev server speaks HTTP; without this HMR would try to reach 5173 directly. |
| compose `web.environment` | passes `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`, `BASE44_SANDBOX_HOST_DOMAIN`, `BASE44_PUBLIC_HOST_SUFFIX`, `BASE44_PREVIEW_MODE` through as bare variables | Values come from the sandbox; they must never be written into files. |
| `server/src/index.ts` → CORS origin allow-list | Allows `https://3000-`/`https://4000-$BASE44_PUBLIC_HOST_SUFFIX` plus localhost | Only needed for direct calls to port 4000; the app itself is same-origin. |

## Verifying a change

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/            # dev server serves the app
curl -s 'http://localhost:3000/api/properties?limit=2' | head -c 200       # API through the proxy
docker compose -f docker-compose.base44.yml exec -T web npx tsc --noEmit   # frontend types
docker compose -f docker-compose.base44.yml exec -T server npx tsc --noEmit # API types
```

There is no test suite; correctness is checked by driving the running app (the property explorer,
the gallery, save/unsave and the enquiry forms all write to Postgres, so verify against the API
rather than the DOM alone).

## Health checks

Compose probes real endpoints, never a synthetic one: `web` fetches `/` on 5173 and `server` fetches
`/api/properties?limit=1` (which also exercises the database). Both use `node -e fetch(...)` because
the images are plain `node:22-alpine` with no curl.
