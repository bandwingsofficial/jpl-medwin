import { DisclaimerPage } from "@/features/static-pages/pages/disclaimer-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Review the terms and conditions of use for JPL Medwin's dental and medical equipment.",
};
export default function Page() {
  return <DisclaimerPage />;
}