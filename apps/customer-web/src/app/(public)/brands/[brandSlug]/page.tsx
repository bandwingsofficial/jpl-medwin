import BrandProductsPage from "@/features/brands/pages/brand-products-page";

interface PageProps {
  params: Promise<{
    brandSlug: string;
  }>;
}

export default async function Page({
  params,
}: PageProps) {
  const { brandSlug } = await params;

  return <BrandProductsPage brandSlug={brandSlug} />;
}