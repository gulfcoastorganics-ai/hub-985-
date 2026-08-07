"use client";

import { useCart } from "@/components/CartProvider";
import type { MenuItem } from "@/lib/types";

export function AddToCartButton({ item }: { item: MenuItem }) {
  const { add } = useCart();
  return (
    <button className="btn btnPrimary btnSm" onClick={() => add(item)}>
      Add
    </button>
  );
}
