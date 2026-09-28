"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatPrice, productImage } from "@/lib/presentation";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <article className="product-card">
      <Link
        className="product-photo-link"
        href={`/products/${product.id}`}
        aria-label={`Ver ${product.name}`}
      >
        <Image
          className="product-photo"
          src={productImage(product.id)}
          alt={product.name}
          width={1000}
          height={830}
          sizes="(max-width: 600px) 48vw, (max-width: 850px) 48vw, 25vw"
          unoptimized
        />
        <span className="product-badge">Equipo esencial</span>
      </Link>
      <div className="product-info">
        <h3>
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p>
          {product.description ||
            "Un accesorio práctico para mejorar tu espacio de trabajo o entretenimiento."}
        </p>
        <div className="product-actions">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button
            className="icon-button"
            type="button"
            aria-label={`Agregar ${product.name} al carrito`}
            onClick={() => add(product)}
            disabled={product.stock < 1}
          >
            <Plus size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}
