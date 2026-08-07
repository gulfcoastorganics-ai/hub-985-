"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { MenuItem, OrderItem } from "@/lib/types";

const STORAGE_KEY = "hub985.cart.v1";

interface CartContextValue {
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  add: (item: MenuItem) => void;
  setQuantity: (menuItemId: string, quantity: number) => void;
  remove: (menuItemId: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function isOrderItem(value: unknown): value is OrderItem {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.menuItemId === "string" &&
    typeof v.name === "string" &&
    typeof v.price === "number" &&
    typeof v.quantity === "number" &&
    v.quantity > 0
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore once on mount. Anything malformed is discarded rather than trusted.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.filter(isOrderItem));
      }
    } catch {
      // Corrupt storage is not worth surfacing - start with an empty cart.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add = useCallback((menuItem: MenuItem) => {
    setItems((current) => {
      const existing = current.find((i) => i.menuItemId === menuItem.id);
      if (existing) {
        return current.map((i) =>
          i.menuItemId === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      // Snapshot name and price - the order must not follow later menu edits.
      return [
        ...current,
        {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback((menuItemId: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((i) => i.menuItemId !== menuItemId)
        : current.map((i) =>
            i.menuItemId === menuItemId ? { ...i, quantity } : i,
          ),
    );
  }, []);

  const remove = useCallback((menuItemId: string) => {
    setItems((current) => current.filter((i) => i.menuItemId !== menuItemId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      isOpen,
      add,
      setQuantity,
      remove,
      clear,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    };
  }, [items, isOpen, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside a CartProvider");
  return context;
}
