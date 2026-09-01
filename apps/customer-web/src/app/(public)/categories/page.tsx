import CategoryPage from "@/features/category/components/category-page";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse our extensive range of dental, medical, surgical and healthcare products by category at JPL Medwin.",
};
export default function Page() {
  return <CategoryPage />;
}