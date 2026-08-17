import { Link, Star } from "lucide-react";
import {
  Product,
  ProductVariant,
} from "@/features/products/types/product.type";

interface ProductHeaderInfoProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
}

export function ProductHeaderInfo({
  product,
  selectedVariant,
}: ProductHeaderInfoProps) {
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
   <Link
  href={`/brands/${product.brand.slug}`}
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
            <div className="flex items-center gap-1">
              <Star
                size={15}
                className="fill-amber-500 stroke-amber-500"
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

      {/* NOTES */}
      {!!product.displayNotes?.length && (
        <div className="flex flex-wrap gap-2">
          {product.displayNotes.map((note) => (
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