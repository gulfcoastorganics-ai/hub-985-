/**
 * Types mirroring the live Supabase schema (project ref rbawvdphywypzufnpaos).
 * The database is already migrated and seeded - these types describe what is
 * there, they do not define it. Column names are snake_case in Postgres and
 * mapped to camelCase at the data-access boundary in `src/lib/db.ts`.
 */

export const ORDER_STATUSES = [
  "pending",
  "paid",
  "preparing",
  "ready",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Statuses an admin can move an order to from the dashboard. */
export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  "paid",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  /** Integer cents. Never a float - money is not a float. */
  price: number;
  category: string;
  imageUrl: string | null;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * A line item snapshot stored on the order. These are copies of the menu item
 * values *at the time of ordering*, not live references - if the kitchen
 * renames an item or changes its price tomorrow, past orders must not change.
 */
export interface OrderItem {
  menuItemId: string;
  name: string;
  /** Integer cents, snapshotted at checkout. */
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  /** Integer cents. Recomputed server-side, never trusted from the client. */
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  status: OrderStatus;
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
}

/** Raw row shapes as returned by postgrest (snake_case). */
export interface MenuItemRow {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderRow {
  id: string;
  items: OrderItem[];
  total_amount: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  status: OrderStatus;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
}
