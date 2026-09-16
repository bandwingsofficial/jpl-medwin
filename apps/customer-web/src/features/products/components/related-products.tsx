"use client";

import { useMemo } from "react";

import { ProductGridSkeleton } from "@/features/products/components/product-grid-skeleton";
import { useProducts } from "@/features/products/hooks/use-products";
import { Product } from "@/features/products/types/product.type";

import { ProductCard } from "./product-card";

interface RelatedProductsProps {
  currentProductId: string;
  categoryId?: string;
  brandId?: string;
}

interface ProductPage {
  data?: {
    data?: Product[];
  };
}

interface ProductsInfiniteData {
  pages?: ProductPage[];
}

/**
 * Extract products from the existing API response:
 *
 * pages[]
 *   └── data
 *       └── data[]
 */
function extractProducts(
  response: ProductsInfiniteData | undefined,
): Product[] {
  if (!response?.pages) {
    return [];
  }

  return response.pages.flatMap(
    (page) => page.data?.data ?? [],
  );
}

/**
 * Remove the current product from a product list.
 */
function removeCurrentProduct(
  products: Product[],
  currentProductId: string,
): Product[] {
  return products.filter(
    (product) => product.id !== currentProductId,
  );
}

/**
 * Remove products that have already been displayed
 * in previous rows.
 */
function removeDuplicates(
  products: Product[],
  usedIds: Set<string>,
): Product[] {
  return products.filter((product) => {
    if (usedIds.has(product.id)) {
      return false;
    }

    usedIds.add(product.id);

    return true;
  });
}

/**
 * Shuffle products for the final general-products row.
 */
