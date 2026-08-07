"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { login, logout, requireSession } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase";
import { updateOrderStatus } from "@/lib/db";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

export async function loginAction(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const result = await login(email, password);
  if (!result.ok) return { error: result.error ?? "Login failed." };

  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin");
}

function parseStatus(value: unknown): OrderStatus {
  const status = String(value ?? "");
  if (!(ORDER_STATUSES as readonly string[]).includes(status)) {
    throw new Error(`Unknown order status: ${status}`);
  }
  return status as OrderStatus;
}

export async function setOrderStatusAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("orderId") ?? "");
  const status = parseStatus(formData.get("status"));
  if (!id) throw new Error("Missing order id");

  await updateOrderStatus(id, status);
  revalidatePath("/admin");
}

export async function toggleAvailabilityAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("itemId") ?? "");
  const available = formData.get("available") === "true";
  if (!id) throw new Error("Missing item id");

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("menu_items")
    .update({ available, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
}

/** Parse a price typed as dollars ("9.50") into integer cents. */
function parsePriceToCents(raw: string): number {
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error("Price must be a positive number.");
  }
  return Math.round(value * 100);
}

export async function saveMenuItemAction(formData: FormData) {
  await requireSession();

  const id = String(formData.get("itemId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const price = parsePriceToCents(String(formData.get("price") ?? ""));

  if (!name || !category) throw new Error("Name and category are required.");

  const supabase = createServiceClient();
  const payload = {
    name,
    description,
    price,
    category,
    image_url: imageUrl || null,
    available: formData.get("available") === "on",
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await supabase.from("menu_items").update(payload).eq("id", id)
    : await supabase.from("menu_items").insert(payload);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  redirect("/admin/menu");
}

export async function deleteMenuItemAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("itemId") ?? "");
  if (!id) throw new Error("Missing item id");

  const supabase = createServiceClient();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
}
