"use client";

import Link from "next/link";

import {
  useVariantDetails,
} from "../hooks/use-variant";

import { Loader } from "@/shared/components/ui/loader";

import { EmptyState } from "@/shared/components/ui/empty-state";

import { Badge } from "@/shared/components/ui/badge";

import { Button } from "@/shared/components/ui/button";

import {
  ChevronLeft,
  Star,
  Package,
  Boxes,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

// =========================================
// TYPES
// =========================================

interface VariantDetailsPageProps {
  productId: string;

  variantId: string;
}

// =========================================
// COMPONENT
// =========================================

export function VariantDetailsPage(
  props: VariantDetailsPageProps
) {
  const {
    productId,
    variantId,
  } = props;

  // =========================================
  // QUERY
  // =========================================

  const {
    variantDetailsQuery,
  } = useVariantDetails({
    productId,
    variantId,
  });

  // =========================================
  // LOADING
  // =========================================

  if (
    variantDetailsQuery.isLoading
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
    variantDetailsQuery.isError
  ) {
    return (
      <EmptyState
        title="Failed to load variant details"
      />
    );
  }

  // =========================================
  // DATA
  // =========================================

  const variant =
    variantDetailsQuery.data?.data;

  // =========================================
  // EMPTY
  // =========================================

  if (!variant) {
    return (
      <EmptyState
        title="Variant not found"
      />
    );
  }

  // =========================================
  // ATTRIBUTES
  // =========================================

  const attributes =
    Object.entries(
      variant.attributes || {}
    );

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

            <Link
              href={`/products/${productId}/variants`}
              className="hover:text-gray-900 transition-colors"
            >
              Variants
            </Link>

            <span>/</span>

            <span className="text-gray-900">
              {variant.name}
            </span>

          </div>

          {/* TITLE */}
          <div className="flex items-center gap-4">

            <div className="h-14 w-14 rounded-xl border overflow-hidden bg-gray-50">

              {variant.images?.main ? (
                <img
                  src={variant.images.main}
                  alt={variant.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
              )}

            </div>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">
                {variant.name}
              </h1>

              <p className="text-sm text-gray-500">
                SKU:
                {" "}
                {variant.sku}
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <Link
          href={`/products/${productId}/variants`}
        >

          <Button variant="secondary">

            <ChevronLeft className="h-4 w-4 mr-2" />

            Back

          </Button>

        </Link>

      </div>

      {/* ========================================= */}
      {/* MAIN GRID */}
      {/* ========================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ========================================= */}
        {/* LEFT */}
        {/* ========================================= */}

        <div className="xl:col-span-2 space-y-6">

          {/* MAIN IMAGE */}
          <div className="rounded-2xl border bg-white p-6">

            <div className="aspect-square rounded-xl overflow-hidden border bg-gray-50">

              {variant.images?.main ? (
                <img
                  src={variant.images.main}
                  alt={variant.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Package className="h-10 w-10 text-gray-300" />
                </div>
              )}

            </div>

            {/* GALLERY */}
            {!!variant.images?.gallery?.length && (

              <div className="mt-4 flex gap-3 overflow-x-auto">

                {variant.images.gallery.map(
                  (
                    image,
                    index
                  ) => (
                    <div
                      key={index}
                      className="h-20 w-20 rounded-lg overflow-hidden border bg-gray-50 shrink-0"
                    >

                      <img
                        src={image}
                        alt={`gallery-${index}`}
                        className="h-full w-full object-cover"
                      />

                    </div>
                  )
                )}

              </div>
            )}

          </div>

          {/* ATTRIBUTES */}
          <div className="rounded-2xl border bg-white p-6">

            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Variant Attributes
            </h2>

            {attributes.length ? (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {attributes.map(
                  ([key, value]) => (

                    <div
                      key={key}
                      className="rounded-xl border p-4"
                    >

                      <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">

                        {key}

                      </p>

                      <p className="font-medium text-gray-900">

                        {value}

                      </p>

                    </div>
                  )
                )}

              </div>

            ) : (

              <p className="text-sm text-gray-500">
                No attributes available.
              </p>

            )}

          </div>

        </div>

        {/* ========================================= */}
        {/* RIGHT */}
        {/* ========================================= */}

        <div className="space-y-6">

          {/* STATUS */}
          <div className="rounded-2xl border bg-white p-6">

            <div className="flex items-center justify-between">

              <h2 className="font-semibold text-gray-900">
                Status
              </h2>

              <Badge
                variant={
                  variant.status === "ACTIVE"
                    ? "success"
                    : "danger"
                }
              >
                {variant.status}
              </Badge>

            </div>

          </div>

          {/* PRICING */}
          <div className="rounded-2xl border bg-white p-6">

            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Pricing
            </h2>

            <div className="space-y-4">

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Selling Price
                </span>

                <span className="font-semibold text-gray-900">
                  ₹
                  {variant.pricing?.sellingPrice?.toLocaleString()}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  MRP
                </span>

                <span className="font-medium text-gray-700">
                  ₹
                  {variant.pricing?.mrp?.toLocaleString()}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Purchase Price
                </span>

                <span className="font-medium text-gray-700">
                  ₹
                  {variant.pricing?.purchasePrice?.toLocaleString()}
                </span>

              </div>

            </div>

          </div>

          {/* INVENTORY */}
          <div className="rounded-2xl border bg-white p-6">

            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Inventory
            </h2>

            <div className="space-y-4">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2 text-gray-500">

                  <Boxes className="h-4 w-4" />

                  <span>
                    Stock
                  </span>

                </div>

                <Badge
                  variant={
                    variant.stock?.inStock
                      ? "success"
                      : "danger"
                  }
                >
                  {variant.stock?.quantity}
                </Badge>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Availability
                </span>

                <span className="font-medium text-gray-900">

                  {variant.stock?.inStock
                    ? "In Stock"
                    : "Out of Stock"}

                </span>

              </div>

            </div>

          </div>

          {/* WARRANTY */}
          <div className="rounded-2xl border bg-white p-6">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2 text-gray-500">

                <ShieldCheck className="h-4 w-4" />

                <span>
                  Warranty
                </span>

              </div>

              <span className="font-semibold text-gray-900">

                {variant.warrantyMonths}
                {" "}
                Months

              </span>

            </div>

          </div>

          {/* RATINGS */}
          <div className="rounded-2xl border bg-white p-6">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2 text-gray-500">

                <Star className="h-4 w-4" />

                <span>
                  Ratings
                </span>

              </div>

              <div className="text-right">

                <p className="font-semibold text-gray-900">

                  {variant.ratings?.average || 0}

                </p>

                <p className="text-xs text-gray-400">

                  {variant.ratings?.count || 0}
                  {" "}
                  Reviews

                </p>

              </div>

            </div>

          </div>

          {/* DATES */}
          <div className="rounded-2xl border bg-white p-6">

            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Timeline
            </h2>

            <div className="space-y-4">

              <div className="flex items-start gap-3">

                <CalendarDays className="h-4 w-4 text-gray-400 mt-1" />

                <div>

                  <p className="text-sm text-gray-500">
                    Created At
                  </p>

                  <p className="font-medium text-gray-900">

                    {new Date(
                      variant.createdAt
                    ).toLocaleString()}

                  </p>

                </div>

              </div>

              <div className="flex items-start gap-3">

                <CalendarDays className="h-4 w-4 text-gray-400 mt-1" />

                <div>

                  <p className="text-sm text-gray-500">
                    Updated At
                  </p>

                  <p className="font-medium text-gray-900">

                    {new Date(
                      variant.updatedAt
                    ).toLocaleString()}

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}