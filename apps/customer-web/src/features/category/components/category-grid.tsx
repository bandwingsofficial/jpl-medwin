"use client";

import Link from "next/link";
import { useCategories } from "../hooks/use-category";
import CategoryCard from "./category-card";
import { Spinner } from "@/shared/components/ui/spinner";

export default function CategoryGrid() {
  const { data, isLoading, isError } = useCategories();

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
      <div className="text-center py-20 text-red-500">
        Failed to load categories
      </div>
    );
  }

  // 🔹 EMPTY
  if (!data?.length) {
    return (
      <div className="text-center py-20 text-gray-500">
        No categories found
      </div>
    );
  }

  // 🔹 GRID
  return (
    <div
      className="
        grid
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-6
        gap-5
      "
    >
      {data.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.id}`}
          className="block"
        >
          <CategoryCard category={category} />
        </Link>
      ))}
    </div>
  );
}