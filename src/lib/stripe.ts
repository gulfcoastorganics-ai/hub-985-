import Stripe from "stripe";

let client: Stripe | null = null;

/**
 * Lazily constructed so that importing this module (e.g. during `next build`)
 * does not require STRIPE_SECRET_KEY to be present.
 */
export function getStripe(): Stripe {
  if (client) return client;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing required environment variable STRIPE_SECRET_KEY");

  // No explicit apiVersion - use the version the installed SDK was built for.
  client = new Stripe(key);
  return client;
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
