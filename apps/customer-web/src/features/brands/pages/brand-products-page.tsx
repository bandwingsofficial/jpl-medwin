"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ChevronRight,
  Home,
  Search,
  X,
} from "lucide-react";

import { useBrands } from "@/features/brands/hooks/use-brands";
import { useProducts } from "@/features/products/hooks/use-products";

import { ProductFilters } from "@/features/products/components/product-filters";
import { ProductCard } from "@/features/products/components/product-card";

import { Spinner } from "@/shared/components/ui/spinner";

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
  // PRODUCTS
  // =========================================================

  const {
    data: productsResponse,
    isLoading: productsLoading,
    isError: productsError,
  } = useProducts({
    ...filters,

    // 🔥 IMPORTANT
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
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
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

      // 🔥 NEVER allow the filter sidebar
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

      // 🔥 Keep brand locked.
      brandId: brand.id,
    });
  };

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="relative mx-auto max-w-[1600px] px-4 py-4 lg:px-6 lg:py-6">

      {/* =====================================================
          BREADCRUMBS
      ===================================================== */}

      <div className="mb-5 flex items-center gap-2 text-sm">

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
          Home
        </Link>

        <ChevronRight
          className="h-4 w-4 text-slate-300"
          strokeWidth={2}
        />

        <Link
          href="/brands"
          className="
            font-medium
            text-slate-500
            transition-colors
            hover:text-teal-600
          "
        >
          Brands
        </Link>

        <ChevronRight
          className="h-4 w-4 text-slate-300"
          strokeWidth={2}
        />

        <span className="font-semibold text-teal-600">
          {brand.name}
        </span>
      </div>

      {/* =====================================================
          BRAND HEADER
      ===================================================== */}

      <div
        className="
          mb-6
          rounded-2xl
          border
          border-slate-200
          bg-white
          px-5
          py-5
          shadow-sm
        "
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

          {/* BRAND IMAGE */}

          {brand.imageUrl?.trim() && (
            <div
              className="
                flex
                h-16
                w-28
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-slate-100
                bg-white
                p-2
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

          <div>
            <h1
              className="
                text-2xl
                font-bold
                tracking-tight
                text-slate-900
                md:text-3xl
              "
            >
              {brand.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Explore products from {brand.name}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE SEARCH
      ===================================================== */}

      <div className="mb-5 lg:hidden">
        <div
          className="
            flex
            h-11
            items-center
            rounded-xl
            border
            border-gray-200
            bg-white
            px-3
          "
        >
          <Search
            className="mr-2 h-4 w-4 text-gray-400"
          />

          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) =>
              setFilters((previous) => ({
                ...previous,
                search: e.target.value,
                brandId: brand.id,
              }))
            }
            placeholder={`Search ${brand.name} products...`}
            className="
              h-full
              w-full
              bg-transparent
              text-sm
              text-gray-800
              outline-none
              placeholder:text-gray-400
            "
          />

          {filters.search && (
            <button
              type="button"
              onClick={() =>
                setFilters((previous) => ({
                  ...previous,
                  search: "",
                  brandId: brand.id,
                }))
              }
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="flex flex-col gap-6 lg:flex-row">

        {/* ===================================================
            FILTER SIDEBAR
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

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {brand.name} Products
              </h2>

              <p className="mt-0.5 text-xs text-gray-500">
                {products.length} products
              </p>
            </div>

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
                Clear Filters
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
                gap-3
                sm:grid-cols-3
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