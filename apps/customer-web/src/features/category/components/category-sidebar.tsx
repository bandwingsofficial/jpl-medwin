"use client";

import Link from "next/link";

import { SubCategory } from "../types/category.type";

interface Props {
  categorySlug: string;
  subCategories: SubCategory[];
}

export default function CategorySidebar({
  categorySlug,
  subCategories,
}: Props) {
  return (
    <div className="sticky top-24 self-start">
      {/* Header */}
      <h2 className="mb-5 text-[20px] font-semibold uppercase tracking-wide text-[#0BACAE]">
        Sub Categories
      </h2>

      {/* View All */}
      <div className="space-y-1">
        <Link
          href={`/categories/${categorySlug}`}
          className="
            block
            w-full
            rounded-xl
            px-2
            py-1.5
            text-[12px]
            font-medium
            text-gray-800
            transition-colors
            hover:bg-teal-50
            hover:text-teal-700
          "
        >
          View All
        </Link>

        {/* Sub Categories */}
        {subCategories.map((sub) => (
          <Link
            key={sub.id}
            href={`/categories/${categorySlug}/${sub.slug}`}
            className="
              block
              w-full
              rounded-xl
              px-2
              py-1.5
              text-[12px]
              font-medium
              text-gray-800
              transition-colors
              hover:bg-teal-50
              hover:text-teal-700
            "
          >
            {sub.name}
          </Link>
        ))}
      </div>
    </div>
  );
}