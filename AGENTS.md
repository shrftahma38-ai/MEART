# Sandbox notes (Base44 preview environment)

The repository is a **WordPress theme project**. `theme/goosht-shahrvand/` is the deliverable;
the sandbox runs it on a real WordPress so the design can be seen and checked.

## Running it

```bash
docker compose -f docker-compose.base44.yml up -d          # db + wordpress (:3000) + one-shot seed
docker compose -f docker-compose.base44.yml ps
docker compose -f docker-compose.base44.yml logs seed      # what the seed did
```

* The theme directory is bind-mounted into `/var/www/html/wp-content/themes/goosht-shahrvand`,
  so editing PHP/CSS/JS takes effect on the next page load — there is no build step and no
  live-reload dev server (WordPress renders from disk, WordPress core itself lives in the
  `wp_data` volume, not in this repo).
* WordPress itself is *not* part of the deliverable: the stock `wordpress:php8.2-apache` and
  `mysql:8.0` images are infrastructure. Only `theme/` is code we own.
* The seed is safe to re-run (`docker compose -f docker-compose.base44.yml run --rm --no-deps seed sh /seed/seed.sh`);
  every step checks whether it already ran.
* Demo credentials are local-only: `admin` / `base44-demo`.

## Sandbox-only override (important)

`sandbox/mu-plugins/00-base44-preview.php` is mounted into `wp-content/mu-plugins` and is **not**
part of the distributed theme. The whole file is gated behind an exact
`BASE44_PREVIEW_MODE === '1'` check — with the flag unset or any other value it returns
immediately and WordPress behaves exactly as stock.

What it does and why:

1. **Site URL** — the preview proxy serves the app at `https://3000-$BASE44_PUBLIC_HOST_SUFFIX`,
   so `option_home` / `option_siteurl` are filtered to that address (never hardcoded).
2. **TLS** — the proxy terminates TLS at the edge and forwards plain HTTP to Apache. Without the
   override WordPress believes the request is insecure and rewrites every same-host asset URL to
   `http://`, which the browser then blocks as mixed content inside the https preview: the site
   rendered completely unstyled. Proxy requests are recognised by the Host header the proxy
   rewrites (`*-$BASE44_SANDBOX_HOST_DOMAIN`) or the public host, and are marked as HTTPS.
   Direct `http://localhost:3000` requests are untouched.
3. **Canonical redirect** — the proxy rewrites `Host`, which would make WordPress' canonical
   redirect bounce between the public URL and the rewritten host, so `redirect_canonical` is
   removed.

## Verifying changes

There is no test suite. Useful checks:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/            # renders at all
curl -s http://localhost:3000/ | grep -o 'dir="rtl"'                      # RTL output
docker compose -f docker-compose.base44.yml exec -T wordpress php -l /var/www/html/wp-content/themes/goosht-shahrvand/functions.php
```

For layout work, a headless browser pointed at the public URL is the fastest way to check
horizontal overflow at several widths (`document.documentElement.scrollWidth - clientWidth`);
that is how the `box-sizing` bug below was found. Remember that the preview tools have a per-turn
call budget, while `docker run` does not.

Two pitfalls worth knowing:

* **Every full-width block needs `box-sizing: border-box`.** `.gsh-container` is `width:100%` with
  horizontal padding; under the default `content-box` that made every section 2×padding wider than
  the viewport (48px on desktop, 36px on a phone) and produced a sideways scrollbar on narrow
  screens. The reset lives in `style.css`.
* Absolutely positioned children with no `inset` keep their *static* position, so inside a
  horizontally scrolling carousel (where WooCommerce's screen-reader-only price labels sit) they
  can stretch the whole page. `.gsh-card` is `position: relative` and `.screen-reader-text` has
  explicit insets for that reason.

## Demo content

Created by `sandbox/seed/seed.sh` + `sandbox/seed/demo-products.php`: Persian locale (`fa_IR`,
which also makes `is_rtl()` true), six pages, two menus, one article, sidebar widgets, WooCommerce
with six demo products (prices in Toman, `IRT`), the WooCommerce pages renamed to Persian and
offline payment methods (cash on delivery, bank transfer) enabled. Demo product photos are
generated PNGs in `sandbox/seed/images/`.

## Delivering the ZIP

`scripts/build-theme-zip.sh` builds and validates `dist/goosht-shahrvand-wordpress-theme.zip` and
writes `dist/index.html`. `dist/` is mounted read-only at `/var/www/html/download`, which Apache
serves directly (the directory exists, so WordPress' rewrite rules ignore it), so the archive is
downloadable at `https://3000-$BASE44_PUBLIC_HOST_SUFFIX/download/` while the sandbox is running.
`theme/goosht-shahrvand/screenshot.png` is a real capture of the running site at 1200×900.
