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

  const hasMore = categories.length > 8;
  const displayedCategories = isExpanded ? categories : categories.slice(0, 8);

  return (
    <section
      className={`${inter.variable} relative space-y-6 px-4 md:px-8 lg:px-12`}
      style={{ fontFamily: 'var(--font-inter), ui-sans-serif, system-ui' }}
    >
      {/* ================================================================ */}
      {/* HEADER                                                           */}
      {/* ================================================================ */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E3E7E4] px-1 pb-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[#6E7C78]">
            <span className="h-1.5 w-1.5 rounded-[2px] bg-[#0D6E63]" />
            Catalog
            <span className="text-[#C7CFCC]">/</span>
            {categories.length} categories
          </div>
          <h2 className="text-[24px] font-semibold leading-tight tracking-tight text-[#12211D] md:text-[28px]">
            Shop by{' '}
            <span className="bg-gradient-to-r from-[#0D6E63] via-[#14B8A6] to-[#0D6E63] bg-clip-text text-transparent">
              category
            </span>
          </h2>
          <p className="text-sm text-[#6E7C78]">
            Consumables, instruments and equipment, organised the way your practice stocks them.
          </p>
        </div>

        {hasMore && (
          <button
            onClick={() => setIsExpanded((v) => !v)}
            className="
              group flex items-center gap-2 rounded-full border border-[#0D6E63]/25
              bg-white px-4 py-2 text-sm font-medium text-[#0D6E63]
              transition-all duration-200
              hover:border-[#0D6E63] hover:bg-[#0D6E63] hover:text-white
              active:scale-[0.97]
            "
          >
            <LayoutGrid size={15} strokeWidth={2.2} />
            {isExpanded ? 'Show less' : 'View all'}
            <ChevronDown
              size={15}
              strokeWidth={2.4}
              className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>
        )}
      </div>

      {/* ================================================================ */}
      {/* GRID — 8 columns on large screens with compact gaps              */}
      {/* ================================================================ */}
      <div className="grid grid-cols-3 gap-2.5 px-1 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 md:gap-3.5">
        {displayedCategories.map((category) => {
          return (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group relative block"
            >
              <div
                className="
                  relative overflow-hidden rounded-xl bg-white
                  transition-all duration-300 ease-out
                  group-hover:-translate-y-2
                "
              >
                <div className="flex aspect-square items-center justify-center p-3 md:p-4">
                  <div className="relative h-full w-full">
                    <Image
                      src={category.imageUrl || '/placeholder.png'}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 30vw, 12vw"
                      className="object-contain transition-transform duration-300 ease-out group-hover:scale-110"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-2 px-0.5 text-center">
                <h3
                  className="
                    line-clamp-2 text-[12px] font-medium leading-snug text-[#374542]
                    transition-colors duration-200 group-hover:text-[#0D6E63]
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
      <div className="flex items-end justify-between gap-4 border-b border-[#E3E7E4] px-1 pb-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-32 rounded bg-[#EDEFEE]" />
          <Skeleton className="h-7 w-52 rounded-md bg-[#EDEFEE]" />
          <Skeleton className="h-3.5 w-64 rounded bg-[#F2F4F3]" />
        </div>
        <Skeleton className="h-9 w-28 rounded-full bg-[#EDEFEE]" />
      </div>

      {/* GRID SKELETON */}
      <div className="grid grid-cols-3 gap-2.5 px-1 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 md:gap-3.5">
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