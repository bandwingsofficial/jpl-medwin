import BrandPage from "@/features/brand-management/components/brand-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Manage and view JPL Medwin brands, brand information, product associations and brand activity from the admin dashboard.",
};
export default function Page() {
  return <BrandPage />;
}