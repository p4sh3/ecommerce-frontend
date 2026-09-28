import CheckoutContent from "@/components/checkout-content";
import { getSessionToken } from "@/lib/api";

export default async function CheckoutPage() {
  const token = await getSessionToken();
  return (
    <main className="page-shell">
      <p className="eyebrow">UN BUEN MOMENTO</p>
      <h1 className="page-title">Tu carrito.</h1>
      <p className="page-intro">Revisa tu selección antes de confirmar.</p>
      <CheckoutContent authenticated={Boolean(token)} />
    </main>
  );
}
