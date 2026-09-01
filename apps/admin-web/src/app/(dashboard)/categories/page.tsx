import { CategoriesPage } from "@/features/category-management/components/categories-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Manage and view JPL Medwin categories, category information, product associations and category activity from the admin dashboard.",
};
export default function Page() {
  return <CategoriesPage />;
}