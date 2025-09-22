import type { Route } from "./+types/dashboard";
import { CartProvider } from "~/context/CartContext";
import { ProductDashboard } from "~/components/dashboard/ProductDashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Product Dashboard" },
    { name: "description", content: "Browse and manage products" },
  ];
}

export default function Dashboard() {
  return (
    <CartProvider>
      <ProductDashboard />
    </CartProvider>
  );
}
