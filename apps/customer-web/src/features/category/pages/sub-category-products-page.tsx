"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

import { ArrowLeft, ArrowUpDown, Tag, Layers, Search, ChevronDown, RotateCcw } from "lucide-react";

import { useProducts } from "@/features/products/hooks/use-products";
import { useMiniCategories } from "../hooks/use-mini-categories";
import { useSubCategories } from "../hooks/use-sub-categories";

import MiniCategorySidebar from "../components/mini-category-sidebar";
import { CategoryProductGrid } from "../components/category-product-grid";

import { Spinner } from "@/shared/components/ui/spinner";

export default function SubCategoryProductsPage({
  categoryId,
  subCategoryId,
}: {
  categoryId: string;
  subCategoryId: string;
}) {
  const [selectedMiniCategory, setSelectedMiniCategory] = useState<string | null>(null);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState<boolean>(false);

  const {
    data: miniCategories,
    isLoading: miniLoading,
    isError: miniError,
  } = useMiniCategories(subCategoryId);

  const { data: subCategories } = useSubCategories(categoryId);

  // 🔥 Find current sub category
  const subCategory = subCategories?.find((item) => item.id === subCategoryId);

  // 🔥 Safe fallback name
  const subCategoryName = subCategory?.name || "Sub Category Products";

  const {
    data: productsResponse,
    isLoading: productLoading,
    isError: productError,
  } = useProducts({
    subCategoryId,
    miniCategoryId: selectedMiniCategory || undefined,
  });

 const products =
  productsResponse?.pages?.flatMap(
    (page: any) =>
      page?.data?.data || []
  ) || [];

  // Helper to extract calculated price reliably across filters/sorting
  const getProductPrice = (product: any) => {
    const variant =
      product?.variants?.find((item: any) => item.id === product.defaultVariantId) ||
      product?.variants?.[0];

    return Number(variant?.pricing?.sellingPrice ?? product?.price?.min ?? 0);
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
      result = result.filter((product: any) => 
        product?.name?.toLowerCase().includes(query) || 
        product?.description?.toLowerCase().includes(query)
      );
    }

    // 1. Apply Brand Filter
    if (selectedBrand !== "all") {
      result = result.filter((product: any) => {
        const bName = product?.brand?.name || product?.brand;
        return bName === selectedBrand;
      });
    }

    // 2. Apply Price Range Filter (0 to selected max)
    result = result.filter((product: any) => {
      const price = getProductPrice(product);
      return price <= priceRange;
    });

    // 3. Apply Sorting
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
      <div className="text-center py-24 text-red-500">Failed to load products</div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-4 lg:py-6 relative">
      {/* Header */}
      <div className="mb-4 lg:mb-6">
        <Link
          href={`/categories/${categoryId}`}
          className="inline-flex items-center gap-2 text-xs lg:text-sm text-gray-500 hover:text-teal-600 transition-colors mb-2 font-medium"
        >
          <ArrowLeft size={14} />
          Back
        </Link>

        {/* 🔥 Sub Category Name */}
        <h1 className="
            animate-text-shine
            bg-gradient-to-r 
            from-[#001f3f] 
            via-[#0d9488] 
            to-[#001f3f] 
            bg-clip-text 
            text-[24px] 
            lg:text-[32px] 
            font-bold 
            text-transparent
            tracking-tight
          ">
          {subCategoryName}{" "}
        </h1>

        <p className="text-xs text-gray-400 mt-1">
          {processedProducts.length} Products Available
        </p>
      </div>

      {/* ✨ COMPACT SINGLE-ROW FILTER BAR UI */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6 shadow-sm flex flex-row items-center gap-4 justify-between w-full overflow-x-auto no-scrollbar">
        
        {/* Left Side: Live Search text input field */}
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

        {/* Right Side: Select dropdown filter parameters */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
          
          {/* Price Range Slider Control Container */}
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

          {/* Clear Filters Button Action */}
          <button
            type="button"
            onClick={handleClearFilters}
            className="flex items-center justify-center gap-1.5 px-3 h-9 text-xs font-semibold text-gray-500 hover:text-red-600 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg transition-all whitespace-nowrap cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw size={13} />
            Clear
          </button>

        </div>

        {/* Mobile View Filter Toggle Drawer Panel Action */}
        <div className="flex lg:hidden flex-shrink-0 h-9 border-l border-gray-200 pl-3">
          <button
            type="button"
            onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
            className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg px-3 py-2 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Layers size={13} className="text-gray-500" />
            {isMobileCategoryOpen ? "Hide Menu" : "Mini Categories"}
          </button>
        </div>
      </div>

      {/* Content Layout Area */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile View Sidebar Drawer Dropdown Alternative */}
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
            <MiniCategorySidebar
              miniCategories={miniCategories || []}
              selectedMiniCategory={selectedMiniCategory}
              onSelect={(id) => {
                setSelectedMiniCategory(id);
                setIsMobileCategoryOpen(false); // Close menu automatically on selection
              }}
            />
          </div>
        )}

        {/* Desktop View Persistent Sidebar */}
        <aside className="hidden lg:block w-full lg:w-[260px] lg:min-w-[260px]">
          <MiniCategorySidebar
            miniCategories={miniCategories || []}
            selectedMiniCategory={selectedMiniCategory}
            onSelect={setSelectedMiniCategory}
          />
        </aside>

        {/* Products Grid */}
        <section className="flex-1">
          {processedProducts.length > 0 ? (
            <CategoryProductGrid products={processedProducts} />
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl py-24 text-center">
              <p className="text-gray-500 text-sm">
                Product Coming soon in this category. Please check back later!
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}