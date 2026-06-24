"use client";

import Link from "next/link";
import { useSubCategories } from "../hooks/use-sub-categories";
import { Spinner } from "@/shared/components/ui/spinner";

/**
 * 🔥 Helper: resolve image safely
 */
const getImageUrl = (sub: any): string | null => {
  const raw =
    sub.image ||
    sub.imageUrl ||
    sub.icon ||
    sub.thumbnail ||
    null;

  if (!raw) return null;

  if (raw.startsWith("http")) return raw;

  return `${process.env.NEXT_PUBLIC_API_URL}${raw}`;
};

export default function SubCategoryGrid({
  categoryId,
}: {
  categoryId: string;
}) {
  const { data, isLoading, isError } =
    useSubCategories(categoryId);

  // 🔹 LOADING
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  // 🔹 ERROR
  if (isError) {
    return (
      <div className="text-center text-red-500 py-20">
        Failed to load sub categories
      </div>
    );
  }

  // 🔹 EMPTY
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-20">
        No sub categories found
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* 🔥 TITLE */}
      <div className="flex items-center justify-between">
        
        <span className="text-sm text-gray-500">
          {data.length} Sub Categories
        </span>
      </div>

      {/* 🔥 GRID */}
<div
  className="
    grid
    grid-cols-2
    sm:grid-cols-3
    md:grid-cols-4
    lg:grid-cols-6
    xl:grid-cols-6
    gap-5
  "
>
        {data.map((sub) => (
          <Link
            key={sub.id}
            href={`/categories/${categoryId}/${sub.id}`}
            className="block group"
          >
            {/* IMAGE */}
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-white border border-gray-100">

              <img
                src={getImageUrl(sub) || "/placeholder.png"}
                alt={sub.name}
                className="
                  w-full
                  h-full
                  object-contain
                  p-2
                  transition-opacity
                  duration-300
                  group-hover:opacity-90
                "
              />
            </div>

            {/* CONTENT */}
            <div className="mt-3 text-center">
              <h3 className="text-[15px] font-medium text-gray-800 leading-snug">
                {sub.name}
              </h3>

              {sub.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {sub.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}