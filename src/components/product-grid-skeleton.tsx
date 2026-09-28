export function ProductGridSkeleton() {
  return (
    <div className="skeleton-grid" aria-label="Cargando productos">
      {Array.from({ length: 4 }, (_, index) => (
        <div className="skeleton-card" key={index} />
      ))}
    </div>
  );
}
