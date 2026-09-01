"use client";

import MiniCategoryGrid from "./mini-category-grid";

export default function MiniCategoryPage({
  categoryId,
  subCategoryId,
}: {
  categoryId: string;
  subCategoryId: string;
}) {
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Explore Mini- Categories
        </h1>

        <p className="text-gray-500 max-w-2xl">
          Discover products tailored to your specific needs.
        </p>
      </div>

      <MiniCategoryGrid
        categoryId={categoryId}
        subCategoryId={subCategoryId}
      />
    </div>
  );
}