import type { Metadata } from "next";

import { ProductsPage } from "@/features/products/pages/products-page";

export const metadata: Metadata = {
  title: "Mini Category Products",
  description:
    "Explore dental, medical, surgical and healthcare products available in this mini category from JPL Medwin.",
};

interface ProductsRoutePageProps {
  params: Promise<{
    categoryId: string;
    subCategoryId: string;
    miniCategoryId: string;
  }>;
}

export default async function Page({
  params,
}: ProductsRoutePageProps) {
  const {
    categoryId,
    subCategoryId,
    miniCategoryId,
  } = await params;

  return (
    <ProductsPage
      categoryId={categoryId}
      subCategoryId={subCategoryId}
      miniCategoryId={miniCategoryId}
    />
  );
}