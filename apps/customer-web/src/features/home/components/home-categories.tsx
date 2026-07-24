'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { ChevronDown } from 'lucide-react';

import { useCategories } from '@/features/category/hooks/use-category';

import { Skeleton } from '@/shared/components/ui/skeleton';

export function HomeCategories() {
  const { data: categories, isLoading, isError } = useCategories();

  // State to control inline viewing expansion
  const [isExpanded, setIsExpanded] = useState(false);

  // 🔹 LOADING
  if (isLoading) {
    return <CategorySkeleton />;
  }

  // 🔹 ERROR / EMPTY
  if (isError || !categories?.length) {
    return null;
  }

  // 🔹 CHECK MORE THAN 6
  const hasMore = categories.length > 6;

  /*
   |--------------------------------------------------------------------------
   | RENDERING SLICES BASED ON TOGGLE STATE
   |--------------------------------------------------------------------------
   */
  const displayedCategories = isExpanded ? categories : categories.slice(0, 6);

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

        {/* DROPDOWN ACTIONS */}
        {hasMore && (
          <>
            {/* DESKTOP BROWSER DROP-TRIGGER BUTTON */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="
                hidden
                items-center
                gap-1
                text-sm
                font-semibold
                text-blue-600
                transition-colors
                duration-300
                hover:text-blue-700
                hover:underline
                md:flex
              "
            >
              {isExpanded ? 'Show Less' : 'Explore More'}
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>

            {/* MOBILE BROWSER DROP-TRIGGER ICON */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
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
              <ChevronDown
                size={18}
                strokeWidth={2.2}
                className={`text-[#64748B] transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>
          </>
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
        {displayedCategories.map((category) => (
          <Link key={category.id} href={`/categories/${category.id}`} className="block group">
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
                transition-all
                duration-200
                active:scale-95
                group-hover:border-blue-500/40
              "
            >
              <Image
                src={category.imageUrl || '/placeholder.png'}
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
                  duration-200
                  group-hover:text-blue-600
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
        {displayedCategories.map((category) => (
          <Link key={category.id} href={`/categories/${category.id}`} className="block group">
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
                p-1
                shadow-[0_2px_8px_rgba(0,0,0,0.02)]
                transition-all
                duration-300
                ease-out
                
                group-hover:-translate-y-1.5
                group-hover:border-blue-500/40
                group-hover:bg-white
                group-hover:shadow-[0_12px_24px_-8px_rgba(37,99,235,0.15)]
              "
            >
              {/* Subtle Blue radial light flash effect on background corner */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <Image
                src={category.imageUrl || '/placeholder.png'}
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
                  group-hover:text-blue-600
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
        {[...Array(6)].map((_, i) => (
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
