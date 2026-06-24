"use client";
import { MobileProductFilters } from "@/features/products/components/mobile-product-filters";
import { useEffect, useRef, useState } from "react";

import { ProductEmpty } from "@/features/products/components/product-empty";
import { ProductError } from "@/features/products/components/product-error";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductGridSkeleton } from "@/features/products/components/product-grid-skeleton";
import { ProductFilters } from "@/features/products/components/product-filters";

import { useProducts } from "@/features/products/hooks/use-products";

import { ProductBanner } from "@/features/banners/components/product-banner";

import { ProductFilters as ProductFiltersType } from "@/features/products/types/product-filter.type";

interface ProductsPageProps {
  categoryId?: string;
  subCategoryId?: string;
  miniCategoryId?: string;
}

export function ProductsPage({
  categoryId,
  subCategoryId,
  miniCategoryId,
}: ProductsPageProps) {
  const loadMoreRef =
    useRef<HTMLDivElement>(null);

  const [isClient, setIsClient] =
    useState(false);

  const [filters, setFilters] =
    useState<ProductFiltersType>({});

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts({
    categoryId:
      filters.categoryId ??
      categoryId,

    subCategoryId:
      filters.subCategoryId ??
      subCategoryId,

    miniCategoryId:
      filters.miniCategoryId ??
      miniCategoryId,

    brandId:
      filters.brandId,

    minPrice:
      filters.minPrice,

    maxPrice:
      filters.maxPrice,

    inStock:
      filters.inStock,

    type:
      filters.type,

    sortBy:
      filters.sortBy,

    limit: 20,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isFetchingRef =
    useRef(isFetchingNextPage);

  useEffect(() => {
    isFetchingRef.current =
      isFetchingNextPage;
  }, [isFetchingNextPage]);

  useEffect(() => {
    const target =
      loadMoreRef.current;

    if (
      !target ||
      !hasNextPage
    ) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const first =
            entries[0];

          if (
            first.isIntersecting &&
            hasNextPage &&
            !isFetchingRef.current
          ) {
            fetchNextPage();
          }
        },
        {
          rootMargin: "200px",
          threshold: 0,
        }
      );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [
    fetchNextPage,
    hasNextPage,
  ]);

  useEffect(() => {
    if (
      !isClient ||
      !hasNextPage ||
      isFetchingNextPage
    ) {
      return;
    }

    const hasNoScrollbar =
      document.documentElement
        .scrollHeight <=
      window.innerHeight;

    if (hasNoScrollbar) {
      const timer =
        setTimeout(() => {
          if (
            !isFetchingRef.current
          ) {
            fetchNextPage();
          }
        }, 500);

      return () =>
        clearTimeout(timer);
    }
  }, [
    data,
    hasNextPage,
    isFetchingNextPage,
    isClient,
    fetchNextPage,
  ]);

  const rawProducts =
    data?.pages?.flatMap(
      (page: any) =>
        page?.data?.data || []
    ) || [];

  const products = Array.from(
    new Map(
      rawProducts.map(
        (product: any) => [
          product.id,
          product,
        ]
      )
    ).values()
  );

  if (isLoading) {
    return (
      <ProductGridSkeleton />
    );
  }

  if (isError) {
    return (
      <ProductError
        message={error?.message}
      />
    );
  }

  return (
    <div
      className="
        w-full
        py-3
        space-y-6
      "
    >
      <ProductBanner />

<MobileProductFilters
  filters={filters}
  onChange={setFilters}
/>

<div
  className="
    flex
    gap-6
    items-start
    relative
  "
>
        <div
  className="
    hidden
    lg:block
    sticky
    top-[140px]
    self-start
    h-fit
  "
>
  <ProductFilters
    filters={filters}
    onChange={setFilters}
  />
</div>

        <div className="flex-1">
          {!products.length ? (
            <ProductEmpty />
          ) : (
            <>
              <ProductGrid
                products={products}
              />

              <div
                ref={loadMoreRef}
                className="
                  h-24
                  w-full
                  flex
                  items-center
                  justify-center
                  clear-both
                "
              >
                {isFetchingNextPage && (
                  <div
                    className="
                      text-sm
                      text-muted-foreground
                      text-center
                      py-4
                    "
                  >
                    Loading more products...
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
