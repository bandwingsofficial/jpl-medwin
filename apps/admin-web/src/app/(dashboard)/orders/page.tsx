import OrderPage from "@/features/order-management/components/order-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
  description:
    "Manage and view JPL Medwin orders, order details, shipping information and order activity from the admin dashboard.",
};
export default function Page() {
  return <OrderPage />;
}