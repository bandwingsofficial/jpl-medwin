import { ShippingPolicyPage } from "@/features/static-pages/pages/shipping-policy-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Learn more about our shipping policy and how we handle deliveries at JPL Medwin.",
};
export default function Page() {
  return <ShippingPolicyPage />;
}