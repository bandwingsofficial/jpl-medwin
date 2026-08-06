import SubCategoryPage from "@/features/category/components/SubCategoryPage";
import CategoryProductsPage from "@/features/category/pages/category-products-page";

export default async function Page({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;

 return (
  <CategoryProductsPage
    categoryId={categoryId}
  />
);;
}