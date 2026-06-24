"use client";

import { Category } from "../types/category.type";

export default function CategoryCard({
  category,
}: {
  category: Category;
}) {
  return (
    <div className="group cursor-pointer transition-all duration-300 hover:-translate-y-1">
      {/* Image Box */}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white border border-gray-100">
        {/* Opposite Edge Border Hover Effect */}
        <span className="absolute inset-0 border-t-2 border-b-2 border-teal-600 scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
        <span className="absolute inset-0 border-l-2 border-r-2 border-teal-600 scale-y-0 transition-transform duration-300 group-hover:scale-y-100" />

        <img
          src={category.imageUrl || "/placeholder.png"}
          alt={category.name}
          className="w-full h-full object-contain p-2 transition-opacity duration-300 group-hover:opacity-90"
        />
      </div>

      {/* Content */}
      <div className="mt-3 text-center">
        <p className="text-[15px] font-medium text-gray-800 leading-snug">
          {category.name}
        </p>

        {category.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </div>
  );
}