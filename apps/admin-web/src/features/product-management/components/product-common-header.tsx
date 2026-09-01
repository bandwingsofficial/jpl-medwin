"use client";

import {
  Boxes,
  ChevronRight,
  Package,
  Star,
  Tag,
} from "lucide-react";

import {
  ProductCommonDetailsData,
} from "./product-common-details";

// =========================================
// TYPES
// =========================================

interface ProductCommonHeaderProps {
  product: ProductCommonDetailsData;
}

// =========================================
// HELPERS
// =========================================

function formatPrice(
  value?: number
): string {
  if (value === undefined || value === null) {
    return "N/A";
  }

  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

// =========================================
// COMPONENT
// =========================================

export function ProductCommonHeader({
  product,
}: ProductCommonHeaderProps) {
  const variants =
    product.variants ?? [];

  const variantCount =
    variants.length;

  const stockQuantity =
    product.stock?.quantity ?? 0;

  const isInStock =
    product.stock?.inStock === true &&
    stockQuantity > 0;

  const rating =
    product.ratings?.average ?? 0;

  const ratingCount =
    product.ratings?.count ?? 0;

  const minPrice =
    product.price?.min;

  const maxPrice =
    product.price?.max;

  const hasPriceRange =
    minPrice !== undefined &&
    maxPrice !== undefined &&
    minPrice !== maxPrice;

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-4">

      {/* ===================================== */}
      {/* TOP */}
      {/* ===================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

        {/* LEFT */}

        <div className="min-w-0">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Package className="h-5 w-5" />
            </div>

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <h1 className="text-xl font-bold tracking-tight text-gray-900">
                  {product.name}
                </h1>

                {product.type && (
                  <span className="rounded-md bg-gray-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                    {product.type}
                  </span>
                )}
              </div>

              {/* BRAND */}

              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
 <Tag className="h-3.5 w-3.5 text-gray-400" />

             <span
  className="
    font-semibold
    bg-gradient-to-r
    from-blue-600
    via-indigo-500
    to-purple-600
    bg-clip-text
    text-transparent
  "
>
  {product.brand?.name.toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase()) || "Brand not available"}
</span>
                {product.subCategory?.name && (
                  <>
                    <ChevronRight className="h-3 w-3 text-gray-300" />

                    <span>
                      {product.subCategory.name}
                    </span>
                  </>
                )}

                {product.miniCategory?.name && (
                  <>
                    <ChevronRight className="h-3 w-3 text-gray-300" />

                    <span>
                      {product.miniCategory.name}
                    </span>
                  </>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT STATUS */}

        <div className="flex shrink-0 items-center gap-2">

          <span className="rounded-md bg-green-50 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-green-700">
            Active
          </span>

          <span
            className={
              isInStock
                ? "rounded-md bg-blue-50 px-2.5 py-1.5 text-[10px] font-bold text-blue-700"
                : "rounded-md bg-red-50 px-2.5 py-1.5 text-[10px] font-bold text-red-600"
            }
          >
            {isInStock
              ? "In Stock"
              : "Out of Stock"}
          </span>

        </div>
      </div>

      {/* ===================================== */}
      {/* SUMMARY */}
      {/* ===================================== */}

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4 sm:grid-cols-4">

        {/* PRICE */}

        <div className="rounded-lg bg-gray-50/70 px-3 py-2.5">

          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
            Price
          </p>

          <p className="mt-1 text-base font-bold text-gray-900">
            {hasPriceRange
              ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
              : formatPrice(minPrice)}
          </p>

        </div>

        {/* VARIANTS */}

        <div className="rounded-lg bg-gray-50/70 px-3 py-2.5">

          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
            Variants
          </p>

          <div className="mt-1 flex items-center gap-1.5">

            <Boxes className="h-3.5 w-3.5 text-teal-600" />

            <p className="text-base font-bold text-gray-900">
              {variantCount}
            </p>

          </div>

        </div>

        {/* STOCK */}

        <div className="rounded-lg bg-gray-50/70 px-3 py-2.5">

          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
            Stock
          </p>

          <p className="mt-1 text-base font-bold text-gray-900">
            {stockQuantity}
          </p>

        </div>

        {/* RATING */}

        <div className="rounded-lg bg-gray-50/70 px-3 py-2.5">

          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
            Rating
          </p>

          <div className="mt-1 flex items-center gap-1.5">

            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />

            <span className="text-base font-bold text-gray-900">
              {rating}
            </span>

            <span className="text-[10px] text-gray-400">
              ({ratingCount})
            </span>

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* CATEGORY PATH */}
      {/* ===================================== */}

      <div className="mt-3 flex flex-wrap items-center gap-2">

       
        {product.category?.name && (
          <span className="rounded-md bg-teal-50 px-2 py-1 text-[10px] font-semibold text-teal-700">
            {product.category.name}
          </span>
        )}

        {product.subCategory?.name && (
          <>
            <ChevronRight className="h-3 w-3 text-gray-300" />

            <span className="rounded-md bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600">
              {product.subCategory.name}
            </span>
          </>
        )}

        {product.miniCategory?.name && (
          <>
            <ChevronRight className="h-3 w-3 text-gray-300" />

            <span className="rounded-md bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600">
              {product.miniCategory.name}
            </span>
          </>
        )}

      </div>

    </section>
  );
}