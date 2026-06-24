"use client";

import SubCategoryGrid from "@/features/category/components/sub-category-grid";

export default function SubCategoryPage({
  categoryId,
}: {
  categoryId: string;
}) {
 
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Explore Sub Categories
        </h1>

        <p className="text-gray-500 max-w-2xl">
          Browse specialized sub categories to find precise medical and
          healthcare products tailored to your needs.
        </p>
      </div>

      {/* Grid */}
      <SubCategoryGrid categoryId={categoryId} />
    </div>
  );
}