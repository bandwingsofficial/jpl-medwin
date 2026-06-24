import { Product } from "@/features/products/types/product.type";
import { ProductCard } from "@/features/products/components/product-card";

interface Props {
  products: Product[];
}

export function CategoryProductGrid({
  products,
}: Props) {
  return (
    <section className="w-full">
      <div
        className="
          grid
          grid-cols-2
          gap-4

          md:grid-cols-3

          lg:grid-cols-4

          xl:grid-cols-4

          2xl:grid-cols-4
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