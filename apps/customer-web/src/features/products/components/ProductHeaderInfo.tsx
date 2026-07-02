import { Star } from "lucide-react";
import { Product, ProductVariant } from "@/features/products/types/product.type";

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
    selectedVariant?.ratings?.average || product.ratings?.average || 0;

  const ratingsCount =
    selectedVariant?.ratings?.count || product.ratings?.count || 0;

  return (
    <div className="space-y-4">
      {/* BRAND */}
      {!!product.brand?.name && (
        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.18em]
            text-gray-500
          "
        >
          {product.brand.name}
        </p>
      )}

      {/* TITLE */}
      <div className="space-y-2">
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

      {/* META */}
      <div
        className="
          flex
          flex-wrap
          items-center
          gap-3
        "
      >
        {/* RATINGS */}
        {ratingsCount > 0 && (
          <div className="flex items-center gap-2">
            <div
              className="
                flex
                items-center
                gap-1
                rounded-md
                bg-green-600
                px-2
                py-1
                text-white
              "
            >
              <Star size={13} fill="white" />
              <span className="text-xs font-semibold">
                {averageRating.toFixed(1)}
              </span>
            </div>

            <span
              className="
                text-sm
                text-gray-500
              "
            >
              {ratingsCount} ratings
            </span>
          </div>
        )}

        {/* NOTES */}
        {!!product.displayNotes?.length && (
          <div className="flex flex-wrap gap-2">
            {product.displayNotes.map((note) => (
              <span
                key={note}
                className="
                  rounded-full
                  bg-purple-100
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-purple-700
                  border
                  border-purple-200
                "
              >
                {note}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}