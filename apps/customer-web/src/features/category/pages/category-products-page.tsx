"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

import {
  ArrowLeft,
  Layers,
  ChevronDown,
  Search,
  X,
  Home,
  ChevronRight,
} from "lucide-react";

import { useCategories } from "../hooks/use-category";
import { useProducts } from "@/features/products/hooks/use-products";
import { useSubCategories } from "../hooks/use-sub-categories";

import CategorySidebar from "../components/category-sidebar";
import { CategoryProductGrid } from "../components/category-product-grid";

import { Spinner } from "@/shared/components/ui/spinner";

export default function CategoryProductsPage({
  categorySlug,
}: {
  categorySlug: string;
}) {
  const { data: categories } = useCategories();

  // ✅ Find category using SLUG
  const category = categories?.find(
    (item) => item.slug === categorySlug,
  );

  // ✅ Get sub-categories using SLUG
  const {
    data: subCategories,
    isLoading: subLoading,
    isError: subError,
  } = useSubCategories(categorySlug);

  // ✅ Products API can still use the real category ID
  const {
  data: productsResponse,
  isLoading: productLoading,
  isError: productError,
} = useProducts({
  categorySlug: categorySlug,
});
  const products =
    productsResponse?.pages?.flatMap(
      (page: any) => page?.data?.data || [],
    ) || [];

  // Helper to extract calculated price
  const getProductPrice = (product: any) => {
    const variant =
      product?.variants?.find(
        (item: any) => item.id === product.defaultVariantId,
      ) || product?.variants?.[0];

    return Number(
      variant?.pricing?.sellingPrice ??
        product?.price?.min ??
        0,
    );
  };

  // Dynamic Filter Metadata Extraction
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

  // Filter and Sort States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [priceRange, setPriceRange] =
    useState<number>(maxProductPrice);
  const [selectedBrand, setSelectedBrand] =
    useState<string>("all");
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] =
    useState<boolean>(false);

  useEffect(() => {
    setPriceRange(maxProductPrice);
  }, [maxProductPrice]);

  const isFilteringActive = useMemo(() => {
    return (
      searchQuery.trim() !== "" ||
      selectedBrand !== "all" ||
      priceRange < maxProductPrice ||
      sortBy !== "name-asc"
    );
  }, [
    searchQuery,
    selectedBrand,
    priceRange,
    maxProductPrice,
    sortBy,
  ]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedBrand("all");
    setPriceRange(maxProductPrice);
    setSortBy("name-asc");
  };

  // Processed Products
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();

      result = result.filter(
        (product: any) =>
          product?.name?.toLowerCase().includes(query) ||
          product?.description?.toLowerCase().includes(query),
      );
    }

    // Brand
    if (selectedBrand !== "all") {
      result = result.filter((product: any) => {
        const brandName =
          product?.brand?.name || product?.brand;

        return brandName === selectedBrand;
      });
    }

    // Price
    result = result.filter((product: any) => {
      const price = getProductPrice(product);

      return price <= priceRange;
    });

    // Sorting
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
          getProductPrice(a) - getProductPrice(b),
      );
    } else if (sortBy === "price-desc") {
      result.sort(
        (a, b) =>
          getProductPrice(b) - getProductPrice(a),
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

  const loading = subLoading || productLoading;

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (subError || productError) {
    return (
      <div className="py-24 text-center text-red-500">
        Products Coming Soon
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

    <span className="font-semibold text-teal-600">
      {category?.name || "Category Products"}
    </span>
  </div>

  {/* Header */}
      <div className="mb-4 lg:mb-6">
        <Link
          href="/categories"
          className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-gray-500 transition-colors hover:text-teal-600 lg:text-sm"
        >
          <ArrowLeft size={14} />
          Back to Categories
        </Link>

        <h1 className="text-[24px] font-bold tracking-tight text-gray-900 lg:text-[32px]">
          {category?.name || "Category Products"}
        </h1>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex w-full flex-row items-center justify-between gap-4 overflow-x-auto rounded-xl border border-gray-100 bg-white p-4 shadow-sm no-scrollbar">
        {/* Search */}
        <div className="relative w-72 min-w-[240px] shrink-0">
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

        {/* Filters */}
        <div className="ml-auto flex shrink-0 items-center gap-3">
          {/* Price */}
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
                setPriceRange(Number(e.target.value))
              }
              className="h-1 w-24 cursor-pointer rounded-lg bg-gray-200 accent-teal-600 sm:w-32"
            />
          </div>

          {/* Brand */}
          <div className="group relative min-w-[130px]">
            <select
              value={selectedBrand}
              onChange={(e) =>
                setSelectedBrand(e.target.value)
              }
              className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-3 pr-8 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Brands</option>

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

          {/* Sort */}
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

          {/* Clear */}
          {isFilteringActive && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex h-9 items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-red-600 transition-all hover:bg-red-100"
            >
              <X size={13} />
              Clear
            </button>
          )}
        </div>

        {/* Mobile Category Toggle */}
        <div className="flex h-9 shrink-0 border-l border-gray-200 pl-3 lg:hidden">
          <button
            type="button"
            onClick={() =>
              setIsMobileCategoryOpen(
                !isMobileCategoryOpen,
              )
            }
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold tracking-wide text-gray-700 hover:bg-gray-100"
          >
            <Layers size={13} className="text-gray-500" />

            {isMobileCategoryOpen
              ? "Hide"
              : "Categories"}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Mobile Sidebar */}

        {isMobileCategoryOpen && (
          <div className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:hidden">
            <div className="mb-2 flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Category Filter
              </span>

              <button
                type="button"
                onClick={() =>
                  setIsMobileCategoryOpen(false)
                }
                className="text-xs font-bold text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <CategorySidebar
              categorySlug={categorySlug}
              subCategories={subCategories || []}
            />
          </div>
        )}

        {/* Desktop Sidebar */}
        <aside className="hidden w-[260px] min-w-[260px] lg:block">
          <CategorySidebar
            categorySlug={categorySlug}
            subCategories={subCategories || []}
          />
        </aside>

        {/* Products */}
        <section className="flex-1">
          {processedProducts.length > 0 ? (
            <CategoryProductGrid
              products={processedProducts}
            />
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-20 text-center">
              <p className="text-sm font-medium text-gray-400">
                Products Coming Soon...
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}