"use client";

import Link from "next/link";
import Image from "next/image";

import { ChevronRight } from "lucide-react";

import { useCategories } from "@/features/category/hooks/use-category";

import { Skeleton } from "@/shared/components/ui/skeleton";

export function HomeCategories() {
  const {
    data: categories,
    isLoading,
    isError,
  } = useCategories();

  // 🔹 LOADING
  if (isLoading) {
    return <CategorySkeleton />;
  }

  // 🔹 ERROR / EMPTY
  if (isError || !categories?.length) {
    return null;
  }

  /*
   |--------------------------------------------------------------------------
   | MOBILE => ONLY 6
   |--------------------------------------------------------------------------
   */

  const mobileCategories =
    categories.slice(0, 6);

  /*
   |--------------------------------------------------------------------------
   | DESKTOP => 12
   |--------------------------------------------------------------------------
   */

  const desktopCategories =
    categories.slice(0, 12);

  // 🔹 CHECK MORE
  const hasMore =
    categories.length > 12;

  return (
    <section className="space-y-6">
      {/* GLOBAL SHINE ANIMATION EFFECT */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes textShine {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animate-text-shine {
              background-size: 200% auto;
              animation: textShine 4s linear infinite;
            }
          `,
        }}
      />

      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between px-1">
        <div>
                  <div className="relative h-12 w-60 md:h-16 md:w-80">
  <Image
    src="/Images/image13.png"
    alt="Top Categories Banner"
    fill
    className="object-contain object-left scale-125 md:scale-150 origin-left"
    priority
  />
</div>
        </div>

        {/* DESKTOP VIEW */}
        {hasMore && (
          <Link
            href="/categories"
            className="
              hidden
              text-sm
              font-semibold
              text-teal-600
              transition-colors
              duration-300
              hover:text-teal-700
              hover:underline

              md:block
            "
          >
            View All
          </Link>
        )}

        {/* MOBILE VIEW */}
        {hasMore && (
          <Link
            href="/categories"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-gray-50
              transition-transform
              active:scale-95

              md:hidden
            "
          >
            <ChevronRight
              size={18}
              strokeWidth={2.2}
              className="text-[#64748B]"
            />
          </Link>
        )}
      </div>

      {/* ===================================================== */}
      {/* 🔥 MOBILE GRID */}
      {/* ===================================================== */}

      <div
        className="
          grid
          grid-cols-3
          gap-4

          md:hidden
        "
      >
        {mobileCategories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.id}`}
            className="block group"
          >
            {/* IMAGE BOX */}
            <div
              className="
                aspect-square
                w-full
                overflow-hidden
                rounded-xl
                border
                border-gray-100
                bg-white
                shadow-sm
                transition-transform
                duration-200
                active:scale-95
              "
            >
              <Image
                src={
                  category.imageUrl ||
                  "/placeholder.png"
                }
                alt={category.name}
                width={400}
                height={400}
                className="
                  h-full
                  w-full
                  object-contain
                  p-2
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
              />
            </div>

            {/* TEXT */}
            <div className="mt-2 text-center">
              <h3
                className="
                  line-clamp-2
                  text-[12px]
                  font-medium
                  leading-snug
                  text-gray-800
                  transition-colors
                  group-hover:text-teal-600
                "
              >
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* ===================================================== */}
      {/* 🔥 DESKTOP/TABLET GRID */}
      {/* ===================================================== */}

      <div
        className="
          hidden
          grid-cols-2
          gap-5

          sm:grid-cols-3
          md:grid
          md:grid-cols-4
          lg:grid-cols-6
        "
      >
        {desktopCategories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.id}`}
            className="block group"
          >
            {/* INTERACTIVE FLOATING BOX */}
            <div
              className="
                relative
                aspect-square
                w-full
                overflow-hidden
                rounded-2xl
                border
                border-gray-100
                bg-gradient-to-b from-white to-gray-50/30
                p-4
                shadow-[0_2px_8px_rgba(0,0,0,0.02)]
                transition-all
                duration-300
                ease-out
                
                group-hover:-translate-y-1.5
                group-hover:border-teal-500/30
                group-hover:bg-white
                group-hover:shadow-[0_12px_24px_-8px_rgba(13,148,136,0.15)]
              "
            >
              {/* Subtle radial light flash effect on background corner */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.06),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <Image
                src={
                  category.imageUrl ||
                  "/placeholder.png"
                }
                alt={category.name}
                width={400}
                height={400}
                className="
                  relative
                  z-10
                  h-full
                  w-full
                  object-contain
                  transition-transform
                  duration-500
                  ease-out
                  group-hover:scale-108
                "
              />
            </div>

            {/* TEXT */}
            <div className="mt-3 text-center">
              <h3
                className="
                  text-[15px]
                  font-semibold
                  leading-snug
                  text-gray-700
                  transition-colors
                  duration-200
                  group-hover:text-teal-600
                "
              >
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CategorySkeleton() {
  return (
    <div className="space-y-6">
      {/* HEADER SKELETON */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-52 rounded-md bg-gray-200" />
        <Skeleton className="h-4 w-72 rounded-md bg-gray-100" />
      </div>

      {/* MOBILE SKELETON */}
      <div
        className="
          grid
          grid-cols-3
          gap-4

          md:hidden
        "
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton
              className="
                aspect-square
                w-full
                rounded-lg
                bg-gray-100
              "
            />

            <Skeleton
              className="
                mx-auto
                h-3
                w-16
                rounded-md
                bg-gray-100
              "
            />
          </div>
        ))}
      </div>

      {/* DESKTOP SKELETON */}
      <div
        className="
          hidden
          grid-cols-2
          gap-5

          sm:grid-cols-3
          md:grid
          md:grid-cols-4
          lg:grid-cols-6
        "
      >
        {[...Array(12)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton
              className="
                aspect-square
                w-full
                rounded-lg
                bg-gray-100
              "
            />

            <Skeleton
              className="
                mx-auto
                h-4
                w-24
                rounded-md
                bg-gray-100
              "
            />
          </div>
        ))}
      </div>
    </div>
  );
}