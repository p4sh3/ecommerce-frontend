"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { createCheckoutOrder } from "@/app/actions";
import { formatPrice, productImage } from "@/lib/presentation";
import PaymentPanel from "@/components/payment-panel";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const stripeConfigured =
  (stripeKey.startsWith("pk_test_") || stripeKey.startsWith("pk_live_")) &&
  !stripeKey.endsWith("replace_me");

export default function CheckoutContent({
  authenticated,
}: {
  authenticated: boolean;
}) {
  const { items, changeQuantity, remove, clear } = useCart();
  const [payment, setPayment] = useState<{
    orderId: number;
    clientSecret: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );
  async function beginCheckout() {
    setError("");
    setBusy(true);
    const result = await createCheckoutOrder(items);
    setBusy(false);
    if (result.success)
      setPayment({
        orderId: result.orderId,
        clientSecret: result.clientSecret,
      });
    else setError(result.error);
  }
  if (payment)
    return (
      <div className="checkout-layout">
        <section className="checkout-section">
          <h2>Pago seguro</h2>
          <p className="page-intro">
            Tu orden #{payment.orderId} está lista. Completa el pago para
            confirmar la compra.
          </p>
          <PaymentPanel
            clientSecret={payment.clientSecret}
            orderId={payment.orderId}
            onPaid={clear}
          />
        </section>
        <aside className="summary-box">
          <h2>Resumen</h2>
          <div className="summary-row">
            <span>Productos</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <p className="muted-small">
            El pago se procesa de forma segura con Stripe.
          </p>
        </aside>
      </div>
    );
  if (!items.length)
    return (
      <div className="center-state">
        <p className="eyebrow">TU ESPACIO EMPIEZA AQUÍ</p>
        <h1 className="page-title">Tu carrito está vacío.</h1>
        <p className="page-intro">
          Encuentra accesorios para tu trabajo, tus juegos y tus ideas.
        </p>
        <Link className="button button-dark" href="/#catalogo">
          Ver equipos <span>↘</span>
        </Link>
      </div>
    );
  return (
    <div className="checkout-layout">
      <section className="checkout-section">
        <h2>Tu selección</h2>
        {items.map(({ product, quantity }) => (
          <article className="cart-line" key={product.id}>
            <Image
              src={productImage(product.id)}
              alt=""
              width={160}
              height={160}
              sizes="72px"
              unoptimized
            />
            <div>
              <h3>{product.name}</h3>
              <p>{formatPrice(product.price)} por unidad</p>
              <div className="quantity-control">
                <button
                  type="button"
                  aria-label={`Quitar una unidad de ${product.name}`}
                  onClick={() => changeQuantity(product.id, -1)}
                >
                  <Minus size={13} />
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  aria-label={`Agregar una unidad de ${product.name}`}
                  onClick={() => changeQuantity(product.id, 1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>
            <button
              className="remove-button"
              type="button"
              aria-label={`Quitar ${product.name}`}
              onClick={() => remove(product.id)}
            >
              <Trash2 size={16} />
            </button>
          </article>
        ))}
      </section>
      <aside className="summary-box">
        <h2>Resumen de compra</h2>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>Envío</span>
          <span>Calculado al confirmar</span>
        </div>
        <div className="summary-row summary-total">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {!authenticated ? (
          <>
            <p className="muted-small">
              Inicia sesión para crear tu orden y pagar.
            </p>
            <Link className="button button-dark" href="/login">
              Entrar para continuar <span>↗</span>
            </Link>
            <Link className="text-link" href="/register">
              Crear una cuenta
            </Link>
          </>
        ) : stripeConfigured ? (
          <button
            className="button button-dark"
            type="button"
            onClick={beginCheckout}
            disabled={busy}
          >
            {busy ? "Preparando pago..." : "Crear orden y pagar"}
            <span>↗</span>
          </button>
        ) : (
          <p className="form-error">
            Configura una clave publicable de Stripe antes de crear la orden.
          </p>
        )}
        <p className="muted-small">
          Los precios y el inventario se validan nuevamente en el servidor antes
          de crear la orden.
        </p>
      </aside>
    </div>
  );
}
