"use client";

import { useState, useEffect } from "react";
import { useCategories } from "@/features/category/hooks/use-category";
import { useSubCategories } from "@/features/category/hooks/use-sub-categories";
import { Spinner } from "@/shared/components/ui/spinner";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";

export function CategoryMegaMenu() {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Set the default active category once data loads
  useEffect(() => {
    if (categories && categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  // Filter top-level categories based on search input
  const filteredCategories = categories?.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Safely find the name of the currently active category from the top-level dataset
  const activeCategoryName = categories?.find(c => c.id === activeCategoryId)?.name || "Items";

  return (
    /* 👉 FIX: Changed 'left-0' to 'left-1/2 -translate-x-1/2' 
         This shifts the 950px mega menu container to align nicely with the page content layout center.
    */
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[950px] z-50 select-none">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[380px]">
        
        {/* 🔍 TOP SEARCH BAR */}
        <div className="p-3 bg-white border-b border-gray-100 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#BEEDEA] transition"
            />
          </div>
        </div>

        {/* 📁 MAIN LAYOUT CONTAINER */}
        <div className="flex flex-1 min-h-0">
          
          {/* 🏷️ LEFT VERTICAL CATEGORY SIDEBAR */}
          <div className="w-[240px] bg-gray-50/70 border-r border-gray-100 overflow-y-auto py-1 custom-scrollbar">
            {isCategoriesLoading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : (
              filteredCategories?.map((category) => {
                const isActive = activeCategoryId === category.id;
                const categoryIcon = (category as any).icon || (category as any).imageUrl;

                return (
                  <div
                    key={category.id}
                    onMouseEnter={() => setActiveCategoryId(category.id)}
                    className={`flex items-center justify-between px-4 py-2.5 mx-2 my-0.5 rounded-xl cursor-pointer transition-all ${
                      isActive
                        ? "bg-[#E6F7F5] text-[#0F9EA5] font-semibold"
                        : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {categoryIcon && (
                        <img
                          src={categoryIcon}
                          alt=""
                          className="w-4 h-4 object-contain opacity-80"
                        />
                      )}
                      <span className="text-[13px] truncate">{category.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3 block h-3 text-[#0F9EA5]" />}
                  </div>
                );
              })
            )}

            {!isCategoriesLoading && filteredCategories?.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6">No matching categories</p>
            )}
          </div>

          {/* 📦 RIGHT DYNAMIC SUB-CATEGORY CONTENT AREA */}
          <div className="flex-1 bg-white overflow-y-auto p-5 custom-scrollbar">
            {activeCategoryId ? (
              <SubCategoryPanel 
                categoryId={activeCategoryId} 
                categoryName={activeCategoryName}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Hover over a category to see products
              </div>
            )}
          </div>

        </div>

        {/* 📋 BOTTOM DIRECTORY FOOTER BAR */}
        <div className="bg-white border-t border-gray-100 px-5 py-2.5 flex-shrink-0">
          <Link 
            href="/categories" 
            className="text-xs font-semibold text-[#0F9EA5] hover:underline inline-flex items-center"
          >
            Full Store Directory
          </Link>
        </div>
      </div>
    </div>
  );
}

interface SubCategoryPanelProps {
  categoryId: string;
  categoryName: string;
}

/**
 * 🛠️ Internal Panel Component to handle subcategory fetching per category ID
 */
function SubCategoryPanel({ categoryId, categoryName }: SubCategoryPanelProps) {
  const { data: subCategories, isLoading, isError } = useSubCategories(categoryId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-10">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <p className="text-xs text-red-500 text-center py-6">Failed to load items</p>;
  }

  if (!subCategories || subCategories.length === 0) {
    return <p className="text-xs text-gray-400 text-center py-6">No items available</p>;
  }

  return (
    <div className="space-y-3 animate-in fade-in duration-150">
      {/* Dynamic Sub Category Header Counter */}
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-bold text-gray-800 tracking-wide">
          {categoryName}
        </h3>
        <span className="bg-[#E6F7F5] text-[#0F9EA5] text-[11px] px-2 py-0.5 rounded-md font-bold">
          {subCategories.length}
        </span>
      </div>

      {/* 3-Column layout grid containing text items */}
      <div className="grid grid-cols-3 gap-x-6 gap-y-2.5">
        {subCategories.map((sub) => (
          <Link
            key={sub.id}
            href={`/categories/${categoryId}/${sub.id}`}
            className="group flex items-center min-w-0"
          >
            <span className="text-[13px] font-medium text-gray-600 group-hover:text-[#0F9EA5] transition-colors truncate">
              {sub.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}