export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string | number;
  stock: number;
  is_active: boolean;
};
export type CartItem = { product: Product; quantity: number };
export type OrderItem = {
  id: number;
  product_id?: number;
  product_name?: string;
  quantity: number;
  unit_price: string | number;
  total?: string | number;
};
export type Order = {
  id: number;
  status: string;
  subtotal: string | number;
  total: string | number;
  currency: string;
  items: OrderItem[];
  payments?: { status: string }[];
  created_at: string;
};
