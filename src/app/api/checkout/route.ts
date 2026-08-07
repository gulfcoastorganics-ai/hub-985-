import { NextResponse } from "next/server";
import { getMenuItemsByIds } from "@/lib/db";
import { createServiceClient } from "@/lib/supabase";
import { getStripe, siteUrl } from "@/lib/stripe";
import type { OrderItem } from "@/lib/types";

export const runtime = "nodejs";

interface CheckoutRequestItem {
  menuItemId: string;
  quantity: number;
}

interface CheckoutRequest {
  items: CheckoutRequestItem[];
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
}

const MAX_QUANTITY_PER_ITEM = 99;

function parseBody(body: unknown): CheckoutRequest | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;

  if (!Array.isArray(b.items) || b.items.length === 0) return null;
  const items: CheckoutRequestItem[] = [];
  for (const raw of b.items) {
    if (typeof raw !== "object" || raw === null) return null;
    const r = raw as Record<string, unknown>;
    const quantity = Number(r.quantity);
    if (typeof r.menuItemId !== "string" || !Number.isInteger(quantity)) {
      return null;
    }
    if (quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) return null;
    items.push({ menuItemId: r.menuItemId, quantity });
  }

  const customerName = typeof b.customerName === "string" ? b.customerName.trim() : "";
  const customerPhone = typeof b.customerPhone === "string" ? b.customerPhone.trim() : "";
  if (!customerName || !customerPhone) return null;

  const rawEmail = typeof b.customerEmail === "string" ? b.customerEmail.trim() : "";

  return {
    items,
    customerName,
    customerPhone,
    customerEmail: rawEmail || null,
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parseBody(body);
  if (!parsed) {
    return NextResponse.json(
      { error: "Invalid order. Please check your cart and contact details." },
      { status: 400 },
    );
  }

  // Prices come from the database, never from the client. A tampered cart
  // cannot change what the customer is charged.
  const ids = [...new Set(parsed.items.map((i) => i.menuItemId))];
  const menuItems = await getMenuItemsByIds(ids);
  const byId = new Map(menuItems.map((m) => [m.id, m]));

  const orderItems: OrderItem[] = [];
  for (const requested of parsed.items) {
    const menuItem = byId.get(requested.menuItemId);
    if (!menuItem) {
      return NextResponse.json(
        { error: "An item in your cart is no longer on the menu." },
        { status: 409 },
      );
    }
    if (!menuItem.available) {
      return NextResponse.json(
        { error: `${menuItem.name} just sold out. Please remove it and try again.` },
        { status: 409 },
      );
    }
    orderItems.push({
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: requested.quantity,
    });
  }

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const supabase = createServiceClient();

  // Persist the order as `pending` before redirecting. If the customer
  // abandons Stripe Checkout the row simply stays pending.
  const { data: inserted, error: insertError } = await supabase
    .from("orders")
    .insert({
      items: orderItems,
      total_amount: totalAmount,
      customer_name: parsed.customerName,
      customer_phone: parsed.customerPhone,
      customer_email: parsed.customerEmail,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    return NextResponse.json(
      { error: "Could not create your order. Please try again." },
      { status: 500 },
    );
  }

  const orderId = inserted.id as string;

  try {
    // Line items are built from the cart at checkout time. No Stripe Products
    // or Prices are pre-registered, so menu edits never need a Stripe sync.
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: orderItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: item.price,
          product_data: { name: item.name },
        },
      })),
      customer_email: parsed.customerEmail ?? undefined,
      // The webhook is the source of truth; metadata lets it find the order
      // even if the success redirect never happens.
      metadata: { orderId },
      payment_intent_data: { metadata: { orderId } },
      success_url: `${siteUrl()}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/menu`,
    });

    const { error: updateError } = await supabase
      .from("orders")
      .update({ stripe_session_id: session.id, updated_at: new Date().toISOString() })
      .eq("id", orderId);

    if (updateError) {
      // Non-fatal: the webhook can still resolve the order via metadata.
      console.error("Failed to attach session id to order", orderId, updateError);
    }

    return NextResponse.json({ url: session.url, orderId });
  } catch (error) {
    // Roll the pending order back so an unreachable Stripe does not leave
    // orphaned rows behind.
    await supabase.from("orders").delete().eq("id", orderId);
    console.error("Stripe checkout session creation failed", error);
    return NextResponse.json(
      { error: "Could not reach payments. Please try again." },
      { status: 502 },
    );
  }
}
