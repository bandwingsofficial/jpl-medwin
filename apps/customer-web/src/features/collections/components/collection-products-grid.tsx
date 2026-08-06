"use client";

import { ProductCard } from "@/features/products/components/product-card";
import { Product } from "@/features/products/types/product.type";

interface CollectionProductsGridProps {
  products: Product[];
}

export function CollectionProductsGrid({
  products,
}: CollectionProductsGridProps) {
  if (!products?.length) {
    return (
      <div
        className="
          flex
          min-h-[250px]
          items-center
          justify-center
          rounded-2xl
          border
          border-gray-200
          bg-white
          text-center
        "
      >
        <div>
          <h3
            className="
              text-lg
              font-semibold
              text-gray-900
            "
          >
            Proucts Coming Soon...
          </h3>

          <p
            className="
              mt-2
              text-sm
              text-gray-500
            "
          >
            This collection currently
            has no assigned products.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full px-0">
      <div
        className="
          grid
          grid-cols-2
          gap-4
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-6
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