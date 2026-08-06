import SubCategoryProductsPage from "@/features/category/pages/sub-category-products-page";

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