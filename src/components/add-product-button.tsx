"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/types";

export default function AddProductButton({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <button
      className="button button-dark"
      type="button"
      onClick={() => add(product)}
      disabled={product.stock < 1}
    >
      <ShoppingBag size={16} /> Agregar al carrito
    </button>
  );
}
