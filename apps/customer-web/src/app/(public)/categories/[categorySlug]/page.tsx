import CategoryProductsPage from "@/features/category/pages/category-products-page";

interface CategoryPageProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

export default async function Page({
  params,
}: CategoryPageProps) {
  const { categorySlug } = await params;

  return (
    <CategoryProductsPage
      categorySlug={categorySlug}
    />
  );
}