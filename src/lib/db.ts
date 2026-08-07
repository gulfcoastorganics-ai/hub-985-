import { createServiceClient } from "@/lib/supabase";
import type {
  MenuItem,
  MenuItemRow,
  Order,
  OrderRow,
  OrderStatus,
} from "@/lib/types";

export function toMenuItem(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category,
    imageUrl: row.image_url,
    available: row.available,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    items: row.items ?? [],
    totalAmount: row.total_amount,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    status: row.status,
    stripeSessionId: row.stripe_session_id,
    stripePaymentIntentId: row.stripe_payment_intent_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Display order for menu categories. Anything not listed here sorts to the
 * end alphabetically, so a new category added in the database still renders
 * without a code change.
 */
const CATEGORY_ORDER = [
  "Loaded Teas",
  "Protein Shakes",
  "Protein Coffee",
  "New Flavors",
  "Seasonal",
];

export function sortCategories(categories: string[]): string[] {
  return [...categories].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });
}

export interface MenuSection {
  category: string;
  items: MenuItem[];
}

/** Group a flat menu list into ordered sections for rendering. */
export function groupByCategory(items: MenuItem[]): MenuSection[] {
  const byCategory = new Map<string, MenuItem[]>();
  for (const item of items) {
    const bucket = byCategory.get(item.category);
    if (bucket) bucket.push(item);
    else byCategory.set(item.category, [item]);
  }
  return sortCategories([...byCategory.keys()]).map((category) => ({
    category,
    items: (byCategory.get(category) ?? []).sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
  }));
}

/**
 * Public menu: only items marked available.
 * Uses the service client so the page renders identically whether or not the
 * anon policy changes later.
 */
export async function getAvailableMenuItems(): Promise<MenuItem[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("available", true)
    .order("name");

  if (error) throw new Error(`Failed to load menu: ${error.message}`);
  return (data as MenuItemRow[]).map(toMenuItem);
}

/** Admin menu: every item, available or not. */
export async function getAllMenuItems(): Promise<MenuItem[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("category")
    .order("name");

  if (error) throw new Error(`Failed to load menu: ${error.message}`);
  return (data as MenuItemRow[]).map(toMenuItem);
}

export async function getMenuItemsByIds(ids: string[]): Promise<MenuItem[]> {
  if (ids.length === 0) return [];
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .in("id", ids);

  if (error) throw new Error(`Failed to load menu items: ${error.message}`);
  return (data as MenuItemRow[]).map(toMenuItem);
}

export async function getOrders(): Promise<Order[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error(`Failed to load orders: ${error.message}`);
  return (data as OrderRow[]).map(toOrder);
}

export async function getOrderBySessionId(
  sessionId: string,
): Promise<Order | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (error) throw new Error(`Failed to load order: ${error.message}`);
  return data ? toOrder(data as OrderRow) : null;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(`Failed to update order: ${error.message}`);
}
