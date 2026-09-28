import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions";
import { getOrders, getSessionToken } from "@/lib/api";
import { formatPrice } from "@/lib/presentation";
import type { Order } from "@/lib/types";

export default async function OrdersPage() {
  const token = await getSessionToken();
  if (!token) redirect("/login?next=/account/orders");
  let orders: Order[] = [];
  let failed = false;
  try {
    orders = await getOrders(token);
  } catch {
    failed = true;
  }
  return (
    <main className="page-shell">
      <p className="eyebrow">TU HISTORIAL</p>
      <div className="section-heading">
        <div>
          <h1 className="page-title">Mis compras.</h1>
          <p className="page-intro">
            Tus pedidos y sus estados en un solo lugar.
          </p>
        </div>
        <form action={logoutAction}>
          <button className="button button-quiet" type="submit">
            Cerrar sesión
          </button>
        </form>
      </div>
      {failed ? (
        <div className="page-error">
          <p>
            No pudimos consultar tus órdenes. Puede que tu sesión haya vencido;
            vuelve a iniciar sesión.
          </p>
        </div>
      ) : orders.length ? (
        orders.map((order) => (
          <article className="order-card" key={order.id}>
            <div>
              <h2>Orden #{order.id}</h2>
              <p>
                {new Date(order.created_at).toLocaleDateString("es-MX", {
                  dateStyle: "long",
                })}{" "}
                · {order.items.length} producto(s)
              </p>
              <p>
                {order.items
                  .map(
                    (item) =>
                      `${item.quantity} × ${item.product_name || `Producto #${item.product_id ?? item.id}`}`,
                  )
                  .join(" · ")}
              </p>
            </div>
            <div>
              <p className="order-total">
                {formatPrice(order.total, order.currency.toUpperCase())}
              </p>
              <span className="order-status">{order.status}</span>
            </div>
          </article>
        ))
      ) : (
        <div className="empty-state">
          Aún no tienes compras.{" "}
          <Link className="text-link" href="/#catalogo">
            Explorar la tienda
          </Link>
        </div>
      )}
    </main>
  );
}
