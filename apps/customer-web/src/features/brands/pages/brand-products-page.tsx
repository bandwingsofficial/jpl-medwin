"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  ChevronRight,
  Home,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { useBrands } from "@/features/brands/hooks/use-brands";
import { useProducts } from "@/features/products/hooks/use-products";

import { ProductFilters } from "@/features/products/components/product-filters";
import { ProductCard } from "@/features/products/components/product-card";

interface BrandsProductPageProps {
  brandSlug: string;
}

interface ProductFiltersState {
  search?: string;
  categorySlug?: string;
  subCategorySlug?: string;
  miniCategorySlug?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  type?: "SIMPLE" | "VARIABLE";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/* =========================================================
   SKELETON
========================================================= */

function BrandsProductPageSkeleton() {
  return (
    <div className="relative mx-auto max-w-[1600px] px-3 py-4 sm:px-4 lg:px-6 lg:py-6">
      {/* BREADCRUMB SKELETON */}
      <div className="mb-5 flex items-center gap-2 overflow-hidden">
        <div className="h-4 w-14 shrink-0 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-2 shrink-0 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-14 shrink-0 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-2 shrink-0 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-20 shrink-0 animate-pulse rounded bg-slate-200" />
      </div>

      {/* BRAND HEADER SKELETON */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5 sm:py-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-16 w-24 shrink-0 animate-pulse rounded-xl bg-slate-100 sm:w-28" />

          <div className="min-w-0 space-y-2">
            <div className="h-7 w-36 max-w-full animate-pulse rounded-lg bg-slate-200 sm:h-8 sm:w-40" />
            <div className="h-4 w-52 max-w-full animate-pulse rounded bg-slate-100 sm:w-64" />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* FILTER SKELETON */}
        <aside className="hidden w-[240px] shrink-0 lg:block">
          <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="h-[100px] animate-pulse rounded-xl bg-slate-100" />

            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        </aside>

        {/* PRODUCTS SKELETON */}
        <section className="min-w-0 flex-1">
          <div className="mb-4 space-y-2">
            <div className="h-6 w-44 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-3
              sm:grid-cols-3
              md:gap-4
              lg:grid-cols-4
              xl:grid-cols-5
            "
          >
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                {/* IMAGE */}
                <div className="relative aspect-square animate-pulse bg-slate-100">
                  <div className="absolute right-3 top-3 h-9 w-9 rounded-full bg-slate-200" />
                  <div className="absolute bottom-3 left-3 h-6 w-16 rounded-md bg-slate-200" />
                </div>

                {/* CONTENT */}
                <div className="space-y-3 p-3 sm:p-4">
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />

                  <div className="space-y-2">
                    <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
                    <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200" />
                  </div>

                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />

                  <div className="space-y-2">
                    <div className="h-7 w-24 animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                  </div>

                  <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function BrandsProductPage({
  brandSlug,
}: BrandsProductPageProps) {
  // =========================================================
  // BRAND
  // =========================================================

  const { data: brands, isLoading: brandsLoading } = useBrands();

  const brand = brands?.find(
    (item) => item.slug === brandSlug,
  );

  // =========================================================
  // FILTER STATE
  // =========================================================

  const [filters, setFilters] =
    useState<ProductFiltersState>({
      search: "",
      categorySlug: undefined,
      subCategorySlug: undefined,
      miniCategorySlug: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      inStock: false,
      type: undefined,
      sortBy: undefined,
      sortOrder: undefined,
    });

  // =========================================================
  // MOBILE FILTER DRAWER
  // =========================================================

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] =
    useState(false);

  // =========================================================
  // PRODUCTS
  // =========================================================

  const {
    data: productsResponse,
    isLoading: productsLoading,
    isError: productsError,
  } = useProducts({
    ...filters,

    // Brand is always locked to this brand.
    brandId: brand?.id,
  });

  // =========================================================
  // FLATTEN PRODUCTS
  // =========================================================

  const products = useMemo(() => {
    return (
      productsResponse?.pages?.flatMap(
        (page: any) => page?.data?.data || [],
      ) || []
    );
  }, [productsResponse]);

  // =========================================================
  // LOADING
  // =========================================================

  if (brandsLoading || productsLoading) {
    return <BrandsProductPageSkeleton />;
  }

  // =========================================================
  // BRAND NOT FOUND
  // =========================================================

  if (!brand) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="text-xl font-semibold text-gray-900">
          Brand Not Found
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          The requested brand could not be found.
        </p>

        <Link
          href="/brands"
          className="
            mt-6
            inline-flex
            items-center
            rounded-lg
            bg-teal-600
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            transition-colors
            hover:bg-teal-700
          "
        >
          Back to Brands
        </Link>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (productsError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <p className="text-sm font-medium text-red-500">
          Failed to load products.
        </p>
      </div>
    );
  }

  // =========================================================
  // FILTER CHANGE
  // =========================================================

  const handleFilterChange = (
    nextFilters: ProductFiltersState,
  ) => {
    setFilters({
      ...nextFilters,

      // Never allow the filter sidebar
      // to remove/change the current brand.
      brandId: brand.id,
    });
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const handleClearFilters = () => {
    setFilters({
      search: "",
      categorySlug: undefined,
      subCategorySlug: undefined,
      miniCategorySlug: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      inStock: false,
      type: undefined,
      sortBy: undefined,
      sortOrder: undefined,

      // Keep brand locked.
      brandId: brand.id,
    });
  };

  // =========================================================
  // CHECK ACTIVE FILTERS
  // =========================================================

  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    Boolean(filters.inStock) ||
    Boolean(filters.type) ||
    Boolean(filters.categorySlug) ||
    Boolean(filters.subCategorySlug) ||
    Boolean(filters.miniCategorySlug) ||
    Boolean(filters.sortBy);

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="relative mx-auto max-w-[1600px] px-3 py-4 sm:px-4 lg:px-6 lg:py-6">

      {/* =====================================================
          BREADCRUMBS
      ===================================================== */}

      <div className="mb-5 flex items-center gap-2 overflow-hidden text-sm">

        <Link
          href="/"
          className="
            inline-flex
            shrink-0
            items-center
            gap-1.5
            font-medium
            text-slate-500
            transition-colors
            hover:text-teal-600
          "
        >
          <Home className="h-4 w-4 shrink-0" />
          <span>Home</span>
        </Link>

        <ChevronRight
          className="h-4 w-4 shrink-0 text-slate-300"
          strokeWidth={2}
        />

        <Link
          href="/brands"
          className="
            shrink-0
            font-medium
            text-slate-500
            transition-colors
            hover:text-teal-600
          "
        >
          Brands
        </Link>

        <ChevronRight
          className="h-4 w-4 shrink-0 text-slate-300"
          strokeWidth={2}
        />

        <span className="truncate font-semibold text-teal-600">
          {brand.name}
        </span>
      </div>

      {/* =====================================================
          BRAND HEADER
      ===================================================== */}

      <div
        className="
          mb-5
          rounded-2xl
          border
          border-slate-200
          bg-white
          px-4
          py-4
          shadow-sm
          sm:mb-6
          sm:px-5
          sm:py-5
        "
      >
        {/* 
          MOBILE:
          image LEFT + name/description RIGHT

          DESKTOP:
          same existing horizontal layout
        */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* BRAND IMAGE */}

          {brand.imageUrl?.trim() && (
            <div
              className="
                flex
                h-16
                w-24
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-slate-100
                bg-white
                p-2
                sm:h-16
                sm:w-28
              "
            >
              <img
                src={brand.imageUrl}
                alt={brand.name}
                className="
                  max-h-full
                  max-w-full
                  object-contain
                "
              />
            </div>
          )}

          {/* BRAND DETAILS */}

          <div className="min-w-0">
            <h1
              className="
                truncate
                text-xl
                font-bold
                tracking-tight
                text-slate-900
                sm:text-2xl
                md:text-3xl
              "
            >
              {brand.name}
            </h1>

            <p
              className="
                mt-1
                line-clamp-2
                text-xs
                text-gray-500
                sm:text-sm
              "
            >
              Explore products from {brand.name}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE FILTER BUTTON
      ===================================================== */}

      <div className="mb-5 lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen(true)}
          className="
            flex
            h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-teal-200
            bg-white
            px-4
            text-sm
            font-semibold
            text-teal-700
            shadow-sm
            transition-all
            active:scale-[0.98]
            hover:bg-teal-50
          "
        >
          <SlidersHorizontal className="h-4 w-4" />

          <span>Filters</span>

          {hasActiveFilters && (
            <span
              className="
                flex
                h-5
                min-w-5
                items-center
                justify-center
                rounded-full
                bg-teal-600
                px-1.5
                text-[10px]
                font-bold
                text-white
              "
            >
              1
            </span>
          )}
        </button>
      </div>

      {/* =====================================================
          MOBILE FILTER OVERLAY + SIDEBAR
      ===================================================== */}

      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden">

          {/* BACKDROP */}

          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setIsMobileFiltersOpen(false)}
            className="
              absolute
              inset-0
              bg-black/40
              backdrop-blur-[1px]
            "
          />

