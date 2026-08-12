"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { MobileProductFilters } from "@/features/products/components/mobile-product-filters";
import { ProductFilters } from "@/features/products/components/product-filters";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductEmpty } from "@/features/products/components/product-empty";
import { ProductError } from "@/features/products/components/product-error";
import { ProductGridSkeleton } from "@/features/products/components/product-grid-skeleton";

import { useProducts } from "@/features/products/hooks/use-products";

import { ProductFilters as ProductFiltersType } from "@/features/products/types/product-filter.type";

export function SearchPage() {
  const searchParams = useSearchParams();

  const searchQuery =
    searchParams.get("q")?.trim() || "";

  /*
   * ================================================================
   * LOAD MORE
   * ================================================================
   */

  const loadMoreRef =
    useRef<HTMLDivElement>(null);

  const [isClient, setIsClient] =
    useState(false);

  /*
   * ================================================================
   * FILTERS
   * ================================================================
   */

  const [filters, setFilters] =
    useState<ProductFiltersType>({});

  /*
   * ================================================================
   * PRODUCTS
   * ================================================================
   */

  const {
  data,
  isLoading,
  isError,
  error,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useProducts({
  search: searchQuery,

  categorySlug:
    filters.categorySlug,

  subCategorySlug:
    filters.subCategorySlug,

  miniCategorySlug:
    filters.miniCategorySlug,

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
  /*
   * ================================================================
   * CLIENT
   * ================================================================
   */

  useEffect(() => {
    setIsClient(true);
  }, []);

  /*
   * ================================================================
   * FETCHING REF
   * ================================================================
   */

  const isFetchingRef =
    useRef(isFetchingNextPage);

  useEffect(() => {
    isFetchingRef.current =
      isFetchingNextPage;
  }, [isFetchingNextPage]);

  /*
   * ================================================================
   * INFINITE SCROLL
   * ================================================================
   */

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

  /*
   * ================================================================
   * HANDLE SHORT PAGES
   * ================================================================
   */

  useEffect(() => {
    if (
      !isClient ||
      !hasNextPage ||
      isFetchingNextPage
    ) {
      return;
    }

    const hasNoScrollbar =
      document.documentElement.scrollHeight <=
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

  /*
   * ================================================================
   * PRODUCTS
   * ================================================================
   *
   * API response:
   *
   * page
   *   └── data
   *       ├── data
   *       └── pagination
   *
   * Therefore products are:
   *
   * page.data.data
   *
   * ================================================================
   */

  const rawProducts =
    data?.pages?.flatMap(
      (page) =>
        page?.data?.data || []
    ) || [];

  /*
   * ================================================================
   * REMOVE DUPLICATES
   * ================================================================
   */

  const products = Array.from(
    new Map(
      rawProducts.map(
        (product) => [
          product.id,
          product,
        ]
      )
    ).values()
  );

  /*
   * ================================================================
   * LOADING
   * ================================================================
   */

  if (isLoading) {
    return (
      <ProductGridSkeleton />
    );
  }

  /*
   * ================================================================
   * ERROR
   * ================================================================
   */

  if (isError) {
    return (
      <ProductError
        message={
          error?.message ||
          "Failed to load search results."
        }
      />
    );
  }

  /*
   * ================================================================
   * PAGE
   * ================================================================
   */

  return (
    <main
      className="
        min-h-screen
        w-full
        bg-[#fafafa]
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1400px]
          px-3
          py-4
          sm:px-5
          sm:py-6
          lg:px-6
          lg:py-8
        "
      >
        {/* ====================================================== */}
{/* BREADCRUMBS */}
{/* ====================================================== */}

<div
  className="
    mb-4
    flex
    items-center
    gap-2
    px-1
    text-sm
    sm:mb-5
  "
>
  <Link
    href="/"
    className="
      inline-flex
      items-center
      gap-1.5
      font-medium
      text-slate-500
      transition-colors
      hover:text-teal-600
    "
  >
    <Home className="h-4 w-4" />
    <span>Home</span>
  </Link>

  <ChevronRight
    className="h-4 w-4 text-slate-300"
    strokeWidth={2}
  />

  <span className="font-semibold text-teal-600">
    Search Results
  </span>

  {!!searchQuery && (
    <>
      <ChevronRight
        className="h-4 w-4 text-slate-300"
        strokeWidth={2}
      />

      <span
        className="
          max-w-[180px]
          truncate
          font-medium
          text-slate-500
          sm:max-w-[300px]
        "
        title={searchQuery}
      >
        "{searchQuery}"
      </span>
    </>
  )}
</div>
        {/* ====================================================== */}
        {/* SEARCH HEADING */}
        {/* ====================================================== */}

        <div className="mb-5 sm:mb-6">
          <h1
            className="
              text-xl
              font-bold
              text-slate-900
              sm:text-2xl
              lg:text-3xl
            "
          >
            Search Results{" "}
            <span
                className="
                  font-semibold
                  text-teal-600
                "
              >
                "{searchQuery}"
              </span>
          </h1>
        </div>

        {/* ====================================================== */}
        {/* NO SEARCH */}
        {/* ====================================================== */}

        {!searchQuery && (
          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-12
              text-center
              sm:py-16
            "
          >
            <p
              className="
                text-sm
                text-gray-500
                sm:text-base
              "
            >
              Search for medical products
              to see results.
            </p>
          </div>
        )}

        {!!searchQuery && (
          <>
            {/* ================================================== */}
            {/* MOBILE FILTERS */}
            {/* ================================================== */}

            <MobileProductFilters
              filters={filters}
              onChange={setFilters}
            />

            {/* ================================================== */}
            {/* FILTER + PRODUCTS */}
            {/* ================================================== */}

            <div
              className="
                relative
                flex
                items-start
                gap-6
              "
            >
              {/* ================================================= */}
              {/* DESKTOP FILTERS */}
              {/* ================================================= */}

              <aside
                className="
                  sticky
                  top-[140px]
                  hidden
                  h-fit
                  shrink-0
                  lg:block
                "
              >
                <ProductFilters
                  filters={filters}
                  onChange={setFilters}
                />
              </aside>

              {/* ================================================= */}
              {/* PRODUCTS */}
              {/* ================================================= */}

              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                {!products.length ? (
                  <ProductEmpty />
                ) : (
                  <>
                    {/* ========================================= */}
                    {/* PRODUCT GRID */}
                    {/* ========================================= */}

                    <ProductGrid
                      products={products}
                    />

                    {/* ========================================= */}
                    {/* LOAD MORE */}
                    {/* ========================================= */}

                    <div
                      ref={loadMoreRef}
                      className="
                        flex
                        h-24
                        w-full
                        items-center
                        justify-center
                        clear-both
                      "
                    >
                      {isFetchingNextPage && (
                        <div
                          className="
                            py-4
                            text-center
                            text-sm
                            text-muted-foreground
                          "
                        >
                          Loading more
                          products...
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}