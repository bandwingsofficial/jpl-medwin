import type { Metadata } from "next";

import { ProductsPage } from "@/features/products/pages/products-page";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore our wide range of dental, medical, surgical and healthcare products available at JPL Medwin.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    categoryId?: string;
    subCategoryId?: string;
    miniCategoryId?: string;
  }>;
}

export default async function Page({
  searchParams,
}: ProductsPageProps) {
  const {
    categoryId,
    subCategoryId,
    miniCategoryId,
  } = await searchParams;

  return (
    <main
      className="
        w-full
        max-w-none
        px-4
        py-4
      "
    >
      <ProductsPage
        categoryId={categoryId}
        subCategoryId={subCategoryId}
        miniCategoryId={miniCategoryId}
      />
    </main>
  );
}