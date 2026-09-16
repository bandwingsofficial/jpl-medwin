"use client";

import { ProductGridSkeleton } from "@/features/products/components/product-grid-skeleton";
import { useProducts } from "@/features/products/hooks/use-products";
import { Product } from "@/features/products/types/product.type";
import { ProductCard } from "./product-card";

interface RelatedProductsProps {
  currentProductId: string;
  categorySlug?: string;
}

interface ProductPage {
  data?: Product[] | {
    data?: Product[];
  };
}

interface ProductsInfiniteData {
  pages?: ProductPage[];
}

export function RelatedProducts({
  currentProductId,
  categorySlug,
}: RelatedProductsProps) {
  // ------------------------------------------------------------
  // No category -> no related products request
  // ------------------------------------------------------------

  if (!categorySlug) {
    return null;
  }

  const {
    data: categoryInfiniteData,
    isLoading,
    isError,
  } = useProducts({
    categorySlug,
    limit: 20,
  });

  if (isLoading) {
    return (
      <section className="mt-14 w-full">
        <ProductGridSkeleton />
      </section>
    );
  }

  if (isError || !categoryInfiniteData) {
    return null;
  }

  /**
   * Extract products from the infinite-query pages.
   *
   * Supports:
   *
   * {
   *   pages: [
   *     {
   *       data: [...]
   *     }
   *   ]
   * }
   *
   * and:
   *
   * {
   *   pages: [
   *     {
   *       data: {
   *         data: [...]
   *       }
   *     }
   *   ]
   * }
   */
  const extractProducts = (
    infiniteData: ProductsInfiniteData,
  ): Product[] => {
    if (!infiniteData.pages) {
      return [];
    }

    return infiniteData.pages.flatMap((page) => {
      if (Array.isArray(page.data)) {
        return page.data;
      }

      if (page.data?.data && Array.isArray(page.data.data)) {
        return page.data.data;
      }

      return [];
    });
  };

  const categoryProducts = extractProducts(
    categoryInfiniteData as ProductsInfiniteData,
  );

  /**
   * Remove the currently opened product.
   */
  const relatedProducts = categoryProducts
    .filter((product) => {
      return (
        product &&
        product.id !== currentProductId
      );
    })
    .slice(0, 12);

  /**
   * No other products in this category.
   */
  if (relatedProducts.length === 0) {
    return null;
  }

  const gridClassName =
    "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6";

  return (
    <section className="mt-14 w-full">
      <div className="mb-6">
        <h2
          className="
            animate-text-shine
            bg-gradient-to-r
            from-[#001f3f]
            via-[#0d9488]
            to-[#001f3f]
            bg-clip-text
            text-[28px]
            font-bold
            text-transparent
          "
        >
          Related Products
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Explore more products from the same category
        </p>
      </div>

      <div className={gridClassName}>
        {relatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}