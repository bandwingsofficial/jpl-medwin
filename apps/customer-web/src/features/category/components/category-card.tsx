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
        
        {/* Top-Left L-Shape Hover Effect */}
        <span className="absolute top-0 left-0 w-0 h-0 border-t-2 border-l-2 border-teal-600 transition-all duration-300 group-hover:w-4 h-4 group-hover:h-4" 
              style={{ width: '0px', height: '0px' }}
        />
        <span className="absolute top-0 left-0 border-t-2 border-l-2 border-teal-600 w-0 h-0 transition-all duration-300 group-hover:w-5 group-hover:h-5" />

        {/* Bottom-Right L-Shape Hover Effect */}
        <span className="absolute bottom-0 right-0 border-b-2 border-r-2 border-teal-600 w-0 h-0 transition-all duration-300 group-hover:w-5 group-hover:h-5" />

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

        {/* Description */}
        {category.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </div>
  );
}