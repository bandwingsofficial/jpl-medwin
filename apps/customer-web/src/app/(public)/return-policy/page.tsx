import { ReturnPolicyPage } from "@/features/static-pages/pages/return-policy-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return Policy",
  description:
    "Learn more about our return policy and how we handle returns at JPL Medwin.",
};
export default function Page() {
  return <ReturnPolicyPage />;
}