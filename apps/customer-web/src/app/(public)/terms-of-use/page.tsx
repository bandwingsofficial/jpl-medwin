import { TermsOfUsePage } from "@/features/static-pages/pages/terms-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Learn more about our terms of use and how we operate at JPL Medwin.",
};
export default function Page() {
  return <TermsOfUsePage />;
}