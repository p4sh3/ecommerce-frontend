import "server-only";
import { cookies } from "next/headers";
import type { Order, Product } from "@/lib/types";

const apiBase = (
  process.env.API_BASE_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
    cache: init?.cache ?? "no-store",
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      body.message || `La API respondió con error (${response.status}).`,
    );
  return body as T;
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${apiBase}/products`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 120, tags: ["products"] },
  });
  if (!response.ok) throw new Error(`API ${response.status}`);
  const body = await response.json();
  return body.data as Product[];
}

export async function getProduct(id: string): Promise<Product | null> {
  const response = await fetch(
    `${apiBase}/products/${encodeURIComponent(id)}`,
    {
      headers: { Accept: "application/json" },
      next: { revalidate: 120, tags: ["products"] },
    },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`API ${response.status}`);
  const body = await response.json();
  return body.data as Product;
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("ecommerce_token")?.value;
}

export async function getOrders(token: string): Promise<Order[]> {
  const result = await apiRequest<{ data: Order[] }>("/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return result.data;
}

export async function getOrder(token: string, orderId: number): Promise<Order> {
  const result = await apiRequest<{ data: Order }>(`/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return result.data;
}
