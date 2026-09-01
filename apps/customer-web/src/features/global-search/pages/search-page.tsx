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

/*
|--------------------------------------------------------------------------
| BRAND PRIORITY
|--------------------------------------------------------------------------
|
| When two products have the same search relevance,
| these brands should appear first.
|
*/

const PRIORITY_BRANDS = [
  "jpl",
  "medwin",
  "markwin",
];

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
        },
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
        page?.data?.data || [],
    ) || [];

  /*
   * ================================================================
   * REMOVE DUPLICATES
   * ================================================================
   */

  const uniqueProducts = Array.from(
    new Map(
      rawProducts.map(
        (product) => [
          product.id,
          product,
        ],
      ),
    ).values(),
  );

  /*
   * ================================================================
   * SEARCH PRIORITY
   * ================================================================
   *
   * Same search relevance logic used in SearchDropdown.
   *
   * Priority:
   *
   * 0 = Exact match
   * 1 = Starts with search
   * 2 = Contains complete search phrase
   * 3+ = Individual word matching
   *
   * Lower number = higher priority.
   *
   */

  const normalizedSearch =
    searchQuery
      .trim()
      .toLowerCase();

  const getSearchPriority = (
    product: any,
  ): number => {
    if (!normalizedSearch) {
      return 0;
    }

    const productName =
      String(
        product.name ||
        product.productName ||
        "",
      ).toLowerCase();

    /*
     * Exact product match
     */

    if (
      productName ===
      normalizedSearch
    ) {
      return 0;
    }

    /*
     * Product name starts with search
     */

    if (
      productName.startsWith(
        normalizedSearch,
      )
    ) {
      return 1;
    }

    /*
     * Product contains complete search phrase
     */

    if (
      productName.includes(
        normalizedSearch,
      )
    ) {
      return 2;
    }

    /*
     * Individual search word matching
     */

    const searchWords =
      normalizedSearch
        .split(/\s+/)
        .filter(Boolean);

    const matchedWords =
      searchWords.filter(
        (word) =>
          productName.includes(
            word,
          ),
      ).length;

    /*
     * More matched words
     * = higher priority.
     *
     * Example:
     *
     * Search:
     * "surgical gloves"
     *
     * Product A:
     * Matches both words
     *
     * Product B:
     * Matches only "gloves"
     *
     * Product A appears first.
     *
     */

    return (
      10 - matchedWords
    );
  };

  /*
   * ================================================================
   * BRAND PRIORITY
   * ================================================================
   *
   * This is only used when products have
   * the same search relevance.
   *
   * JPL
   * ↓
   * Medwin
   * ↓
   * Markwin
   * ↓
   * Other brands
   *
   */

  const getBrandPriority = (
    product: any,
  ): number => {
    /*
     * Search across possible product brand fields.
     *
     * This safely supports different API response shapes.
     *
     */

    const brandData =
      [
        product.brandName,
        product.brand?.name,
        product.brand?.title,
        product.brand,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    const brandIndex =
      PRIORITY_BRANDS.findIndex(
        (brand) =>
          brandData.includes(
            brand,
          ),
      );

    return brandIndex === -1
      ? PRIORITY_BRANDS.length
      : brandIndex;
  };

  /*
   * ================================================================
   * SORT PRODUCTS BY PRIORITY
   * ================================================================
   *
   * FIRST:
   * Search relevance
   *
   * SECOND:
   * Brand priority
   *
   * THIRD:
   * Keep the original API order.
   *
   */

  const products =
    uniqueProducts
      .map(
        (product, index) => ({
          product,
          originalIndex: index,
        }),
      )
      .sort(
        (a, b) => {
          /*
           * --------------------------------------------------------
           * FIRST PRIORITY:
           * SEARCH RELEVANCE
           * --------------------------------------------------------
           */

          const searchPriorityA =
            getSearchPriority(
              a.product,
            );

          const searchPriorityB =
            getSearchPriority(
              b.product,
            );

          if (
            searchPriorityA !==
            searchPriorityB
          ) {
            return (
              searchPriorityA -
              searchPriorityB
            );
          }

          /*
           * --------------------------------------------------------
           * SECOND PRIORITY:
           * BRAND PRIORITY
           * --------------------------------------------------------
           */

          const brandPriorityA =
            getBrandPriority(
              a.product,
            );

          const brandPriorityB =
            getBrandPriority(
              b.product,
            );

          if (
            brandPriorityA !==
            brandPriorityB
          ) {
            return (
              brandPriorityA -
              brandPriorityB
            );
          }

          /*
           * --------------------------------------------------------
           * THIRD PRIORITY:
           * PRESERVE ORIGINAL API ORDER
           * --------------------------------------------------------
           *
           * This prevents random jumping
           * between products with exactly
           * the same priority.
           *
           */

          return (
            a.originalIndex -
            b.originalIndex
          );
        },
      )
      .map(
        ({ product }) =>
          product,
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

            <span>
              Home
            </span>
          </Link>

          <ChevronRight
            className="
              h-4
              w-4
              text-slate-300
            "
            strokeWidth={2}
          />

          <span
            className="
              font-semibold
              text-teal-600
            "
          >
            Search Results
          </span>

          {!!searchQuery && (
            <>
              <ChevronRight
                className="
                  h-4
                  w-4
                  text-slate-300
                "
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

        <div
          className="
            mb-5
            sm:mb-6
          "
        >
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
              {/* =============================================== */}
              {/* DESKTOP FILTERS */}
              {/* =============================================== */}

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

              {/* =============================================== */}
              {/* PRODUCTS */}
              {/* =============================================== */}

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