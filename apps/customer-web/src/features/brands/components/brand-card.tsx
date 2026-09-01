"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Card } from "@/shared/components/ui/card";
import { Brand } from "../types/brand.type";

interface Props {
  brand: Brand;
}

/*
|--------------------------------------------------------------------------
| PRIORITY BRANDS
|--------------------------------------------------------------------------
|
| These brands must always appear first.
| The order here is the exact display priority.
|
*/

export const PRIORITY_BRANDS = [
  "gdc",
  "3m",
  "gc",
  "ivoclar",
  "dentsply",
  "mani",
  "denmax",
  "healix",
  "neoendo",
  "prevest denpro",
];

/*
|--------------------------------------------------------------------------
| BRAND PRIORITY HELPER
|--------------------------------------------------------------------------
|
| Returns the priority position of the brand.
| Lower number = higher priority.
|
*/

export function getBrandPriority(
  brand: Brand,
): number {
  const normalizedName =
    brand.name
      ?.trim()
      .toLowerCase() || "";

  const normalizedSlug =
    brand.slug
      ?.trim()
      .toLowerCase() || "";

  const priorityIndex =
    PRIORITY_BRANDS.findIndex(
      (priorityBrand) =>
        normalizedName === priorityBrand ||
        normalizedSlug === priorityBrand ||
        normalizedName.includes(priorityBrand) ||
        normalizedSlug.includes(priorityBrand),
    );

  return priorityIndex === -1
    ? PRIORITY_BRANDS.length
    : priorityIndex;
}

/*
|--------------------------------------------------------------------------
| BRAND CARD
|--------------------------------------------------------------------------
*/

export function BrandCard({ brand }: Props) {
  const router = useRouter();

  return (
    <Card
      onClick={() =>
        router.push(`/brands/${brand.slug}`)
      }
      className="
        group
        cursor-pointer
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#00828a]
        hover:shadow-lg
        active:scale-[0.98]
      "
    >
      <div className="relative h-[110px] w-full overflow-hidden">
        {brand.imageUrl?.trim() ? (
          <Image
            src={brand.imageUrl}
            alt={brand.name}
            fill
            sizes="100%"
            className="
              object-contain
              transition-transform
              duration-300
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
              flex
              h-full
              w-full
              items-center
              justify-center
              bg-white
              px-2
              text-center
              text-base
              font-semibold
              leading-tight
              text-slate-700
              transition-all
              duration-300
              group-hover:text-[#00828a]
            "
          >
            <span className="line-clamp-2">
              {brand.name}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}