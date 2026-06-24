"use client";

import Link from "next/link";

import { useVariants } from "../hooks/use-variant";

import { VariantTable } from "./variant-table";

import { Loader } from "@/shared/components/ui/loader";

import { EmptyState } from "@/shared/components/ui/empty-state";

import { Badge } from "@/shared/components/ui/badge";

import { Button } from "@/shared/components/ui/button";

import {
  ChevronLeft,
  Package,
} from "lucide-react";

// =========================================
// TYPES
// =========================================

interface ProductVariantPageProps {
  productId: string;
}

// =========================================
// COMPONENT
// =========================================

export function ProductVariantPage(
  props: ProductVariantPageProps
) {
  const {
    productId,
  } = props;

  // =========================================
  // QUERY
  // =========================================

  const {
    variantsQuery,
  } = useVariants({
    productId,
  });

  // =========================================
  // LOADING
  // =========================================

  if (
    variantsQuery.isLoading
  ) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader />
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (
    variantsQuery.isError
  ) {
    return (
      <EmptyState
        title="Failed to load variants"
         />
    );
  }

  // =========================================
  // RESPONSE
  // =========================================

  const response =
    variantsQuery.data;

  // =========================================
  // VARIANTS FIX
  // =========================================

  const variants =
  response?.data ?? [];


  // =========================================
  // PAGINATION
  // =========================================

  const pagination =
  response?.pagination;

  // =========================================
  // EMPTY
  // =========================================

  if (!Array.isArray(variants) || !variants.length) {
    return (
      <div className="space-y-6">

        {/* TOPBAR */}
        <div className="flex items-center justify-between">

          {/* LEFT */}
          <div className="space-y-2">

            <div className="flex items-center gap-2 text-sm text-gray-500">

              <Link
                href="/products"
                className="hover:text-gray-900 transition-colors"
              >
                Products
              </Link>

              <span>/</span>

              <span>
                Variants
                </span>

            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Product Variants
            </h1>

          </div>

          {/* RIGHT */}
          <Link href="/products">

            <Button
              variant="secondary"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

          </Link>

        </div>

        {/* EMPTY */}
        <EmptyState
          title="No variants found"
        />

      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="space-y-6">

      {/* ========================================= */}
      {/* TOPBAR */}
      {/* ========================================= */}

      <div className="flex items-center justify-between">

        {/* LEFT */}
        <div className="space-y-2">

          {/* BREADCRUMB */}
          <div className="flex items-center gap-2 text-sm text-gray-500">

            <Link
              href="/products"
              className="hover:text-gray-900 transition-colors"
            >
              Products
            </Link>

            <span>/</span>

            <span>
              Variants
            </span>

          </div>

          {/* TITLE */}
          <div className="flex items-center gap-3">

            <div className="h-11 w-11 rounded-xl bg-gray-100 flex items-center justify-center">

              <Package className="h-5 w-5 text-gray-700" />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">
                Product Variants
              </h1>

              <p className="text-sm text-gray-500">
                Manage and inspect all product variants.
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <Badge variant="default">

            {pagination?.total ||
              variants.length ||
              0}
            {" "}
            Variants

          </Badge>

          {/* BACK */}
          <Link href="/products">

            <Button
              variant="secondary"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

          </Link>

        </div>

      </div>

      {/* ========================================= */}
      {/* TABLE */}
      {/* ========================================= */}

      <VariantTable
        productId={productId}
        variants={variants}
      />

    </div>
  );
}