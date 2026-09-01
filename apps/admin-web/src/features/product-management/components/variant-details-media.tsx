"use client";

import {
  CalendarDays,
  Package,
} from "lucide-react";

import { ProductVariant } from "@/features/product-management/types/variant.type";

// =========================================
// TYPES
// =========================================

interface VariantDetailsMediaProps {
  variant: ProductVariant;
}

// =========================================
// COMPONENT
// =========================================

export function VariantDetailsMedia({
  variant,
}: VariantDetailsMediaProps) {
  const gallery =
    variant.images?.gallery ?? [];

  return (
    <div className="space-y-4">

      {/* ===================================== */}
      {/* IMAGES */}
      {/* ===================================== */}

      <section className="rounded-xl border border-gray-100 bg-white p-4">

        {/* HEADER */}

        <div className="mb-3 flex items-center justify-between">

          <h2 className="text-sm font-semibold text-gray-900">
            Variant Images
          </h2>

          <span className="text-[10px] text-gray-400">
            {gallery.length}{" "}
            {gallery.length === 1
              ? "image"
              : "images"}
          </span>

        </div>

        {/* MAIN IMAGE */}

        <div className="flex h-[300px] items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50">

          {variant.images?.main ? (
            <img
              src={variant.images.main}
              alt={variant.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center">

              <Package className="h-10 w-10 text-gray-300" />

              <p className="mt-2 text-xs text-gray-400">
                No main image
              </p>

            </div>
          )}

        </div>

        {/* GALLERY */}

        {gallery.length > 0 ? (
          <div className="mt-3 grid grid-cols-5 gap-2">

            {gallery.map(
              (image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="aspect-square overflow-hidden rounded-lg border border-gray-100 bg-gray-50"
                >
                  <img
                    src={image}
                    alt={`${variant.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              )
            )}

          </div>
        ) : (
          <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-center">

            <p className="text-[10px] text-gray-400">
              No gallery images available
            </p>

          </div>
        )}

      </section>

      {/* ===================================== */}
      {/* TIMELINE */}
      {/* ===================================== */}

      <section className="rounded-xl border border-gray-100 bg-white p-4">

        {/* HEADER */}

        <div className="mb-3 flex items-center gap-2">

          <CalendarDays className="h-4 w-4 text-teal-600" />

          <h2 className="text-sm font-semibold text-gray-900">
            Timeline
          </h2>

        </div>

        {/* TIMELINE TABLE */}

        <div className="overflow-hidden rounded-lg border border-gray-100">

          {/* CREATED */}

          <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-gray-100 px-3 py-2.5">

            <div className="flex items-center gap-2">

              <CalendarDays className="h-3.5 w-3.5 text-gray-400" />

              <span className="text-xs text-gray-500">
                Created At
              </span>

            </div>

            <span className="text-right text-xs font-medium text-gray-800">
              {variant.createdAt
                ? new Date(
                    variant.createdAt
                  ).toLocaleString()
                : "N/A"}
            </span>

          </div>

          {/* UPDATED */}

          <div className="grid grid-cols-[1fr_auto] items-center gap-4 px-3 py-2.5">

            <div className="flex items-center gap-2">

              <CalendarDays className="h-3.5 w-3.5 text-gray-400" />

              <span className="text-xs text-gray-500">
                Updated At
              </span>

            </div>

            <span className="text-right text-xs font-medium text-gray-800">
              {variant.updatedAt
                ? new Date(
                    variant.updatedAt
                  ).toLocaleString()
                : "N/A"}
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}