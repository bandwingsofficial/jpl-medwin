import { ProductDetailsPage } from "@/features/products/pages/product-details-page";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({
  params,
}: ProductPageProps) {
  const { slug } =
    await params;

  return (
    <div className="min-h-screen bg-white">
      <ProductDetailsPage
        productSlug={slug}
      />
    </div>
  );
}