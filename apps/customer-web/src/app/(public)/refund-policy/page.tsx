import { RefundPolicyPage } from "@/features/static-pages/pages/refund-policy-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Learn more about our refund policy and how we handle returns at JPL Medwin.",
};
export default function Page() {
  return <RefundPolicyPage />;
}