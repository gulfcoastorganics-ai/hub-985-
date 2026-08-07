import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Two clients, deliberately separated.
 *
 * `orders` and `admin_users` have RLS enabled with *zero* policies, so the
 * anon key can read neither. Only `menu_items` has a public SELECT policy.
 * That means anything touching orders must go through the service-role
 * client, and the service-role client must never reach the browser.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

/** Browser-safe client. Subject to RLS. Only sees public menu data. */
export function createAnonClient(): SupabaseClient {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    { auth: { persistSession: false } },
  );
}

/**
 * Server-only client. Bypasses RLS entirely.
 * Importing this into a client component will throw at request time because
 * SUPABASE_SERVICE_ROLE_KEY is not exposed to the browser bundle.
 */
export function createServiceClient(): SupabaseClient {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
