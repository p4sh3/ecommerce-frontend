"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiRequest } from "@/lib/api";
import type { CartItem, Order } from "@/lib/types";

const cookieName = "ecommerce_token";

async function saveToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function loginAction(formData: FormData) {
  try {
    const result = await apiRequest<{ data: { token: string } }>(
      "/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(formData.get("email") || ""),
          password: String(formData.get("password") || ""),
        }),
      },
    );
    await saveToken(result.data.token);
  } catch {
    redirect("/login?error=credentials");
  }
  revalidatePath("/");
  redirect("/account/orders");
}

export async function registerAction(formData: FormData) {
  try {
    const result = await apiRequest<{ data: { token: string } }>(
      "/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") || ""),
          email: String(formData.get("email") || ""),
          password: String(formData.get("password") || ""),
          password_confirmation: String(
            formData.get("password_confirmation") || "",
          ),
        }),
      },
    );
    await saveToken(result.data.token);
  } catch {
    redirect("/register?error=register");
  }
  revalidatePath("/");
  redirect("/account/orders");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (token) {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
  }
  cookieStore.delete(cookieName);
  revalidatePath("/");
  redirect("/");
}

export async function createCheckoutOrder(items: CartItem[]) {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (!token)
    return {
      success: false as const,
      error: "Inicia sesión para continuar con tu compra.",
    };
  if (!items.length)
    return { success: false as const, error: "Tu carrito está vacío." };
  try {
    const created = await apiRequest<{ data: Order }>("/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: items.map(({ product, quantity }) => ({
          product_id: product.id,
          quantity,
        })),
      }),
    });
    revalidatePath("/");
    revalidatePath("/account/orders");
    const payment = await apiRequest<{ data: { client_secret: string } }>(
      `/orders/${created.data.id}/payment`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` } },
    );
    return {
      success: true as const,
      orderId: created.data.id,
      clientSecret: payment.data.client_secret,
    };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "No pudimos iniciar el pago.",
    };
  }
}
