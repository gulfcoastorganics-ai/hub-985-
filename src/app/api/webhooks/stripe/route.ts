import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";

// Signature verification needs the raw body, so this must run on Node.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set - refusing to process webhook");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  // request.text() gives the exact bytes Stripe signed.
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (error) {
    // An unverified payload is not trusted for any reason.
    console.error("Stripe webhook signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    // Acknowledge everything else so Stripe stops retrying.
    return NextResponse.json({ received: true, ignored: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Only a session that actually paid should mark an order paid.
  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true, ignored: "unpaid session" });
  }

  const orderId = session.metadata?.orderId ?? null;
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);

  const supabase = createServiceClient();

  const update = {
    status: "paid" as const,
    stripe_session_id: session.id,
    stripe_payment_intent_id: paymentIntentId,
    updated_at: new Date().toISOString(),
  };

  // Prefer the metadata id; fall back to the session id if metadata is absent.
  // `.eq("status", "pending")` makes this idempotent - Stripe retries and
  // duplicate deliveries cannot walk an order backwards from preparing/ready.
  const query = supabase.from("orders").update(update).eq("status", "pending");
  const { data, error } = orderId
    ? await query.eq("id", orderId).select("id")
    : await query.eq("stripe_session_id", session.id).select("id");

  if (error) {
    // 500 tells Stripe to retry - the order is still pending and must be fixed.
    console.error("Failed to mark order paid", { orderId, sessionId: session.id, error });
    return NextResponse.json({ error: "Database update failed" }, { status: 500 });
  }

  if (!data || data.length === 0) {
    // Already processed, or the order was advanced by an admin. Not an error.
    return NextResponse.json({ received: true, alreadyProcessed: true });
  }

  return NextResponse.json({ received: true, orderId: data[0].id });
}