          {/* DRAWER */}

          <aside
            className="
              absolute
              left-0
              top-0
              flex
              h-full
              w-[88%]
              max-w-[380px]
              flex-col
              overflow-hidden
              bg-white
              shadow-2xl
            "
          >

            {/* DRAWER HEADER */}

            <div
              className="
                flex
                h-16
                shrink-0
                items-center
                justify-between
                border-b
                border-slate-200
                bg-white
                px-4
              "
            >
              <div className="flex items-center gap-2">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-teal-600
                    text-white
                  "
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Filters
                  </h2>

                  <p className="text-[11px] text-gray-500">
                    Refine your products
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-slate-200
                  text-slate-500
                  transition-colors
                  hover:bg-slate-100
                "
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* DRAWER CONTENT */}

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">

              <ProductFilters
                filters={{
                  ...filters,
                  brandId: brand.id,
                }}
                onChange={handleFilterChange}
              />

            </div>
          </aside>
        </div>
      )}

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="flex flex-col gap-6 lg:flex-row">

        {/* ===================================================
            DESKTOP FILTER SIDEBAR
            DO NOT CHANGE
        =================================================== */}

        <aside className="hidden w-[240px] shrink-0 lg:block">
          <ProductFilters
            filters={{
              ...filters,
              brandId: brand.id,
            }}
            onChange={handleFilterChange}
          />
        </aside>

        {/* ===================================================
            PRODUCTS
        =================================================== */}

        <section className="min-w-0 flex-1">

          {/* PRODUCT HEADER */}

          <div className="mb-4 flex items-center justify-between gap-3">
            {(filters.search ||
              filters.minPrice !== undefined ||
              filters.maxPrice !== undefined ||
              filters.inStock ||
              filters.type ||
              filters.categorySlug ||
              filters.subCategorySlug ||
              filters.miniCategorySlug ||
              filters.sortBy) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="
                  shrink-0
                  rounded-lg
                  border
                  border-red-100
                  bg-red-50
                  px-3
                  py-2
                  text-xs
                  font-semibold
                  text-red-600
                  transition-colors
                  hover:bg-red-100
                "
              >
                <span className="hidden sm:inline">
                  Clear Filters
                </span>

                <span className="sm:hidden">
                  Clear
                </span>
              </button>
            )}
          </div>

          {/* =================================================
              PRODUCT GRID
          ================================================= */}

          {products.length > 0 ? (
            <div
              className="
                grid
                grid-cols-2
                gap-2.5
                sm:grid-cols-3
                sm:gap-3
                md:gap-4
                lg:grid-cols-4
                xl:grid-cols-5
              "
            >
              {products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div
              className="
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-20
                text-center
              "
            >
              <p className="text-sm font-medium text-gray-400">
                No products found for {brand.name}.
              </p>

              <button
                type="button"
                onClick={handleClearFilters}
                className="
                  mt-4
                  rounded-lg
                  bg-teal-600
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-teal-700
                "
              >
                Clear Filters
              </button>
            </div>
          )}

        </section>
      </div>
    </div>
  );
}