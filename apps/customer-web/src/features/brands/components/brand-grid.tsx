"use client";

import { Brand } from "../types/brand.type";
import { BrandCard } from "./brand-card";

interface Props {
  brands: Brand[];
}

export function BrandGrid({ brands }: Props) {
  if (!brands || brands.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No brands available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {brands.map((brand) => (
        <BrandCard key={brand.id} brand={brand} />
      ))}
    </div>
  );
}