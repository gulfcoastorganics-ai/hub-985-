import { getSession } from "@/lib/auth";
import { getOrders } from "@/lib/db";
import { formatPrice } from "@/lib/money";
import { ACTIVE_ORDER_STATUSES } from "@/lib/types";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminNav } from "@/components/AdminNav";
import { setOrderStatusAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="page" style={{ padding: "72px 20px" }}>
        <AdminLoginForm />
      </div>
    );
  }

  const orders = await getOrders();
  // Pending orders are unpaid abandoned checkouts - keep them out of the way.
  const live = orders.filter((o) => o.status !== "pending");
  const abandoned = orders.filter((o) => o.status === "pending");

  return (
    <div className="page" style={{ padding: "48px 20px" }}>
      <AdminNav active="orders" />

      <h1 style={{ fontSize: 32, marginBottom: 6 }}>Orders</h1>
      <p className="muted" style={{ marginBottom: 26 }}>
        {live.length} active · {abandoned.length} unpaid
      </p>

      {live.length === 0 && (
        <p className="muted">No paid orders yet.</p>
      )}

      <div style={{ display: "grid", gap: 14 }}>
        {live.map((order) => (
          <div key={order.id} className="card" style={{ padding: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>
                  {order.customerName}{" "}
                  <span className="muted" style={{ fontWeight: 400, fontSize: 14 }}>
                    · {order.customerPhone}
                  </span>
                </div>
                <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
                  #{order.id.slice(0, 8)} ·{" "}
                  {new Date(order.createdAt).toLocaleString("en-US")}
                </div>
              </div>
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

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "14px 0",
                fontSize: 15,
              }}
            >
              {order.items.map((item) => (
                <li key={item.menuItemId}>
                  {item.quantity} × {item.name}{" "}
                  <span className="muted">
                    ({formatPrice(item.price * item.quantity)})
                  </span>
                </li>
              ))}
            </ul>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                borderTop: "1px solid var(--border)",
                paddingTop: 14,
              }}
            >
              <strong style={{ fontSize: 17 }}>
                {formatPrice(order.totalAmount)}
              </strong>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {ACTIVE_ORDER_STATUSES.filter((s) => s !== order.status).map(
                  (status) => (
                    <form key={status} action={setOrderStatusAction}>
                      <input type="hidden" name="orderId" value={order.id} />
                      <input type="hidden" name="status" value={status} />
                      <button type="submit" className="btn btnSecondary btnSm">
                        {status}
                      </button>
                    </form>
                  ),
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {abandoned.length > 0 && (
        <>
          <h2 className="sectionTitle" style={{ marginTop: 44, fontSize: 22 }}>
            Unpaid / abandoned
          </h2>
          <p className="muted" style={{ fontSize: 14, marginBottom: 14 }}>
            Checkout was started but never paid. These never reached the
            kitchen.
          </p>
          <div style={{ display: "grid", gap: 8 }}>
            {abandoned.map((order) => (
              <div
                key={order.id}
                className="card"
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                }}
              >
                <span>
                  {order.customerName} · #{order.id.slice(0, 8)}
                </span>
                <span className="muted">{formatPrice(order.totalAmount)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
