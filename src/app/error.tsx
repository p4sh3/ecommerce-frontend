"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="page-shell">
      <div className="page-error">
        <p>Algo no salió como esperábamos. Inténtalo otra vez.</p>
        <button className="button button-dark" type="button" onClick={reset}>
          Reintentar
        </button>
      </div>
    </main>
  );
}
