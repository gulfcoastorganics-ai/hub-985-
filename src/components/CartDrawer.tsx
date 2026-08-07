"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/money";

export function CartDrawer() {
  const { items, subtotal, isOpen, close, setQuantity, remove } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function checkout(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
          })),
          customerName: name,
          customerPhone: phone,
          customerEmail: email || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Could not start checkout. Please try again.");
        return;
      }
      // Cart is intentionally NOT cleared here - if the customer abandons
      // Stripe Checkout they come back to an intact cart. It is cleared on
      // the confirmation page once payment is confirmed.
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(28,27,24,0.45)",
        zIndex: 100,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(420px, 100%)",
          background: "var(--surface)",
          height: "100%",
          overflowY: "auto",
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <h2 style={{ fontSize: 22 }}>Your order</h2>
          <button className="btn btnSecondary btnSm" onClick={close}>
            Close
          </button>
        </div>

        {items.length === 0 ? (
          <p className="muted">Your cart is empty.</p>
        ) : (
          <>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {items.map((item) => (
                <li
                  key={item.menuItemId}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div className="muted" style={{ fontSize: 14 }}>
                      {formatPrice(item.price)} each
                    </div>
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={item.quantity}
                    onChange={(e) =>
                      setQuantity(item.menuItemId, Number(e.target.value))
                    }
                    className="input"
                    style={{ width: 68, padding: "6px 8px" }}
                    aria-label={`Quantity for ${item.name}`}
                  />
                  <button
                    className="btn btnDanger btnSm"
                    onClick={() => remove(item.menuItemId)}
                    aria-label={`Remove ${item.name}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
                fontSize: 18,
                margin: "18px 0",
              }}
            >
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="muted" style={{ fontSize: 13, marginTop: -12 }}>
              Tax is calculated at checkout.
            </p>

            <form onSubmit={checkout} style={{ marginTop: 20 }}>
              <div className="field">
                <label className="label" htmlFor="cart-name">
                  Name
                </label>
                <input
                  id="cart-name"
                  className="input"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="cart-phone">
                  Phone
                </label>
                <input
                  id="cart-phone"
                  className="input"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="cart-email">
                  Email <span style={{ fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  id="cart-email"
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && <div className="errorBox">{error}</div>}

              <button
                type="submit"
                className="btn btnPrimary"
                style={{ width: "100%", marginTop: 12 }}
                disabled={submitting}
              >
                {submitting ? "Starting checkout…" : "Checkout"}
              </button>
            </form>
          </>
        )}
      </aside>
    </div>
  );
}
