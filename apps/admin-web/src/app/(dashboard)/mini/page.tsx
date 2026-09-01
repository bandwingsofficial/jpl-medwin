import type { Metadata } from "next";

import { MiniCategoryPage } from "@/features/mini-category-management/components/mini-category-page";

export const metadata: Metadata = {
  title: "Mini Categories | JPL Medwin Admin",
  description:
    "Manage JPL Medwin mini categories, category information, product organization and mini-category activity from the admin dashboard.",
};

export default function Page() {
  return <MiniCategoryPage />;
}