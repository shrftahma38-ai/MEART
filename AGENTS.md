# AGENTS.md — پارچه‌سرای عرب‌زاده (fabric store)

فروشگاه اینترنتی پارچه: React + Vite (کلاینت) و Express + Prisma + PostgreSQL (API).
All UI copy, validation messages and seed content are Persian and the layout is RTL.

## Running in this sandbox

```bash
docker compose -f docker-compose.base44.yml up -d --build   # db + api + web
docker compose -f docker-compose.base44.yml ps              # all three must be healthy
docker compose -f docker-compose.base44.yml logs --tail 50 api
```

* `web` → host port **3000** (Vite dev server, proxies `/api` to `api:4000`, so cookies stay same-origin).
* `api` → internal only, `http://api:4000`, uploads served at `/api/uploads/<file>`.
* `db` → PostgreSQL 16 with a named volume (`db_data`). Data survives restarts and rebuilds.

### Things that bite

* `node_modules` live in named volumes (`api_node_modules`, `web_node_modules`), so dependencies are
  installed by the compose `command:` on every start (`npm ci` when the committed lockfile exists).
  Adding a dependency means editing `package.json`, then restarting the service — the lockfile in the
  repo must stay in sync, otherwise `npm ci` fails and the service never becomes healthy.
* Schema changes: edit `server/prisma/schema.prisma`; the API container runs `prisma db push` +
  `node prisma/seed.js` before booting. The seed is idempotent — it never overwrites existing products,
  settings or prices (important: all product prices must stay empty until the owner sets them).
* The API runs with `node --watch`, the client is a Vite dev server, so source edits hot-apply.
  A change to `docker-compose.base44.yml`, `.env*` or dependencies needs a restart + preview reload.
* Uploaded images are written to `server/uploads` (bind-mounted, gitignored).

## Store owner account

Seeded from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (defaults in `.env.base44-defaults`:
`admin@arabzadeh.ir` / `admin1234`). Change these for anything beyond local development — the
admin panel is at `/admin` and is enforced server-side (`requireAdmin` middleware), not just in the UI.

## Domain rules worth remembering

* `Product.price` and `Product.salePrice` are nullable on purpose. `null` means "قیمت ثبت نشده":
  no price is rendered, the add-to-cart button is disabled and the API rejects the item.
  Never seed or fall back to a fake price.
* Selling price = `salePrice` when it is lower than `price`, otherwise `price`
  (`effectivePrice` in `server/src/routes/cart.js`).
* Cart is server-side (`Cart` + `CartItem`, visitor cookie `az_cart`, merged into the user cart on
  login). Totals and shipping are always recomputed on the server.
* Orders snapshot `name`, `unitPrice`, `quantity` and line totals, so changing a product price later
  never alters completed orders. Prices/stock are re-validated at checkout.
* Payment online stays hidden and `/api/payment/*` refuses to work until `PAYMENT_GATEWAY_URL` and
  `PAYMENT_GATEWAY_KEY` exist. No payment is ever marked as paid without a gateway response.
* Store contact info, hero copy, shipping cost and payment switches are settings in the database
  (admin → تنظیمات فروشگاه), not hardcoded — empty values are hidden in the UI instead of faked.

## Verification

* `curl -s localhost:3000/api/health` → `{"ok":true}`; `curl -s localhost:3000/api/products | head -c 200`
  should list Persian product names with `"price":null`.
* End-to-end flow to check after touching cart/order/pricing code: admin logs in → set a price in
  `/admin/products` → product page shows it → add to cart → `/checkout` → order number on
  `/order-success` → order visible in `/admin/orders`. Restore the price to empty afterwards.
* No test suite is configured in this repo; verification above is manual/API-based.
