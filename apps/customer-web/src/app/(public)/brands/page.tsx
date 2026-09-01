import { BrandsPage } from "@/features/brands/components/brands-page";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Brands",
  description:
    "Discover our range of trusted brands offering high-quality dental, medical, surgical and healthcare products at JPL Medwin.",
};
export default function Page() {
  return <BrandsPage />;
}