function shuffleProducts(products: Product[]): Product[] {
  const shuffled = [...products];

  for (
    let index = shuffled.length - 1;
    index > 0;
    index -= 1
  ) {
    const randomIndex = Math.floor(
      Math.random() * (index + 1),
    );

    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export function RelatedProducts({
  currentProductId,
  categoryId,
  brandId,
}: RelatedProductsProps) {
  /*
   * ============================================================
   * 1. SAME CATEGORY PRODUCTS
   * ============================================================
   *
   * IMPORTANT:
   * Product API actually filters using categoryId.
   *
   * Therefore we MUST pass categoryId here.
   */
  const {
    data: categoryResponse,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useProducts({
    categoryId,
    limit: 20,
  });

  /*
   * ============================================================
   * 2. SAME BRAND PRODUCTS
   * ============================================================
   */
  const {
    data: brandResponse,
    isLoading: isBrandLoading,
    isError: isBrandError,
  } = useProducts({
    brandId,
    limit: 20,
  });

  /*
   * ============================================================
   * 3. GENERAL PRODUCTS
   * ============================================================
   *
   * No category / brand filter.
   */
  const {
    data: generalResponse,
    isLoading: isGeneralLoading,
    isError: isGeneralError,
  } = useProducts({
    limit: 20,
  });

  /*
   * ============================================================
   * EXTRACT CATEGORY PRODUCTS
   * ============================================================
   */
  const categoryProducts = useMemo(() => {
    if (!categoryId) {
      return [];
    }

    const products = extractProducts(
      categoryResponse,
    );

    return removeCurrentProduct(
      products,
      currentProductId,
    );
  }, [
    categoryResponse,
    categoryId,
    currentProductId,
  ]);

  /*
   * ============================================================
   * EXTRACT BRAND PRODUCTS
   * ============================================================
   */
  const brandProducts = useMemo(() => {
    if (!brandId) {
      return [];
    }

    const products = extractProducts(
      brandResponse,
    );

    return removeCurrentProduct(
      products,
      currentProductId,
    );
  }, [
    brandResponse,
    brandId,
    currentProductId,
  ]);

  /*
   * ============================================================
   * EXTRACT GENERAL PRODUCTS
   * ============================================================
   */
  const generalProducts = useMemo(() => {
    const products = extractProducts(
      generalResponse,
    );

    return removeCurrentProduct(
      products,
      currentProductId,
    );
  }, [
    generalResponse,
    currentProductId,
  ]);

  /*
   * ============================================================
   * ROW 1
   *
   * SAME CATEGORY
   *
   * This row has the highest priority.
   * ============================================================
   */
  const relatedCategoryProducts = useMemo(() => {
    const usedIds = new Set<string>();

    return removeDuplicates(
      categoryProducts,
      usedIds,
    ).slice(0, 12);
  }, [categoryProducts]);

  /*
   * ============================================================
   * ROW 2
   *
   * SAME BRAND
   *
   * Products already displayed in the category row
   * are removed.
   * ============================================================
   */
  const relatedBrandProducts = useMemo(() => {
    const usedIds = new Set<string>(
      relatedCategoryProducts.map(
        (product) => product.id,
      ),
    );

    return removeDuplicates(
      brandProducts,
      usedIds,
    ).slice(0, 12);
  }, [
    brandProducts,
    relatedCategoryProducts,
  ]);

  /*
   * ============================================================
   * ROW 3
   *
   * GENERAL / RANDOM PRODUCTS
   *
   * Remove:
   *
   * 1. Current product
   * 2. Category products
   * 3. Brand products
   *
   * Then shuffle remaining products.
   * ============================================================
   */
  const relatedGeneralProducts = useMemo(() => {
    const usedIds = new Set<string>([
      currentProductId,

      ...relatedCategoryProducts.map(
        (product) => product.id,
      ),

      ...relatedBrandProducts.map(
        (product) => product.id,
      ),
    ]);

    const availableProducts =
      generalProducts.filter(
        (product) => !usedIds.has(product.id),
      );

    return shuffleProducts(
      availableProducts,
    ).slice(0, 12);
  }, [
    generalProducts,
    currentProductId,
    relatedCategoryProducts,
    relatedBrandProducts,
  ]);

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */
  const isLoading =
    isCategoryLoading ||
    isBrandLoading ||
    isGeneralLoading;

  if (isLoading) {
    return (
      <section className="mt-14 w-full">
        <ProductGridSkeleton />
      </section>
    );
  }

  /*
   * ============================================================
   * IF EVERYTHING FAILED / EMPTY
   * ============================================================
   */
  const hasProducts =
    relatedCategoryProducts.length > 0 ||
    relatedBrandProducts.length > 0 ||
    relatedGeneralProducts.length > 0;

  const hasErrors =
    isCategoryError ||
    isBrandError ||
    isGeneralError;

  if (!hasProducts && hasErrors) {
    return null;
  }

  if (!hasProducts) {
    return null;
  }

  /*
   * ============================================================
   * COMMON GRID
   * ============================================================
   */
  const gridClassName =
    "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6";

  return (
    <section className="mt-2 w-full space-y-4">

      {/* ========================================================
          ROW 1 — SAME CATEGORY
          ======================================================== */}
      {relatedCategoryProducts.length > 0 && (
        <div>
          <div className="mb-1">
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
              More products from the same category
            </p>
          </div>

          <div className={gridClassName}>
            {relatedCategoryProducts.map(
              (product) => (
                <ProductCard
                  key={`category-${product.id}`}
                  product={product}
                />
              ),
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          ROW 2 — SAME BRAND
          ======================================================== */}
      {relatedBrandProducts.length > 0 && (
        <div>
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
              More From This Brand
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Explore more products from the same brand
            </p>
          </div>

          <div className={gridClassName}>
            {relatedBrandProducts.map(
              (product) => (
                <ProductCard
                  key={`brand-${product.id}`}
                  product={product}
                />
              ),
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          ROW 3 — GENERAL / RANDOM
          ======================================================== */}
      {relatedGeneralProducts.length > 0 && (
        <div>
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
              You May Also Like
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Discover more products you may be interested in
            </p>
          </div>

          <div className={gridClassName}>
            {relatedGeneralProducts.map(
              (product) => (
                <ProductCard
                  key={`general-${product.id}`}
                  product={product}
                />
              ),
            )}
          </div>
        </div>
      )}

    </section>
  );
}