"use client";

export default function CheckoutError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="page-shell">
      <div className="page-error">
        <p>
          No pudimos cargar el checkout. Comprueba tu conexión e inténtalo otra
          vez.
        </p>
        <button className="button button-dark" type="button" onClick={reset}>
          Reintentar
        </button>
      </div>
    </main>
  );
}
