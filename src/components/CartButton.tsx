"use client";

import { useCart } from "@/components/CartProvider";
import { CartDrawer } from "@/components/CartDrawer";

export function CartButton() {
  const { itemCount, open } = useCart();

  return (
    <>
      <button className="btn btnPrimary btnSm" onClick={open}>
        Cart
        {itemCount > 0 && (
          <span
            style={{
              background: "rgba(255,255,255,0.25)",
              borderRadius: 999,
              padding: "0 7px",
              fontSize: 12,
            }}
          >
            {itemCount}
          </span>
        )}
      </button>
      <CartDrawer />
    </>
  );
}
