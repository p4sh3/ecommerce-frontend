import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import ProductGrid from "@/components/product-grid";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";

export default async function Home() {
  await connection();

  return (
    <main>
      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">TECNOLOGÍA PARA TRABAJAR · JUGAR · CREAR</p>
          <h1>
            Tu espacio,
            <br />
            mejor
            <br />
            <em>equipado.</em>
          </h1>
          <p className="hero-description">
            Accesorios útiles y equipo confiable para que cada día frente a tu
            pantalla funcione mejor.
          </p>
          <Link className="button button-dark" href="#catalogo">
            Explorar equipos <span>↘</span>
          </Link>
          <div className="hero-footnote">
            <span className="status-dot" /> Herramientas para tu día a día
          </div>
        </div>
        <div
          className="hero-visual"
          role="img"
          aria-label="Escritorio con ordenador y accesorios tecnológicos"
        >
          <div className="hero-photo" />
          <div className="hero-stamp">
            <span>BUEN EQUIPO</span>
            <strong>
              para
              <br />
              crear
            </strong>
            <small>PUNTO · TECNOLOGÍA ÚTIL</small>
          </div>
          <div className="hero-caption">01 / DISEÑADO PARA TU ESPACIO</div>
        </div>
      </section>
      <section className="value-strip shell" aria-label="Nuestra selección">
        <span>
          01 <strong>Periféricos precisos</strong>
        </span>
        <span>
          02 <strong>Espacios más cómodos</strong>
        </span>
        <span>
          03 <strong>Conexiones sin fricción</strong>
        </span>
      </section>
      <section className="catalog-section shell" id="catalogo">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EQUIPO PARA TODOS LOS DÍAS</p>
            <h2>
              Encuentra tu próximo <em>favorito.</em>
            </h2>
          </div>
          <p className="section-note">
            Accesorios para tu espacio,
            <br />
            trabajo y entretenimiento.
          </p>
        </div>
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid />
        </Suspense>
      </section>
    </main>
  );
}
