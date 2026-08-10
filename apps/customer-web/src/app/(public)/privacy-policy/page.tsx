import { PrivacyPolicyPage } from "@/features/static-pages/pages/privacy-policy-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn more about our privacy policy and how we protect your personal information at JPL Medwin.",
};
export default function Page() {
  return <PrivacyPolicyPage />;
}