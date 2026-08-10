import type { Metadata } from "next";

import SubCategoryProductsPage from "@/features/category/pages/sub-category-products-page";

export const metadata: Metadata = {
  title: "Sub Category Products",
  description:
    "Explore dental, medical, surgical and healthcare products from JPL Medwin. Browse products by category and sub-category.",
};

export default async function Page({
  params,
}: {
  params: Promise<{
    categoryId: string;
    subCategoryId: string;
  }>;
}) {
  const {
    categoryId,
    subCategoryId,
  } = await params;

  return (
    <SubCategoryProductsPage
      categoryId={categoryId}
      subCategoryId={subCategoryId}
    />
  );
}