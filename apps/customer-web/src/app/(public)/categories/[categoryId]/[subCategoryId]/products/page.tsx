import { ProductsPage } from "@/features/products/pages/products-page";

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
    <div className="container mx-auto px-4 py-10">
      <ProductsPage
        categoryId={categoryId}
        subCategoryId={subCategoryId}
        miniCategoryId={miniCategoryId}
      />
    </div>
  );
}