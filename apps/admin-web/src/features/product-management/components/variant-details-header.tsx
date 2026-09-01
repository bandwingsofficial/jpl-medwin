"use client";

import Link from "next/link";

import {
  ArrowLeft,
  ChevronRight,
  Home,
  Package,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import { ProductVariant } from "@/features/product-management/types/variant.type";

// =========================================
// TYPES
// =========================================

interface VariantDetailsHeaderProps {
  productId: string;
  variant: ProductVariant;
}

// =========================================
// COMPONENT
// =========================================

export function VariantDetailsHeader({
  productId,
  variant,
}: VariantDetailsHeaderProps) {
  const isActive =
    variant.status === "ACTIVE";

  return (
    <div className="space-y-4">

      {/* ===================================== */}
      {/* BREADCRUMBS */}
      {/* ===================================== */}

      <div className="
        flex
        min-w-0
        items-center
        gap-2
        overflow-hidden
        text-sm
      ">

        {/* HOME */}

        <Link
          href="/"
          className="
            inline-flex
            shrink-0
            items-center
            gap-1.5
            font-medium
            text-slate-500
            transition-colors
            hover:text-teal-600
          "
        >
          <Home className="h-4 w-4" />

          <span>
            Home
          </span>
        </Link>

        <ChevronRight
          className="h-4 w-4 shrink-0 text-slate-300"
          strokeWidth={2}
        />

        {/* PRODUCTS */}

        <Link
          href="/products"
          className="
            shrink-0
            font-medium
            text-slate-500
            transition-colors
            hover:text-teal-600
          "
        >
          Products
        </Link>

        <ChevronRight
          className="h-4 w-4 shrink-0 text-slate-300"
          strokeWidth={2}
        />

        {/* VARIANTS */}

        <Link
          href={`/products/${productId}/variants`}
          className="
            shrink-0
            font-medium
            text-slate-500
            transition-colors
            hover:text-teal-600
          "
        >
          Variants
        </Link>

        <ChevronRight
          className="h-4 w-4 shrink-0 text-slate-300"
          strokeWidth={2}
        />

        {/* CURRENT VARIANT */}

        <span className="
          min-w-0
          truncate
          font-semibold
          text-teal-600
        ">
          {variant.name}
        </span>

      </div>

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="
        flex
        items-center
        justify-between
        gap-4
      ">

        {/* LEFT */}

        <div className="
          flex
          min-w-0
          items-center
          gap-3
        ">

          {/* ICON */}

          <div className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-gray-100
          ">
            <Package className="
              h-5
              w-5
              text-gray-600
            " />
          </div>

          {/* INFORMATION */}

          <div className="min-w-0">

            <div className="
              flex
              flex-wrap
              items-center
              gap-2
            ">

              <h1 className="
                max-w-[600px]
                truncate
                text-xl
                font-bold
                tracking-tight
                text-gray-900
              ">
                {variant.name}
              </h1>

              {/* STATUS */}

              <span
                className={`
                  rounded-md
                  px-2
                  py-1
                  text-[10px]
                  font-semibold
                  ${
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }
                `}
              >
                {variant.status}
              </span>

            </div>

            {/* SKU + SLUG */}

            <div className="
              mt-1
              flex
              flex-wrap
              items-center
              gap-x-3
              gap-y-1
              text-xs
              text-gray-500
            ">

              <span>
                SKU:
                {" "}
                <span className="
                  font-semibold
                  text-gray-700
                ">
                  {variant.sku || "N/A"}
                </span>
              </span>

              <span className="text-gray-300">
                |
              </span>

              <span className="min-w-0">
                Slug:
                {" "}
                <span className="
                  break-all
                  font-medium
                  text-gray-700
                ">
                  {variant.slug || "N/A"}
                </span>
              </span>

            </div>

          </div>

        </div>

        {/* BACK */}

        <Link
          href={`/products/${productId}/variants`}
          className="shrink-0"
        >
          <Button
            variant="secondary"
            className="
              h-9
              rounded-lg
            "
          >
            <ArrowLeft className="
              mr-2
              h-4
              w-4
            " />

            Back
          </Button>
        </Link>

      </div>

    </div>
  );
}