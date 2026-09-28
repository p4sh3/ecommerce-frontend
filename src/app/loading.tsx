import { ProductGridSkeleton } from "@/components/product-grid-skeleton";

export default function Loading() {
  return (
    <main className="shell">
      <div className="hero">
        <div className="hero-copy">
          <div
            className="skeleton-card"
            style={{ maxWidth: 390, aspectRatio: "1.4 / 1" }}
          />
        </div>
        <div className="hero-visual" />
      </div>
      <section className="catalog-section">
        <ProductGridSkeleton />
      </section>
    </main>
  );
}
