# Horizon Properties

A premium real-estate website: editorial marketing pages, a filterable property explorer, full
property detail pages with a gallery, saved properties and working enquiry forms.

## Stack

| Layer    | Choice                                                      |
| -------- | ----------------------------------------------------------- |
| Frontend | React 18 + TypeScript + Vite 6 + Tailwind CSS 3, React Router |
| API      | Express 4 + TypeScript (run with `tsx`), `pg`                |
| Database | PostgreSQL 16                                                |

## Repository layout

```
client/    Vite app — components, pages, design tokens
  src/components/{layout,home,property,forms,ui}
  src/pages
  src/lib       api client, image helpers, formatting, navigation data
  src/context   saved-properties provider
server/    Express API
  src/routes    properties, agents, favorites, inquiries
  src/db        schema.sql, migrate.ts, seed.ts, catalogue data (data.ts)
docker-compose.base44.yml   the development stack
```

## Running it

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

- The site is served on **http://localhost:3000** (Vite dev server on 5173 inside the container).
- The API is also published directly on **http://localhost:4000**.
- The browser only ever talks to port 3000: Vite proxies `/api` to the API service, so there is a
  single origin and no CORS in the normal path.

The database schema and the property catalogue load automatically through the one-shot `db-setup`
service. To reload the catalogue after editing `server/src/db/data.ts`:

```bash
docker compose -f docker-compose.base44.yml exec server npm run setup
```

## Content

The catalogue lives in **`server/src/db/data.ts`** — that file is the single source of truth for
properties, agents and the marketing imagery used on the homepage. Seeding is idempotent: rows are
upserted by slug, so re-running it never breaks saved properties.

Images are stored as **base URLs without sizing parameters**; the client appends
`?auto=format&fit=crop&w=…&q=…` in `client/src/lib/images.ts` so each surface requests the width it
actually renders (`srcset` on every photograph). See `AGENTS.md` for the full set of project and
sandbox notes.

## Page map

| Route                  | What it is                                                              |
| ---------------------- | ----------------------------------------------------------------------- |
| `/`                    | Hero, Who We Are, Featured Properties, Services, Why Choose Horizon, Team, CTA |
| `/properties`          | Explorer — search, filters, sort, load-more, all reflected in the URL    |
| `/properties/:slug`    | Detail page — gallery, specification, features, amenities, advisor, viewing form, similar homes |
| `/saved`               | The visitor's shortlist (no account needed)                              |
| `/contact`             | Office details and the main enquiry form                                 |
