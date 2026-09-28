export default function CheckoutLoading() {
  return (
    <main className="page-shell">
      <div
        className="skeleton-card"
        style={{ maxWidth: 520, aspectRatio: "4 / 1" }}
      />
      <div
        className="skeleton-card"
        style={{ marginTop: 20, maxWidth: 900, aspectRatio: "2.7 / 1" }}
      />
    </main>
  );
}
