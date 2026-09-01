"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import {
  Product,
  ProductVariant,
} from "@/features/products/types/product.type";
import { useBrands } from "@/features/brands/hooks/use-brands";

interface ProductHeaderInfoProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
}
function RatingStars({
  rating,
}: {
  rating: number;
}) {
  const normalizedRating = Math.min(
    Math.max(rating, 0),
    5,
  );

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${normalizedRating.toFixed(1)} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const starPosition = index + 1;

        const fillPercentage = Math.min(
          Math.max(
            normalizedRating - index,
            0,
          ),
          1,
        ) * 100;

        return (
          <div
            key={starPosition}
            className="relative h-[15px] w-[15px]"
          >
            {/* EMPTY STAR */}
            <Star
              size={15}
              className="absolute inset-0 fill-slate-200 stroke-slate-300"
            />

            {/* FILLED / PARTIAL STAR */}
            {fillPercentage > 0 && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  width: `${fillPercentage}%`,
                }}
              >
                <Star
                  size={15}
                  className="fill-amber-500 stroke-amber-500"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
export function ProductHeaderInfo({
  product,
  selectedVariant,
}: ProductHeaderInfoProps) {
  /*
   |--------------------------------------------------------------------------
   | BRAND
   |--------------------------------------------------------------------------
   */
  const { data: brands } = useBrands();

  const brand = brands?.find(
    (item) => item.id === product.brand?.id,
  );

  /*
   |--------------------------------------------------------------------------
   | RATINGS
   |--------------------------------------------------------------------------
   */
  const averageRating =
    selectedVariant?.ratings?.average ||
    product.ratings?.average ||
    4.5;

  const ratingsCount =
    selectedVariant?.ratings?.count ||
    product.ratings?.count ||
    50;

  return (
    <div className="space-y-2">
      {/* TITLE */}
      <div>
        <h1
          className="
            text-2xl
            font-bold
            leading-tight
            text-gray-900
            lg:text-[34px]
          "
        >
          {product.name}
        </h1>
      </div>

      {/* BRAND + RATINGS */}
      <div
        className="
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
        "
      >
        {/* BRAND */}
        {!!product.brand?.name && (
          <div
            className="
              inline-flex
              flex-row
              flex-nowrap
              items-center
              gap-2
              whitespace-nowrap
              align-middle
            "
          >
            <span
              className="
                inline-flex
                items-center
                whitespace-nowrap
                bg-slate-600
                bg-clip-text
                text-sm
                font-bold
                tracking-wide
                text-transparent
                drop-shadow-[0_1px_1px_rgba(13,148,136,0.12)]
              "
            >
              Brand :
            </span>

            {brand?.slug ? (
              <Link
                href={`/brands/${brand.slug}`}
                className="
                  inline-flex
                  items-center
                  whitespace-nowrap
                  bg-gradient-to-r
                  from-blue-600
                  via-teal-600
                  to-emerald-500
                  bg-clip-text
                  text-sm
                  font-bold
                  tracking-wide
                  text-transparent
                  drop-shadow-[0_1px_1px_rgba(13,148,136,0.12)]
                  transition-opacity
                  hover:opacity-80
                "
              >
                {product.brand.name.toUpperCase()}
              </Link>
            ) : (
              <span
                className="
                  inline-flex
                  items-center
                  whitespace-nowrap
                  bg-gradient-to-r
                  from-blue-600
                  via-teal-600
                  to-emerald-500
                  bg-clip-text
                  text-sm
                  font-bold
                  tracking-wide
                  text-transparent
                  drop-shadow-[0_1px_1px_rgba(13,148,136,0.12)]
                "
              >
                {product.brand.name.toUpperCase()}
              </span>
            )}
          </div>
        )}

        {/* RATINGS & REVIEWS */}
        {ratingsCount > 0 && (
          <div
            className="
              flex
              shrink-0
              items-center
              gap-2
              text-sm
              font-medium
              text-amber-600
            "
          >
            <div className="flex items-center gap-2">
  <RatingStars
    rating={averageRating}
  />

  <span className="font-semibold text-amber-600">
    {averageRating.toFixed(1)}
  </span>
</div>
            <span className="text-gray-400">
              •
            </span>

            <span className="text-gray-500">
              {ratingsCount} Reviews
            </span>
          </div>
        )}
      </div>

      {/* OVERWEIGHT BADGE & NOTES */}
      {(product.isOverweight || !!product.displayNotes?.length) && (
        <div className="flex flex-wrap gap-2 items-center">
          {product.isOverweight && (
            <span
              className="
                inline-flex items-center gap-1.5
                rounded-full
                border
                border-amber-300
                bg-amber-50
                px-3
                py-1
                text-xs
                font-semibold
                text-amber-800
              "
            >
              Heavy Item {product.weightKg ? `(${product.weightKg} kg)` : ""}
            </span>
          )}

          {product.displayNotes?.map((note) => (
            <span
              key={note}
              className="
                rounded-full
                border
                border-purple-200
                bg-purple-100
                px-3
                py-1
                text-xs
                font-semibold
                text-purple-700
              "
            >
              {note}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}