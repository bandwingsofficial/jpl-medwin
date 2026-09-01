import { AboutUsPage } from "@/features/static-pages/pages/about-us-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about JPL Medwin, a trusted supplier of dental equipment, medical equipment, professional dental instruments and healthcare products across India.",
};
export default function Page() {
  return <AboutUsPage />;
}