import CheckoutPage from "@/features/checkout-management/components/checkout-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abandoned Checkouts | JPL Medwin Admin",
  description:
    "View and manage customer checkouts that did not result in completed orders from the admin dashboard.",
};

export default function Page() {
  return <CheckoutPage />;
}
