"use client";

import CategoryGrid from "./category-grid";

import {
  SubCategoryBanner,
} from "@/features/banners/components/sub-category-banner";

export default function CategoryPage() {
  return (
    <div
      className="
        mx-auto
        max-w-7xl
        space-y-8
        px-6
        py-10
      "
    >
      {/* Header */}

      <div className="space-y-2">

        {/* Sub Category Banner */}

      <SubCategoryBanner />
        <h1
          className="
            animate-text-shine
            bg-gradient-to-r
            from-[#001f3f]
            via-[#0d9488]
            to-[#001f3f]
            bg-clip-text
            text-[32px]
            font-bold
            text-transparent
          "
        >
          Shop by Categories
        </h1>

        <p
          className="
            max-w-2xl
            text-gray-500
          "
        >
          Curated premium medical and
          dental supplies selected for
          precision and reliability.
          Trusted by healthcare
          professionals across India.
        </p>
      </div>

      

      {/* Categories Grid */}

      <CategoryGrid />
    </div>
  );
}