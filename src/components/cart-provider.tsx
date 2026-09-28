"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import type { CartItem, Product } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  count: number;
  add: (product: Product) => void;
  changeQuantity: (productId: number, delta: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
};
const CartContext = createContext<CartContextValue | null>(null);
const emptyCart: CartItem[] = [];
let cartItems = emptyCart;
let storageLoaded = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!storageLoaded && typeof window !== "undefined") {
    try {
      const saved = JSON.parse(
        localStorage.getItem("punto-tech-cart") || "[]",
      ) as CartItem[];
      cartItems = Array.isArray(saved)
        ? saved.filter((item) => item?.product?.id && item.quantity > 0)
        : emptyCart;
    } catch {
      localStorage.removeItem("punto-tech-cart");
      cartItems = emptyCart;
    }
    storageLoaded = true;
  }
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return cartItems;
}
function getServerSnapshot() {
  return emptyCart;
}

function updateCart(update: (current: CartItem[]) => CartItem[]) {
  cartItems = update(cartItems);
  try {
    localStorage.setItem("punto-tech-cart", JSON.stringify(cartItems));
  } catch {}
  listeners.forEach((listener) => listener());
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function add(product: Product) {
    if (product.stock < 1) return;
    updateCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing)
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item,
        );
      return [...current, { product, quantity: 1 }];
    });
  }
  function changeQuantity(productId: number, delta: number) {
    updateCart((current) =>
      current.flatMap((item) => {
        if (item.product.id !== productId) return [item];
        const quantity = Math.min(item.product.stock, item.quantity + delta);
        return quantity > 0 ? [{ ...item, quantity }] : [];
      }),
    );
  }
  const value = {
    items,
    count: items.reduce((total, item) => total + item.quantity, 0),
    add,
    changeQuantity,
    remove: (productId: number) =>
      updateCart((current) =>
        current.filter((item) => item.product.id !== productId),
      ),
    clear: () => updateCart(() => emptyCart),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider.");
  return context;
}
