"use client";

import Link from "next/link";
import { useMiniCategories } from "../hooks/use-mini-categories";
import { Spinner } from "@/shared/components/ui/spinner";

const getImageUrl = (item: any): string | null => {
  const raw =
    item.image ||
    item.imageUrl ||
    item.icon ||
    item.thumbnail ||
    null;

  if (!raw) return null;

  if (raw.startsWith("http")) return raw;

  return `${process.env.NEXT_PUBLIC_API_URL}${raw}`;
};

export default function MiniCategoryGrid({
  subCategoryId,
}: {
  categoryId: string;
  subCategoryId: string;
}) {
  const { data, isLoading, isError } =
    useMiniCategories(subCategoryId);

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
        Failed to load mini categories
      </div>
    );
  }

  // 🔹 EMPTY
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-20">
        No mini categories found
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* 🔥 TITLE */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {data.length} Mini Categories
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
        {data.map((item: any) => {
          const imageUrl = getImageUrl(item);

          return (
            <Link
              key={item.id}
              href={`/products?miniCategoryId=${item.id}`}
              className="block group"
            >
              {/* IMAGE */}
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-white border border-gray-100">

                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={item.name}
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
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-gray-500 bg-gray-100">
                    {item.name?.charAt(0)}
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="mt-3 text-center">
                <h3 className="text-[15px] font-medium text-gray-800 leading-snug">
                  {item.name}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}