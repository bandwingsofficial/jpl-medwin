// app/(dashboard)/sub-categories/page.tsx

import SubCategoriesPage from "@/features/sub-category-management/pages/sub-categories-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sub-Categories",
  description:
    "Manage and view JPL Medwin sub-categories, sub-category information, and sub-category activity from the admin dashboard.",
};
export default function Page() {
  return <SubCategoriesPage />;
}