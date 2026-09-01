import { Product } from "@/features/products/types/product.type";

import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({
  products,
}: ProductGridProps) {
  return (
    <section className="w-full">
      <div
        className="
          grid
          grid-cols-2
          gap-3

          sm:grid-cols-3

          md:grid-cols-4

          lg:grid-cols-5

          xl:grid-cols-5

          2xl:grid-cols-5
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