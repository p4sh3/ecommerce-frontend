import { getProducts } from "@/lib/api";
import ProductCard from "@/components/product-card";

export default async function ProductGrid() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let unavailable = false;
  try {
    products = await getProducts();
  } catch {
    unavailable = true;
  }
  if (unavailable)
    return (
      <div className="api-message">
        No pudimos conectar con la tienda. Comprueba la conexión con la API e
        inténtalo de nuevo.
      </div>
    );
  if (!products.length)
    return (
      <p className="empty-state">
        No hay productos disponibles en este momento.
      </p>
    );
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
