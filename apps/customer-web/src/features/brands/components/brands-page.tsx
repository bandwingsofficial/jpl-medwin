"use client";

import Link from "next/link";

import { useBrands } from "../hooks/use-brands";
import { BrandGrid } from "./brand-grid";
import { Spinner } from "@/shared/components/ui/spinner";
import { ChevronRight, Home } from "lucide-react";

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
      {/* BREADCRUMBS */}

      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/"
          className="
            inline-flex
            items-center
            gap-1.5
            font-medium
            text-slate-500
            transition-colors
            hover:text-teal-600
          "
        >
          <Home className="h-4 w-4" />
          Home
        </Link>

        <ChevronRight
          className="h-4 w-4 text-slate-300"
          strokeWidth={2}
        />

        <span className="font-semibold text-teal-600">
          Brands
        </span>
      </div>

      {/* HEADING */}

      <h1
        className="
          animate-text-shine
          bg-gradient-to-r
          from-[#001f3f]
          via-[#0d9488]
          to-[#001f3f]
          bg-clip-text
          text-[28px]
          font-bold
          text-transparent
        "
      >
        Brands
      </h1>

      <BrandGrid brands={data ?? []} />
    </div>
  );
}