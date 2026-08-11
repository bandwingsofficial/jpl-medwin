"use client";

import Link from "next/link";

import { useState, useMemo, useEffect } from "react";

import {
  ArrowLeft,
  ArrowUpDown,
  Tag,
  Layers,
  Search,
  ChevronDown,
  RotateCcw,
  Home,
  ChevronRight,
} from "lucide-react";

import { useProducts } from "@/features/products/hooks/use-products";
import { useMiniCategories } from "../hooks/use-mini-categories";
import { useSubCategories } from "../hooks/use-sub-categories";

import MiniCategorySidebar from "../components/mini-category-sidebar";
import { CategoryProductGrid } from "../components/category-product-grid";

import { Spinner } from "@/shared/components/ui/spinner";

export default function SubCategoryProductsPage({
  categorySlug,
  subCategorySlug,
}: {
  categorySlug: string;
  subCategorySlug: string;
}) {
  const [selectedMiniCategory, setSelectedMiniCategory] =
    useState<string | null>(null);

  const [isMobileCategoryOpen, setIsMobileCategoryOpen] =
    useState<boolean>(false);

  const {
    data: miniCategories,
    isLoading: miniLoading,
    isError: miniError,
  } = useMiniCategories(
    categorySlug,
    subCategorySlug,
  );

  const { data: subCategories } =
    useSubCategories(categorySlug);

  // 🔥 Find current sub category by SLUG
  const subCategory = subCategories?.find(
    (item) => item.slug === subCategorySlug,
  );

  // 🔥 Safe fallback name
  const subCategoryName =
    subCategory?.name || "Sub Category Products";

  const {
    data: productsResponse,
    isLoading: productLoading,
    isError: productError,
  } = useProducts({
    subCategoryId: subCategory?.id ?? "",
    miniCategoryId:
      selectedMiniCategory || undefined,
  });

  const products =
    productsResponse?.pages?.flatMap(
      (page: any) => page?.data?.data || [],
    ) || [];

  // Helper to extract calculated price reliably across filters/sorting
  const getProductPrice = (product: any) => {
    const variant =
      product?.variants?.find(
        (item: any) =>
          item.id === product.defaultVariantId,
      ) || product?.variants?.[0];

    return Number(
      variant?.pricing?.sellingPrice ??
        product?.price?.min ??
        0,
    );
  };

  // --- Dynamic Filter Metadata Extraction ---
  const { maxProductPrice, uniqueBrands } = useMemo(() => {
    let maxPrice = 0;
    const brandsSet = new Set<string>();

    products.forEach((product: any) => {
      const price = getProductPrice(product);

      if (price > maxPrice) {
        maxPrice = price;
      }

      if (product?.brand?.name) {
        brandsSet.add(product.brand.name);
      } else if (
        product?.brand &&
        typeof product.brand === "string"
      ) {
        brandsSet.add(product.brand);
      }
    });

    return {
      maxProductPrice: maxPrice || 10000,
      uniqueBrands: Array.from(brandsSet),
    };
  }, [products]);

  // --- Filter and Sort States ---
  const [searchQuery, setSearchQuery] =
    useState<string>("");

  const [sortBy, setSortBy] =
    useState<string>("name-asc");

  const [priceRange, setPriceRange] =
    useState<number>(maxProductPrice);

  const [selectedBrand, setSelectedBrand] =
    useState<string>("all");

  // Sync range slider if max price changes dynamically with products loaded
  useEffect(() => {
    setPriceRange(maxProductPrice);
  }, [maxProductPrice]);

  // --- Clear All Filters Handler ---
  const handleClearFilters = () => {
    setSearchQuery("");
    setSortBy("name-asc");
    setPriceRange(maxProductPrice);
    setSelectedBrand("all");
    setSelectedMiniCategory(null);
  };

  // --- Processed Products (Filtering & Sorting) ---
  const processedProducts = useMemo(() => {
    let result = [...products];

    // 0. Apply Search Text Query Filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();

      result = result.filter(
        (product: any) =>
          product?.name
            ?.toLowerCase()
            .includes(query) ||
          product?.description
            ?.toLowerCase()
            .includes(query),
      );
    }

    // 1. Apply Brand Filter
    if (selectedBrand !== "all") {
      result = result.filter((product: any) => {
        const bName =
          product?.brand?.name || product?.brand;

        return bName === selectedBrand;
      });
    }

    // 2. Apply Price Range Filter
    result = result.filter((product: any) => {
      const price = getProductPrice(product);

      return price <= priceRange;
    });

    // 3. Apply Sorting
    if (sortBy === "name-asc") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    } else if (sortBy === "name-desc") {
      result.sort((a, b) =>
        b.name.localeCompare(a.name),
      );
    } else if (sortBy === "price-asc") {
      result.sort(
        (a, b) =>
          getProductPrice(a) -
          getProductPrice(b),
      );
    } else if (sortBy === "price-desc") {
      result.sort(
        (a, b) =>
          getProductPrice(b) -
          getProductPrice(a),
      );
    }

    return result;
  }, [
    products,
    searchQuery,
    sortBy,
    priceRange,
    selectedBrand,
  ]);

  const loading = miniLoading || productLoading;

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (miniError || productError) {
    return (
      <div className="py-24 text-center text-red-500">
        Failed to load products
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-[1600px] px-4 py-4 lg:px-6 lg:py-6">

  {/* BREADCRUMBS */}

  <div className="mb-4 flex items-center gap-2 text-sm">
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
      href="/categories"
      className="
        font-medium
        text-slate-500
        transition-colors
        hover:text-teal-600
      "
    >
      Categories
    </Link>

    <ChevronRight
      className="h-4 w-4 text-slate-300"
      strokeWidth={2}
    />

    <Link
      href={`/categories/${categorySlug}`}
      className="
        max-w-[180px]
        truncate
        font-medium
        text-slate-500
        transition-colors
        hover:text-teal-600
      "
    >
      {categorySlug}
    </Link>

    <ChevronRight
      className="h-4 w-4 shrink-0 text-slate-300"
      strokeWidth={2}
    />

    <span
      className="
        max-w-[220px]
        truncate
        font-semibold
        text-teal-600
      "
    >
      {subCategoryName}
    </span>
  </div>

  {/* Header */}

  <div className="mb-4 lg:mb-6">
        <Link
          href={`/categories/${categorySlug}`}
          className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-gray-500 transition-colors hover:text-teal-600 lg:text-sm"
        >
          <ArrowLeft size={14} />
          Back
        </Link>

        {/* 🔥 Sub Category Name */}
        <h1
          className="
            animate-text-shine
            bg-gradient-to-r
            from-[#001f3f]
            via-[#0d9488]
            to-[#001f3f]
            bg-clip-text
            text-[24px]
            font-bold
            tracking-tight
            text-transparent
            lg:text-[32px]
          "
        >
          {subCategoryName}
        </h1>

        <p className="mt-1 text-xs text-gray-400">
          {processedProducts.length} Products Available
        </p>
      </div>

      {/* ✨ COMPACT SINGLE-ROW FILTER BAR UI */}
      <div className="mb-6 flex w-full flex-row items-center justify-between gap-4 overflow-x-auto rounded-xl border border-gray-100 bg-white p-4 shadow-sm no-scrollbar">
        {/* Left Side: Live Search text input field */}
        <div className="relative w-72 min-w-[240px] flex-shrink-0">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search products or slugs..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-gray-800 transition-all placeholder:text-gray-400 hover:bg-gray-50 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {/* Right Side: Select dropdown filter parameters */}
        <div className="ml-auto flex flex-shrink-0 items-center gap-3">
          {/* Price Range Slider Control Container */}
          <div className="flex h-9 min-w-[190px] items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-1.5">
            <span className="whitespace-nowrap text-xs font-medium text-gray-500">
              Max: ₹{priceRange}
            </span>

            <input
              type="range"
              min={0}
              max={maxProductPrice}
              value={priceRange}
              onChange={(e) =>
                setPriceRange(
                  Number(e.target.value),
                )
              }
              className="h-1 w-24 cursor-pointer rounded-lg bg-gray-200 accent-teal-600 sm:w-32"
            />
          </div>

          {/* Brand Selection Dropdown */}
          <div className="group relative min-w-[130px]">
            <select
              value={selectedBrand}
              onChange={(e) =>
                setSelectedBrand(e.target.value)
              }
              className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-3 pr-8 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">
                All Brands
              </option>

              {uniqueBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-hover:text-gray-600"
            />
          </div>

          {/* Sort Filter Dropdown */}
          <div className="group relative min-w-[150px]">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-3 pr-8 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="name-asc">
                Alphabetical (A - Z)
              </option>

              <option value="name-desc">
                Alphabetical (Z - A)
              </option>

              <option value="price-asc">
                Price (Low to High)
              </option>

              <option value="price-desc">
                Price (High to Low)
              </option>
            </select>

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-hover:text-gray-600"
            />
          </div>

          {/* Clear Filters Button Action */}
          <button
            type="button"
            onClick={handleClearFilters}
            className="flex h-9 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs font-semibold text-gray-500 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            title="Reset Filters"
          >
            <RotateCcw size={13} />
            Clear
          </button>
        </div>

        {/* Mobile View Filter Toggle Drawer Panel Action */}
        <div className="flex h-9 flex-shrink-0 border-l border-gray-200 pl-3 lg:hidden">
          <button
            type="button"
            onClick={() =>
              setIsMobileCategoryOpen(
                !isMobileCategoryOpen,
              )
            }
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold tracking-wide text-gray-700 hover:bg-gray-100"
          >
            <Layers
              size={13}
              className="text-gray-500"
            />

            {isMobileCategoryOpen
              ? "Hide Menu"
              : "Mini Categories"}
          </button>
        </div>
      </div>

      {/* Content Layout Area */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Mobile View Sidebar Drawer Dropdown Alternative */}
        {isMobileCategoryOpen && (
          <div className="animate-in w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm fade-in slide-in-from-top-2 duration-150 lg:hidden">
            <div className="mb-2 flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Category Filter
              </span>

              <button
                onClick={() =>
                  setIsMobileCategoryOpen(false)
                }
                className="text-xs font-bold text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <MiniCategorySidebar
              miniCategories={
                miniCategories || []
              }
              selectedMiniCategory={
                selectedMiniCategory
              }
              onSelect={(id) => {
                setSelectedMiniCategory(id);
                setIsMobileCategoryOpen(false);
              }}
            />
          </div>
        )}

        {/* Desktop View Persistent Sidebar */}
        <aside className="hidden w-full lg:block lg:w-[260px] lg:min-w-[260px]">
          <MiniCategorySidebar
            miniCategories={
              miniCategories || []
            }
            selectedMiniCategory={
              selectedMiniCategory
            }
            onSelect={setSelectedMiniCategory}
          />
        </aside>

        {/* Products Grid */}
        <section className="flex-1">
          {processedProducts.length > 0 ? (
            <CategoryProductGrid
              products={processedProducts}
            />
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white py-24 text-center">
              <p className="text-sm text-gray-500">
                Product Coming soon in this
                category. Please check back later!
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}