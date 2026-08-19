# Hub 985

Online ordering for Hub 985 Nutrition — loaded teas, protein shakes, and coffee.

Next.js 16 (App Router) + TypeScript · Supabase (Postgres) · Stripe Checkout · Vercel.

## Production status

The application has an active `READY` production deployment on Vercel. The current storefront uses verified Hub 985 business details from `src/lib/shop.ts`, real cafe photography, and the dark Hub 985 brand treatment implemented in the latest production commits.

The remaining release gate is a full production checkout verification against the configured Stripe and Supabase services: cart → Checkout Session → successful payment → signed webhook → order becomes `paid` → admin workflow. The code and deployment are live, but that external payment path should not be called verified until the complete flow has been exercised with the production configuration.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-safe Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only database access; never expose to the browser |
| `STRIPE_SECRET_KEY` | Server-side Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `ADMIN_SESSION_SECRET` | Admin session signing secret |

`.env.local` is gitignored. Never commit real keys.

## Database

The configured Supabase project contains the production menu data. The application uses three core tables:

- `menu_items` — public read access for available menu items;
- `orders` — server-side access only;
- `admin_users` — server-side access only.

`orders` and `admin_users` are accessed through the service-role client on the server. The service-role key must never be prefixed with `NEXT_PUBLIC_` or used in client components.

## Ordering flow

1. The customer builds a cart in the browser.
2. `POST /api/checkout` re-reads current menu prices from Supabase and recomputes the total server-side.
3. The server creates a pending order and a Stripe Checkout Session.
4. Stripe sends `checkout.session.completed` to `/api/webhooks/stripe`.
5. The webhook verifies the Stripe signature and transitions a pending order to `paid`.
6. Staff manage orders through `/admin`.

The webhook is the payment source of truth; the success redirect is not trusted as proof of payment. The paid transition is guarded so duplicate Stripe deliveries do not roll an already-advanced order backward.

## Testing payments locally

```bash
npm run dev
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Use Stripe test mode and copy the listener's `whsec_…` value into `STRIPE_WEBHOOK_SECRET` for local development. The listener secret is not the production webhook secret.

## Admin

`/admin` is password-gated against the configured admin user and provides order status management plus menu CRUD and availability controls.

## Deploying to Vercel

The repository is already connected to a Vercel production project. For configuration changes:

1. keep all required environment variables present in the production environment;
2. set `NEXT_PUBLIC_SITE_URL` to the production domain;
3. register `/api/webhooks/stripe` in the Stripe production/test environment being used;
4. copy that endpoint's signing secret into Vercel as `STRIPE_WEBHOOK_SECRET`;
5. redeploy after environment changes;
6. run the end-to-end checkout verification before treating payments as fully launch-verified.

## Project layout

```text
src/app/                 routes (public, /admin, /api)
src/components/          cart + admin UI
src/lib/supabase.ts      anon and service-role clients
src/lib/db.ts            row → domain mapping, queries
src/lib/auth.ts          admin session (server-only)
src/lib/shop.ts          verified hours, address, phone, contact data
src/app/globals.css      Hub 985 design tokens and global styling
```

## Current launch gate

- [x] Production Vercel deployment is `READY`
- [x] Verified storefront contact details are in the application
- [x] Production brand styling and cafe imagery are present
- [x] Server-side price recomputation and signed webhook handling are implemented
- [x] No grouped Vercel runtime errors observed in the latest seven-day audit window
- [ ] Complete one full Stripe/Supabase payment-to-admin production verification with the deployment's configured credentials
