import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AddProductButton from "@/components/add-product-button";
import { getProduct } from "@/lib/api";
import { formatPrice, productImage } from "@/lib/presentation";

export default async function ProductPage({
  params,
}: PageProps<"/products/[id]">) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();
  return (
    <main className="page-shell">
      <p className="breadcrumb">
        <Link href="/#catalogo">Tienda</Link> / {product.name}
      </p>
      <div className="detail-layout">
        <Image
          className="detail-photo"
          src={productImage(product.id)}
          alt={product.name}
          width={1000}
          height={1000}
          sizes="(max-width: 600px) 100vw, 50vw"
          unoptimized
        />
        <section className="detail-copy">
          <p className="eyebrow">EQUIPO PARA TU ESPACIO</p>
          <h1>{product.name}</h1>
          <p className="detail-description">
            {product.description ||
              "Un accesorio práctico para mejorar tu espacio de trabajo o entretenimiento."}
          </p>
          <p className="detail-stock">
            {product.stock > 0
              ? `${product.stock} unidades disponibles`
              : "Agotado por ahora"}
          </p>
          <p className="detail-price">{formatPrice(product.price)}</p>
          <AddProductButton product={product} />
        </section>
      </div>
    </main>
  );
}
