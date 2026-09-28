export function formatPrice(value: string | number, currency = "USD"): string {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(
    Number(value),
  );
}

export function productImage(productId: number): string {
  const images: Record<number, string> = {
    1: "photo-1587829741301-dc798b83add3",
    2: "photo-1527814050087-3793815479db",
    3: "photo-1625842268584-8f3296236761",
    4: "photo-1599669454699-248893623440",
    5: "photo-1527443224154-c4a3942d3acf",
    6: "photo-1496181133206-80ce9b88a853",
    7: "photo-1587825140708-dfaf72ae4b04",
    8: "photo-1527864550417-7fd91fc51a46",
    9: "photo-1596079890744-c1a0462d0975",
    10: "photo-1597872200969-2b65d56bd16b",
    11: "photo-1567538096630-e0c55bd6374c",
    12: "photo-1608043152269-423dbba4e7e1",
  };
  const image = images[productId] || "photo-1519389950473-47ba0277781c";
  return `https://images.unsplash.com/${image}?auto=format&fit=crop&w=1000&q=82`;
}
