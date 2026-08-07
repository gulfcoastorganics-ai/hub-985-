"use client";

import { useEffect } from "react";
import { useCart } from "@/components/CartProvider";

/**
 * Emptied only once payment is confirmed. If the customer bails out of Stripe
 * Checkout they return to /menu with their cart still intact.
 */
export function ClearCartOnMount() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
