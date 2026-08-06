import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { ProductFilters } from "../types/product.type";
import { useBrands } from "@/features/brand-management/hooks/use-brand"; // Adjust the path if necessary to point to your brand hooks file
import { useCategories } from "@/features/category-management/hooks/use-category"; // Adjust the path if necessary to point to your category hooks file
import { useSubCategories } from "@/features/sub-category-management/hooks/use-sub-category"; // Adjust the path if necessary to point to your subcategory hooks file

interface ProductFiltersBarProps {
  filters: ProductFilters;
  onFilterChange: (newFilters: Partial<ProductFilters>) => void;
  onReset: () => void;
  // Optional overrides kept intact to prevent breaking changes on parents
  categories?: { id: string; name: string }[];
  brands?: { id: string; name: string }[];
  subCategories?: { id: string; name: string }[];
}

export const ProductFiltersBar: React.FC<ProductFiltersBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  categories: overrideCategories,
  brands: overrideBrands,
  subCategories: overrideSubCategories,
}) => {
  // 🔹 Fetch lists automatically using your custom React Query hooks
  const brandsQuery = useBrands();
  const categoriesQuery = useCategories();
  const subCategoriesQuery = useSubCategories();

  // Local state to handle fast input typing without losing focus or resetting selection mid-interaction
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  // Sync local state if parent filters reset or update externally
  useEffect(() => {
    setSearchTerm(filters.search || "");
  }, [filters.search]);

  // 300ms Debounce effect for parent query state search text submissions
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if ((filters.search || "") !== searchTerm) {
        onFilterChange({ search: searchTerm });
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, onFilterChange, filters.search]);

  // 🔹 Smart Extraction: Safe check for standard nested .data array payloads vs raw object lists
  const availableBrands = overrideBrands ?? 
    (Array.isArray(brandsQuery.data) ? brandsQuery.data : (brandsQuery.data as any)?.data) ?? [];
    
  const availableCategories = overrideCategories ?? 
    (Array.isArray(categoriesQuery.data) ? categoriesQuery.data : (categoriesQuery.data as any)?.data) ?? [];
    
  const availableSubCategories = overrideSubCategories ?? 
    (Array.isArray(subCategoriesQuery.data) ? subCategoriesQuery.data : (subCategoriesQuery.data as any)?.data) ?? [];

  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 p-4 mb-4 flex flex-wrap items-center gap-3 shadow-xs">
      
      {/* Search Input Box with Icon */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 h-10 rounded-lg border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-hidden focus:border-gray-300 focus:ring-0 transition-colors"
        />
      </div>

      {/* Category Dropdown Selector */}
      <div className="relative min-w-[150px]">
        <select
          value={filters.categoryId || ""}
          onChange={(e) => onFilterChange({ categoryId: e.target.value })}
          className="w-full h-10 px-3 pr-8 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white appearance-none cursor-pointer focus:outline-hidden focus:border-gray-300 transition-colors"
        >
          <option value="">All Categories</option>
          {availableCategories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-500" />
      </div>

      {/* Sub-Category Dropdown Selector (New) */}
      <div className="relative min-w-[150px]">
        <select
          value={(filters as any).subCategoryId || ""}
          onChange={(e) => onFilterChange({ subCategoryId: e.target.value } as any)}
          className="w-full h-10 px-3 pr-8 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white appearance-none cursor-pointer focus:outline-hidden focus:border-gray-300 transition-colors"
        >
          <option value="">All Sub-Categories</option>
          {availableSubCategories.map((subCat: any) => (
            <option key={subCat.id} value={subCat.id}>
              {subCat.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-500" />
      </div>

      {/* Brand Dropdown Selector */}
      <div className="relative min-w-[150px]">
        <select
          value={filters.brandId || ""}
          onChange={(e) => onFilterChange({ brandId: e.target.value })}
          className="w-full h-10 px-3 pr-8 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white appearance-none cursor-pointer focus:outline-hidden focus:border-gray-300 transition-colors"
        >
          <option value="">All Brands</option>
          {availableBrands.map((b: any) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-500" />
      </div>

      {/* Status Dropdown Selector */}
      <div className="relative min-w-[140px]">
        <select
          value={filters.status || ""}
          onChange={(e) => onFilterChange({ status: e.target.value as any })}
          className="w-full h-10 px-3 pr-8 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white appearance-none cursor-pointer focus:outline-hidden focus:border-gray-300 transition-colors"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-500" />
      </div>

      {/* Clear Filters Reset Button */}
      {(filters.search || filters.categoryId || (filters as any).subCategoryId || filters.brandId || filters.status) && (
        <button
          onClick={onReset}
          className="h-10 px-4 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ml-auto sm:ml-0 whitespace-nowrap"
        >
          <X className="h-3.5 w-3.5" />
          Clear Filters
        </button>
      )}
    </div>
  );
};