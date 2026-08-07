import Link from "next/link";
import { getOrderBySessionId } from "@/lib/db";
import { formatPrice } from "@/lib/money";
import { SHOP, phoneHref } from "@/lib/shop";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    return (
      <div className="page" style={{ padding: "72px 20px" }}>
        <h1 style={{ fontSize: 36 }}>Order not found</h1>
        <p className="muted" style={{ marginTop: 12 }}>
          We couldn&apos;t find a checkout session on this link.
        </p>
        <Link href="/menu" className="btn btnPrimary" style={{ marginTop: 20 }}>
          Back to menu
        </Link>
      </div>
    );
  }

  const order = await getOrderBySessionId(sessionId);

  // The webhook is the source of truth and can land a moment after the
  // redirect, so `pending` here means "not confirmed yet", not "failed".
  const confirmed = order !== null && order.status !== "pending";

  return (
    <div className="page" style={{ padding: "72px 20px", maxWidth: 680 }}>
      {confirmed && <ClearCartOnMount />}

      <h1 style={{ fontSize: 38 }}>
        {confirmed ? "Thanks — you're all set!" : "Confirming your payment…"}
      </h1>
      <p className="muted" style={{ marginTop: 12, fontSize: 17 }}>
        {confirmed ? (
          <>
            We&apos;ve got your order and started on it. Pick up at {SHOP.name}
            {order?.customerName ? ` under ${order.customerName}` : ""}.
          </>
        ) : (
          <>
            Your payment went through and we&apos;re just recording it. This
            page updates as soon as it&apos;s confirmed — refresh in a moment.
          </>
        )}
      </p>

      {order && (
        <div className="card" style={{ padding: 24, marginTop: 28 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h2 style={{ fontSize: 19 }}>Order summary</h2>
            <span
              className="badge"
              style={{
                background: `var(--status-${order.status}-bg)`,
                color: `var(--status-${order.status})`,
              }}
            >
              {order.status}
            </span>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {order.items.map((item) => (
              <li
                key={item.menuItemId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span>
                  {item.quantity} × {item.name}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 700,
              fontSize: 18,
              marginTop: 16,
            }}
          >
            <span>Total</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>

          <p className="muted" style={{ fontSize: 13, marginTop: 14 }}>
            Order reference <code>{order.id.slice(0, 8)}</code> · questions?
            Call{" "}
            <a href={phoneHref()}>{SHOP.phone}</a>
          </p>
        </div>
      )}

      <Link href="/menu" className="btn btnSecondary" style={{ marginTop: 24 }}>
        Order something else
      </Link>
    </div>
  );
}
