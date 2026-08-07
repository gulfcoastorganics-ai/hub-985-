# Hub 985

Online ordering for Hub 985 — loaded teas, protein shakes, and coffee.

Next.js 16 (App Router) + TypeScript · Supabase (Postgres) · Stripe Checkout ·
deploys to Vercel.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

### Environment variables

| Variable | Where to find it | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | Already set in `.env.example` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | Publishable; safe in the browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API | **Server only.** Bypasses RLS — never prefix with `NEXT_PUBLIC_` |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys | `sk_test_…` in development |
| `STRIPE_WEBHOOK_SECRET` | Printed by `stripe listen` | `whsec_…` |
| `NEXT_PUBLIC_SITE_URL` | — | `http://localhost:3000` locally |
| `ADMIN_SESSION_SECRET` | Generate one | `openssl rand -base64 32` |

`.env.local` is gitignored. Never commit real keys.

## Database

The Supabase project (`rbawvdphywypzufnpaos`, us-east-1) is **already migrated
and seeded** — 35 menu items across five categories. This repo contains no
migrations and no seed script; it reads the live schema.

Three tables:

- `menu_items` — RLS on, public `SELECT` policy for available items
- `orders` — RLS on, **zero policies**
- `admin_users` — RLS on, **zero policies**

Because `orders` and `admin_users` have no policies, the anon key cannot touch
them at all. Everything that reads or writes those tables goes through the
service-role client in `src/lib/supabase.ts`, which runs server-side only.

## Testing payments locally

```bash
npm run dev
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_…` it prints into `STRIPE_WEBHOOK_SECRET` and restart `npm run
dev`. Then order something and pay with test card `4242 4242 4242 4242`, any
future expiry, any CVC. The order should appear as `paid` in `/admin`.

## How ordering works

1. Cart lives in `localStorage`, snapshotting each item's **name and price** at
   the moment it's added — later menu edits never rewrite past orders.
2. `POST /api/checkout` re-reads prices from the database and recomputes the
   total server-side. A tampered cart cannot change what is charged.
3. The order is written as `pending`, then a Stripe Checkout Session is created
   with `price_data` line items built from the cart. No Stripe Products or
   Prices are pre-registered, so menu edits never need a Stripe sync.
4. `POST /api/webhooks/stripe` verifies the signature against the raw body and
   flips the order to `paid`.
5. `/order/success` shows the confirmation.

The webhook is the source of truth, not the success redirect. The paid
transition is guarded by `.eq("status", "pending")`, so a Stripe retry or a
duplicate delivery cannot walk an order that staff already advanced back to
`paid`.

## Admin

`/admin` is password-gated against the single `admin_users` row. It provides
order status management and menu CRUD including availability toggles.

To set or reset the password, generate a bcrypt hash (cost 12) and update the
row directly in Supabase:

```js
require("bcryptjs").hashSync("your-new-password", 12)
```

## Deploying to Vercel

Import the repo, then add every variable from the table above to the Vercel
project (set `NEXT_PUBLIC_SITE_URL` to the production domain). After the first
deploy, register the production webhook in Stripe → Developers → Webhooks:

- Endpoint: `https://<your-domain>/api/webhooks/stripe`
- Event: `checkout.session.completed`

Copy that endpoint's signing secret into `STRIPE_WEBHOOK_SECRET` in Vercel and
redeploy. The `stripe listen` secret is for local development only.

## Project layout

```
src/app/                 routes (public, /admin, /api)
src/components/          cart + admin UI
src/lib/supabase.ts      anon and service-role clients
src/lib/db.ts            row → domain mapping, queries
src/lib/auth.ts          admin session (server-only)
src/lib/shop.ts          hours, address, contact
src/app/globals.css      design tokens
```

## Known gaps

- **Storefront details are placeholders.** Hours, address, phone and email in
  `src/lib/shop.ts` are invented — replace them before launch.
- **Styling is a neutral system, not the Claude Design prototype.** Every
  color, font, radius and spacing value resolves through the `:root` token
  block at the top of `src/app/globals.css`, so matching the prototype means
  editing that block rather than touching components.
- **No end-to-end payment run yet.** The build environment has no network
  egress to `api.stripe.com` or `*.supabase.co`, so the full
  checkout → webhook → `paid` flow has not been exercised against live
  services. Webhook idempotency was verified directly against the database.
- Orders are pickup only; there is no delivery, tipping, or scheduling.
