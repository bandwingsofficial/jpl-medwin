"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

import { ArrowLeft, ArrowUpDown, Tag, Layers, ChevronDown, Search, X } from "lucide-react";

import { useCategories } from "../hooks/use-category";
import { useProducts } from "@/features/products/hooks/use-products";
import { useSubCategories } from "../hooks/use-sub-categories";

import CategorySidebar from "../components/category-sidebar";
import { CategoryProductGrid } from "../components/category-product-grid";

import { Spinner } from "@/shared/components/ui/spinner";

export default function CategoryProductsPage({
  categoryId,
}: {
  categoryId: string;
}) {
  const { data: categories } = useCategories();

  const category = categories?.find((item) => item.id === categoryId);

  const {
    data: subCategories,
    isLoading: subLoading,
    isError: subError,
  } = useSubCategories(categoryId);

  const {
    data: productsResponse,
    isLoading: productLoading,
    isError: productError,
  } = useProducts({
    categoryId,
  });

  const products =
  productsResponse?.pages?.flatMap(
    (page: any) =>
      page?.data?.data || []
  ) || [];
  
  // Helper to extract calculated price reliably across filters/sorting
  const getProductPrice = (product: any) => {
    const variant =
      product?.variants?.find(
        (item: any) => item.id === product.defaultVariantId
      ) || product?.variants?.[0];

    return Number(
      variant?.pricing?.sellingPrice ?? product?.price?.min ?? 0
    );
  };

  // --- Dynamic Filter Metadata Extraction ---
  const { maxProductPrice, uniqueBrands } = useMemo(() => {
    let maxPrice = 0;
    const brandsSet = new Set<string>();

    products.forEach((product: any) => {
      const price = getProductPrice(product);
      if (price > maxPrice) maxPrice = price;

      if (product?.brand?.name) {
        brandsSet.add(product.brand.name);
      } else if (product?.brand && typeof product.brand === "string") {
        brandsSet.add(product.brand);
      }
    });

    return {
      maxProductPrice: maxPrice || 10000, // Fallback threshold if empty
      uniqueBrands: Array.from(brandsSet),
    };
  }, [products]);

  // --- Filter and Sort States ---
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name-asc"); 
  const [priceRange, setPriceRange] = useState<number>(maxProductPrice);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState<boolean>(false);

  // Sync range slider if max price changes dynamically with products loaded safely via useEffect
  useEffect(() => {
    setPriceRange(maxProductPrice);
  }, [maxProductPrice]);

  // Check if any filter is active to show Clear Filter button
  const isFilteringActive = useMemo(() => {
    return (
      searchQuery.trim() !== "" ||
      selectedBrand !== "all" ||
      priceRange < maxProductPrice ||
      sortBy !== "name-asc"
    );
  }, [searchQuery, selectedBrand, priceRange, maxProductPrice, sortBy]);

  // Clear all filters handler
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedBrand("all");
    setPriceRange(maxProductPrice);
    setSortBy("name-asc");
  };

  // --- Processed Products (Filtering & Sorting) ---
  const processedProducts = useMemo(() => {
    let result = [...products];

    // 1. Apply Live Text Search Query Filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter((product: any) => 
        product?.name?.toLowerCase().includes(query) || 
        product?.description?.toLowerCase().includes(query)
      );
    }

    // 2. Apply Brand Filter
    if (selectedBrand !== "all") {
      result = result.filter((product: any) => {
        const bName = product?.brand?.name || product?.brand;
        return bName === selectedBrand;
      });
    }

    // 3. Apply Price Range Filter (0 to selected max)
    result = result.filter((product: any) => {
      const price = getProductPrice(product);
      return price <= priceRange;
    });

    // 4. Apply Sorting
    if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "price-asc") {
      result.sort((a, b) => getProductPrice(a) - getProductPrice(b));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => getProductPrice(b) - getProductPrice(a));
    }

    return result;
  }, [products, searchQuery, sortBy, priceRange, selectedBrand]);

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
      <div className="text-center py-24 text-red-500">
        Failed to load products
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-4 lg:py-6 relative">
      {/* Header */}
      <div className="mb-4 lg:mb-6">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-xs lg:text-sm text-gray-500 hover:text-teal-600 transition-colors mb-2 font-medium"
        >
          <ArrowLeft size={14} />
          Back to Categories
        </Link>

        <h1 className="text-[24px] lg:text-[32px] font-bold text-gray-900 tracking-tight">
          {category?.name || "Category Products"}
        </h1>
      </div>

      {/* ✨ SIMPLE LIGHTWEIGHT FILTER BAR UI - UPDATED FOR SINGLE ROW ROW LAYOUT */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6 shadow-sm flex flex-row items-center gap-4 justify-between w-full overflow-x-auto no-scrollbar">
        
        {/* Left Side: Search bar input */}
        <div className="relative w-72 min-w-[240px] flex-shrink-0">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products or slugs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50/50 hover:bg-gray-50 border border-gray-200 text-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Right Side: Select drop-down actions & range control */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
          
          {/* Price Range Controls */}
          <div className="flex items-center gap-2 bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-1.5 h-9 min-w-[190px]">
            <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
              Max: ₹{priceRange}
            </span>
            <input
              type="range"
              min={0}
              max={maxProductPrice}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-24 sm:w-32 accent-teal-600 h-1 bg-gray-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Brand Selection Dropdown */}
          <div className="relative group min-w-[130px]">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full appearance-none bg-gray-50/50 hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium rounded-lg pl-3 pr-8 py-2 h-9 focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs cursor-pointer transition-all"
            >
              <option value="all">All Brands</option>
              {uniqueBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
          </div>

          {/* Sort Filter Dropdown */}
          <div className="relative group min-w-[150px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-gray-50/50 hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium rounded-lg pl-3 pr-8 py-2 h-9 focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs cursor-pointer transition-all"
            >
              <option value="name-asc">Alphabetical (A - Z)</option>
              <option value="name-desc">Alphabetical (Z - A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
          </div>

          {/* Dynamic Clear Filters Button Actions */}
          {isFilteringActive && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex items-center justify-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 h-9 rounded-lg text-xs font-semibold tracking-wide border border-red-100 transition-all animate-in fade-in zoom-in-95 duration-150 whitespace-nowrap"
            >
              <X size={13} />
              Clear
            </button>
          )}

        </div>

        {/* Mobile Filter Toggle Drawer Interface Panel */}
        <div className="flex lg:hidden flex-shrink-0 h-9 border-l border-gray-200 pl-3">
          <button
            type="button"
            onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
            className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg px-3 py-2 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Layers size={13} className="text-gray-500" />
            {isMobileCategoryOpen ? "Hide" : "Categories"}
          </button>
        </div>
      </div>

      {/* Main Structural Layout Area Grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Mobile View Sidebar Drawer Menu Dropdown Layout */}
        {isMobileCategoryOpen && (
          <div className="w-full lg:hidden bg-white border border-gray-200 rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Category Filter</span>
              <button 
                onClick={() => setIsMobileCategoryOpen(false)}
                className="text-xs text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>
            <CategorySidebar
              categoryId={categoryId}
              subCategories={subCategories || []}
            />
          </div>
        )}

        {/* Desktop View Side Grid Navigation Anchor Column */}
        <aside className="hidden lg:block w-[260px] min-w-[260px]">
          <CategorySidebar
            categoryId={categoryId}
            subCategories={subCategories || []}
          />
        </aside>

        {/* Primary E-Commerce Product Grid Area Renderer */}
        <section className="flex-1">
          {processedProducts.length > 0 ? (
            <CategoryProductGrid products={processedProducts} />
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl py-20 text-center px-4">
              <p className="text-gray-400 text-sm font-medium">
               Proucts Coming Soon...
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}