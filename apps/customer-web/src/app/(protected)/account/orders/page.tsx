import { OrderListPage } from "@/features/orders/pages/order-list-page";

export const metadata = {
  title: "My Orders | JPL Medwin",
  description: "View your order history and track shipments.",
};

export default function Page() {
  return (
    <div className="container mx-auto py-8 px-4">
      <OrderListPage />
    </div>
  );
}