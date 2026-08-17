import { OrderListPage } from "@/features/orders/pages/order-list-page";

export const metadata = {
  title: "My Orders | JPL Medwin",
  description: "View your order history and track shipments.",
};

export default function Page() {
  return (
    <div className="container mx-auto px-3 py-2 sm:py-8">
  <OrderListPage />
</div>
  );
}