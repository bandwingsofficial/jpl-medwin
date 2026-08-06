"use client";

import { useBrands } from "../hooks/use-brands";
import { BrandGrid } from "./brand-grid";
import { Spinner } from "@/shared/components/ui/spinner";

export function BrandsPage() {
  const { data, isLoading, isError } = useBrands();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
       Brands Coming soon!
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 lg:px-12 py-6 space-y-6">
      <h1 className="
            animate-text-shine
            bg-gradient-to-r 
            from-[#001f3f] 
            via-[#0d9488] 
            to-[#001f3f] 
            bg-clip-text 
            text-[28px] 
            font-bold 
            text-transparent
          ">Brands</h1>

      <BrandGrid brands={data ?? []} />
    </div>
  );
}