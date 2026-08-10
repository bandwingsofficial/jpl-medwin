import { CartPage } from "@/features/cart/pages/cart-page";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Cart",
  description:
    "View and manage your items in the shopping cart at JPL Medwin.",
};
export default function Page() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <CartPage />
    </div>
  );
}