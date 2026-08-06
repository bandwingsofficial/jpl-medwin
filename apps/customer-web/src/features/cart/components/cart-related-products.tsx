"use client";

import { ProductGridSkeleton } from "@/features/products/components/product-grid-skeleton";
import { ProductCard } from "@/features/products/components/product-card";
import { useProducts } from "@/features/products/hooks/use-products";
import { Product } from "@/features/products/types/product.type";

export function CartRelatedProducts() {
  const { data, isLoading } = useProducts({
    limit: 24,
  });

  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  const products: Product[] =
    data?.pages?.flatMap(
      (page: any) => page?.data?.data ?? page?.data ?? []
    ) ?? [];

  if (!products.length) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          You May Also Like
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Discover more healthcare essentials and best-selling medical products.
        </p>
      </div>

      <div
        className="
          grid
          grid-cols-2
          gap-3
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          xl:grid-cols-6
        "
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}