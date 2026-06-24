// src/features/wishlist/components/wishlist-grid.tsx

"use client";

import { ProductCard } from "@/features/products/components/product-card";

import { WishlistItem } from "@/features/wishlist/types/wishlist.type";

interface WishlistGridProps {
  items: WishlistItem[];
}

export function WishlistGrid({
  items,
}: WishlistGridProps) {
  const validItems =
    items.filter(
      (item) => item?.id
    );

  return (
    <section className="w-full">
      <div
        className="
          grid
          grid-cols-2
          gap-3

          sm:grid-cols-3

          md:grid-cols-4

          lg:grid-cols-6

          xl:grid-cols-6

          2xl:grid-cols-6
        "
      >
        {validItems.map(
          (item) => (
            <ProductCard
              key={item.id}
              product={item}
            />
          )
        )}
      </div>
    </section>
  );
}