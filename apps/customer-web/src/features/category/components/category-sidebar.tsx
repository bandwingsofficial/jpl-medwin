"use client";

import Link from "next/link";

import { SubCategory } from "../types/category.type";

interface Props {
  categoryId: string;
  subCategories: SubCategory[];
}

export default function CategorySidebar({
  categoryId,
  subCategories,
}: Props) {
  return (
    <div
      className="
        sticky
        top-32
        w-full
        bg-white
        rounded-xl
        border
        border-gray-200
        p-4
        shadow-sm
      "
    >
      <h3
        className="
          text-sm
          font-bold
          mb-4
          bg-gradient-to-r 
          from-teal-600 
          via-teal-400 
          to-teal-700 
          bg-clip-text 
          text-transparent 
          animate-pulse
          tracking-wide
          uppercase
        "
      >
        Sub Categories
      </h3>

      <div className="space-y-1">
        {subCategories.map((sub) => (
          <Link
            key={sub.id}
            href={`/categories/${categoryId}/${sub.id}`}
            className="
              block
              w-full
              px-3
              py-2
              rounded-lg
              text-sm
              text-gray-700
              hover:bg-teal-50
              hover:text-teal-700
              font-medium
              transition-colors
            "
          >
            {sub.name}
          </Link>
        ))}
      </div>
    </div>
  );
}