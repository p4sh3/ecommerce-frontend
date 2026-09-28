"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise =
  publishableKey?.startsWith("pk_") && !publishableKey.endsWith("replace_me")
    ? loadStripe(publishableKey)
    : null;

function PaymentForm({
  orderId,
  onPaid,
}: {
  orderId: number;
  onPaid: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function pay() {
    if (!stripe || !elements) return;
    setBusy(true);
    setError("");
    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?order=${orderId}`,
      },
    });
    if (result.error) {
      setError(
        result.error.message ||
          "No pudimos procesar el pago. Revisa los datos e inténtalo de nuevo.",
      );
      setBusy(false);
    } else if (result.paymentIntent) {
      if (result.paymentIntent.status === "succeeded") onPaid();
      router.push(
        `/checkout/success?order=${orderId}&redirect_status=${result.paymentIntent.status}`,
      );
    } else {
      setError(
        "No pudimos confirmar el estado del pago. Actualiza la página antes de volver a intentarlo.",
      );
      setBusy(false);
    }
  }
  return (
    <div className="payment-panel">
      <h3>Datos de pago</h3>
      <PaymentElement />
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button
        className="button button-red"
        type="button"
        onClick={pay}
        disabled={!stripe || busy}
      >
        {busy ? "Procesando..." : "Pagar ahora"}
      </button>
    </div>
  );
}

export default function PaymentPanel({
  clientSecret,
  orderId,
  onPaid,
}: {
  clientSecret: string;
  orderId: number;
  onPaid: () => void;
}) {
  if (!stripePromise)
    return (
      <p className="form-error">
        Configura NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY para mostrar el formulario
        de pago.
      </p>
    );
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#45694b",
            colorText: "#19231f",
            borderRadius: "0px",
          },
        },
      }}
    >
      <PaymentForm orderId={orderId} onPaid={onPaid} />
    </Elements>
  );
}
