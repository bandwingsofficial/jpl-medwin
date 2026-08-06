"use client";

import { useSearchParams } from "next/navigation";

import { ProductsPage } from "@/features/products/pages/products-page";

export default function Page() {
  const searchParams = useSearchParams();

  const categoryId =
    searchParams.get("categoryId") || undefined;

  const subCategoryId =
    searchParams.get("subCategoryId") || undefined;

  const miniCategoryId =
    searchParams.get("miniCategoryId") || undefined;


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