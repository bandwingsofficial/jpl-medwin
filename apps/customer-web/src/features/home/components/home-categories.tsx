'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Inter } from 'next/font/google';

import { ChevronDown, LayoutGrid } from 'lucide-react';

import { useCategories } from '@/features/category/hooks/use-category';

import { Skeleton } from '@/shared/components/ui/skeleton';

// ─────────────────────────────────────────────────────────────────────────
// TYPE — clean and simple Inter font for standard clean typography
// ─────────────────────────────────────────────────────────────────────────
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export function HomeCategories() {
  const { data: categories, isLoading, isError } = useCategories();
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) return <CategorySkeleton />;
  if (isError || !categories?.length) return null;

  // Mobile uses 6 items threshold, desktop uses 8 items threshold
  const hasMoreMobile = categories.length > 6;
  const hasMoreDesktop = categories.length > 8;

  // Slice categories based on view or expanded state
  // On mobile we show 6 initially, on desktop we show 8 initially
  const displayedCategories = isExpanded 
    ? categories 
    : categories.slice(0, 8); // We handle mobile truncation dynamically or slice max needed

  return (
    <section
      className={`${inter.variable} w-full px-4 py-5 sm:px-6 lg:px-8 xl:px-10 2xl:px-12`}
      style={{ fontFamily: 'var(--font-inter), ui-sans-serif, system-ui' }}
    >
      {/* ================================================================ */}
      {/* HEADER                                                           */}
      {/* ================================================================ */}
      <div className="mb-6 flex flex-row items-start border-b border-[#E5E7EB] pb-5">  {/* LEFT */}
        <div className="flex-1">
          <div className="border-l-[3px] border-[#0D9488] pl-4">
            <h2 className="text-[24px] font-bold leading-[1.25] tracking-normal md:text-[30px] xl:text-[34px]">
              <span className="text-slate-900">
                Shop by{" "}
              </span>

              <span className="bg-gradient-to-r from-[#0BACAE] via-[#089981] to-[#0F8A6B] bg-clip-text text-transparent">
                Category
              </span>
            </h2>
          </div>
        </div>

        {/* RIGHT */}
        <div className="ml-auto flex items-center shrink-0">
          {categories.length > 6 && (
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="
  flex h-10 items-center gap-2
  rounded-lg
  border border-[#0BACAE]
  bg-white
  px-4
  text-sm font-medium
  text-[#0BACAE]
  transition-colors duration-200
  hover:bg-[#0BACAE]
  hover:text-white
" >
              <LayoutGrid size={16} />

              {isExpanded ? "Show Less" : "Explore More"}

              <ChevronDown
                size={16}
                className={`transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* ================================================================ */}
      {/* GRID                                                             */}
      {/* ================================================================ */}
      <div
        className="
          grid
          grid-cols-3
          gap-3
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-8
          xl:grid-cols-8
        "
      >
        {categories.map((category, index) => {
          // Hide items beyond index 5 if not expanded on mobile, but keep visible on sm+ screens if within 8
          const isHiddenMobile = !isExpanded && index >= 6;

          return (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className={`group relative block ${isHiddenMobile ? 'hidden sm:block' : ''} ${!isExpanded && index >= 8 ? 'sm:hidden' : ''}`}
            >
              <div
className="
  flex aspect-square items-center justify-center
  rounded-2xl
  border border-transparent
  bg-white
  transition-all duration-200
  group-hover:border-[#0BACAE]
  group-hover:shadow-md
"
              >
                <div className="flex h-full w-full items-center justify-center p-3 sm:p-4">
                  <div className="relative h-full w-full">
                    {category.imageUrl?.trim() ? (
  <Image
    src={category.imageUrl}
    alt={category.name}
    fill
    sizes="(max-width: 768px) 30vw, 12vw"
    className="object-contain transition-transform duration-300 ease-out group-hover:scale-110"
  />
) : (
  <div className="flex h-full w-full items-center justify-center px-2 text-center">
    <span className="text-sm font-semibold text-slate-600">
      {category.name}
    </span>
  </div>
)}
                  </div>
                </div>
              </div>

              <div className="mt-2 sm:mt-4 text-center">
                <h3
                  className="
  line-clamp-2 text-[11px] sm:text-[12px] font-medium leading-snug text-[#374542]
  transition-colors duration-200
  group-hover:text-[#0BACAE]
  md:text-[13px]
"
                >
                  {category.name}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function CategorySkeleton() {
  return (
    <div className="space-y-6 px-4 md:px-8 lg:px-12">
      {/* HEADER SKELETON */}
      <div className="flex items-center justify-between gap-4 border-b border-[#E3E7E4] px-1 pb-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-32 rounded bg-[#EDEFEE]" />
          <Skeleton className="h-7 w-52 rounded-md bg-[#EDEFEE]" />
          <Skeleton className="h-3.5 w-64 rounded bg-[#F2F4F3]" />
        </div>
        <Skeleton className="h-9 w-28 rounded-full bg-[#EDEFEE] shrink-0" />
      </div>

      {/* GRID SKELETON */}
      <div className="grid grid-cols-3 gap-3 px-1 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 md:gap-3.5">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-square w-full rounded-xl bg-[#F2F4F3]" />
            <Skeleton className="mx-auto h-3 w-14 rounded bg-[#F2F4F3]" />
          </div>
        ))}
      </div>
    </div>
  );
}