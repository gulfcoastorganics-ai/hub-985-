import "server-only";
import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { createServiceClient } from "@/lib/supabase";

const COOKIE_NAME = "hub985_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set to a random string of at least 16 characters.",
    );
  }
  return value;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/**
 * Stateless signed session: `<adminId>.<expiresAt>.<hmac>`. There is a single
 * admin and no revocation requirement, so a signed cookie avoids needing a
 * sessions table. Tampering fails the HMAC; replay past expiry fails the
 * timestamp check.
 */
function issueToken(adminId: string): string {
  const payload = `${adminId}.${Date.now() + SESSION_TTL_MS}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [adminId, expiresAt, signature] = parts;

  const expected = sign(`${adminId}.${expiresAt}`);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  const expiry = Number(expiresAt);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return null;

  return adminId;
}

export interface LoginResult {
  ok: boolean;
  error?: string;
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, password_hash")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error) return { ok: false, error: "Could not reach the database." };

  // Compare against a dummy hash when the user is missing so that a wrong
  // email and a wrong password take the same amount of time.
  const hash =
    (data?.password_hash as string | undefined) ??
    "$2a$12$" + "x".repeat(53);
  const valid = await bcrypt.compare(password, hash);

  if (!data || !valid) return { ok: false, error: "Incorrect email or password." };

  const jar = await cookies();
  jar.set(COOKIE_NAME, issueToken(data.id as string), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });

  return { ok: true };
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

/** Returns the admin id when a valid session cookie is present. */
export async function getSession(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    // A missing/short ADMIN_SESSION_SECRET throws - treat as unauthenticated.
    return null;
  }
}

export async function requireSession(): Promise<string> {
  const adminId = await getSession();
  if (!adminId) throw new Error("Not authenticated");
  return adminId;
}

/** Helper for generating a secret during setup. */
export function generateSecret(): string {
  return randomBytes(32).toString("base64url");
}
