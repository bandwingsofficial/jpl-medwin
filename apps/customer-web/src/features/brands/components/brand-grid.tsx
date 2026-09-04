"use client";

import { Brand } from "../types/brand.type";
import { BrandCard } from "./brand-card";

interface Props {
  brands: Brand[];
}

/*
|--------------------------------------------------------------------------
| PRIORITY BRAND ORDER
|--------------------------------------------------------------------------
*/

const PRIORITY_BRANDS = [
  "jpl",
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

export function BrandGrid({ brands }: Props) {
  if (!brands || brands.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No brands available
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | SORT PRIORITY BRANDS FIRST
  |--------------------------------------------------------------------------
  */

  const sortedBrands = [...brands].sort(
    (a, b) => {
      const getBrandPriority = (
        brand: Brand,
      ): number => {
        const brandName =
          brand.name
            ?.trim()
            .toLowerCase() || "";

        const brandSlug =
          brand.slug
            ?.trim()
            .toLowerCase() || "";

        const priorityIndex =
          PRIORITY_BRANDS.findIndex(
            (priorityBrand) =>
              brandName === priorityBrand ||
              brandSlug === priorityBrand ||
              brandName.includes(
                priorityBrand,
              ) ||
              brandSlug.includes(
                priorityBrand,
              ),
          );

        return priorityIndex === -1
          ? PRIORITY_BRANDS.length
          : priorityIndex;
      };

      const priorityA =
        getBrandPriority(a);

      const priorityB =
        getBrandPriority(b);

      /*
       * Priority brands always come first
       */
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      /*
       * Keep all other brands alphabetical
       */
      return a.name.localeCompare(
        b.name,
      );
    },
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6">
      {sortedBrands.map((brand) => (
        <BrandCard
          key={brand.id}
          brand={brand}
        />
      ))}
    </div>
  );
}