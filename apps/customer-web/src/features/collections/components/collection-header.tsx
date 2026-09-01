"use client";

import Link from "next/link";

import { ChevronRight, Home } from "lucide-react";

import { Collection } from "../types/collection.types";

interface Props {
  collection: Collection;
  totalProducts: number;
}

export function CollectionHeader({
  collection,
  totalProducts,
}: Props) {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        md:flex-row
        md:items-center
        md:justify-between
      "
    >
      <div>
        {/* BREADCRUMBS */}

        <div className="mb-2 flex items-center gap-2 text-sm">
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

          <Link
            href="/collections"
            className="
              font-medium
              text-slate-500
              transition-colors
              hover:text-teal-600
            "
          >
            Collections
          </Link>

          <ChevronRight
            className="h-4 w-4 text-slate-300"
            strokeWidth={2}
          />

          <span className="font-semibold text-teal-600">
            {collection.name}
          </span>
        </div>

        <h2
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
          {collection.name}
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-gray-500
          "
        >
          {totalProducts} products available
        </p>
      </div>
    </div>
  );
}