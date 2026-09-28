"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";

export default function StoreHeader() {
  const { count } = useCart();
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Punto, inicio">
        <span className="brand-mark">p.</span> Punto
      </Link>
      <nav className="header-nav" aria-label="Navegación principal">
        <Link className="optional-link" href="/#catalogo">
          Tienda
        </Link>
        <Link href="/account/orders">Mis compras</Link>
        <Link className="optional-link" href="/login">
          Entrar
        </Link>
        <Link
          className="header-cart"
          href="/checkout"
          aria-label={`Carrito, ${count} productos`}
        >
          <ShoppingBag size={17} aria-hidden="true" />
          <span>Carrito</span>
          <small>{count}</small>
        </Link>
      </nav>
    </header>
  );
}
