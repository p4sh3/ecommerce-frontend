import Link from "next/link";
import { Check } from "lucide-react";
import { getOrder, getSessionToken } from "@/lib/api";

export default async function CheckoutSuccess({
  searchParams,
}: PageProps<"/checkout/success">) {
  const { order, redirect_status: redirectStatus } = await searchParams;
  const token = await getSessionToken();
  const orderId = Number(order);
  let paymentConfirmed = false;
  if (
    token &&
    Number.isInteger(orderId) &&
    orderId > 0 &&
    redirectStatus === "succeeded"
  ) {
    try {
      const result = await getOrder(token, orderId);
      paymentConfirmed =
        result.payments?.some((payment) => payment.status === "succeeded") ??
        false;
    } catch {
      paymentConfirmed = false;
    }
  }
  const paymentStatus = Array.isArray(redirectStatus)
    ? redirectStatus[0]
    : redirectStatus;
  const paymentFailed = [
    "failed",
    "canceled",
    "requires_payment_method",
  ].includes(paymentStatus || "");
  return (
    <main className="center-state">
      <span className="success-mark">
        <Check size={30} />
      </span>
      <p className="eyebrow">
        {paymentConfirmed
          ? "COMPRA CONFIRMADA"
          : paymentFailed
            ? "PAGO NO COMPLETADO"
            : "PAGO EN VALIDACIÓN"}
      </p>
      <h1 className="page-title">
        {paymentConfirmed ? (
          <>
            Tu equipo ya está
            <br />
            confirmado.
          </>
        ) : paymentFailed ? (
          <>
            No se completó
            <br />
            el pago.
          </>
        ) : (
          <>
            Estamos revisando
            <br />
            tu pago.
          </>
        )}
      </h1>
      <p className="page-intro">
        {paymentConfirmed
          ? `El pago de la orden #${orderId} fue confirmado.`
          : paymentFailed
            ? "No se realizó el cargo. Puedes volver al carrito e intentarlo otra vez."
            : "El pago se confirmará cuando el servidor reciba la notificación segura de Stripe. Revisa el historial de compras en unos momentos."}
      </p>
      {paymentFailed ? (
        <Link className="button button-dark" href="/checkout">
          Volver al carrito <span>↗</span>
        </Link>
      ) : (
        <Link className="button button-dark" href="/account/orders">
          Ver mis compras <span>↗</span>
        </Link>
      )}
      <Link className="button button-quiet" href="/">
        Volver al mercado
      </Link>
    </main>
  );
}
