import type { Metadata } from "next";

import SubCategoryProductsPage from "@/features/category/pages/sub-category-products-page";

export const metadata: Metadata = {
  title: "Sub Category Products",
  description:
    "Explore dental, medical, surgical and healthcare products from JPL Medwin. Browse products by category and sub-category.",
};

interface SubCategoryRoutePageProps {
  params: Promise<{
    categorySlug: string;
    subCategorySlug: string;
  }>;
}

export default async function Page({
  params,
}: SubCategoryRoutePageProps) {
  const {
    categorySlug,
    subCategorySlug,
  } = await params;

  return (
    <SubCategoryProductsPage
      categorySlug={categorySlug}
      subCategorySlug={subCategorySlug}
    />
  );
}