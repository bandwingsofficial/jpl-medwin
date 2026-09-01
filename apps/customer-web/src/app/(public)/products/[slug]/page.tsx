import type { Metadata } from "next";

import { ProductDetailsPage } from "@/features/products/pages/product-details-page";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const productName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: productName,
    description: `Buy ${productName} online from JPL Medwin. Explore product details, variants, pricing and availability.`,
  };
}

export default async function Page({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-white">
      <ProductDetailsPage productSlug={slug} />
    </div>
  );
}