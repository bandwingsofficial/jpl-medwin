import {
  BadgeCheck,
  CheckCircle2,
  Star,
} from "lucide-react";

import {
  Product,
  ProductVariant,
} from "@/features/products/types/product.type";

interface ProductInfoProps {
  product: Product;

  selectedVariant?: ProductVariant | null;
}

export function ProductInfo({
  product,
  selectedVariant,
}: ProductInfoProps) {
  /*
   |--------------------------------------------------------------------------
   | PRICING
   |--------------------------------------------------------------------------
   */

  const mrp =
    selectedVariant?.pricing?.mrp ||
    product.price.max;

  const sellingPrice =
    selectedVariant?.pricing
      ?.sellingPrice ||
    product.price.min;

  const discountPercentage =
    mrp > sellingPrice
      ? Math.round(
          ((mrp - sellingPrice) /
            mrp) *
            100
        )
      : 0;

  /*
   |--------------------------------------------------------------------------
   | STOCK
   |--------------------------------------------------------------------------
   */

  const stockQuantity =
    selectedVariant?.stock
      ?.quantity || 0;

  const isInStock =
    selectedVariant?.stock
      ?.inStock || false;

  /*
   |--------------------------------------------------------------------------
   | RATINGS
   |--------------------------------------------------------------------------
   */

  const averageRating =
    selectedVariant?.ratings
      ?.average ||
    product.ratings?.average ||
    0;

  const ratingsCount =
    selectedVariant?.ratings
      ?.count ||
    product.ratings?.count ||
    0;

  /*
   |--------------------------------------------------------------------------
   | ATTRIBUTES
   |--------------------------------------------------------------------------
   */

  const attributes: Record<
    string,
    string
  > =
    selectedVariant?.attributes ||
    {};

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

        {!!product.descriptions
          ?.short && (
          <p
            className="
              text-sm
              leading-6
              text-gray-600
            "
          >
            {
              product.descriptions
                .short
            }
          </p>
        )}
      </div>
      {/* ====================================================== */}
      {/* DELIVERY INFO */}
      {/* ====================================================== */}

      <div
        className="
          rounded-xl
          border
          border-blue-100
          bg-blue-50
          p-4
        "
      >
        <p
          className="
            text-sm
            font-medium
            text-blue-900
          "
        >
          Delivery within 3–7
          business days
        </p>
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
              <Star
                size={13}
                fill="white"
              />

              <span className="text-xs font-semibold">
                {averageRating.toFixed(
                  1
                )}
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
        {!!product.displayNotes
          ?.length && (
          <div className="flex flex-wrap gap-2">
            {product.displayNotes.map(
              (note) => (
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
              )
            )}
          </div>
        )}
      </div>

      {/* PRICE SECTION */}
      <div
        className="
          rounded-2xl
          border
          border-gray-200
          bg-gray-50
          p-4
        "
      >
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-x-4
            gap-y-3
          "
        >
          {/* PRICE */}
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                text-4xl
                font-bold
                leading-none
                text-black
              "
            >
              ₹
              {sellingPrice.toLocaleString()}
            </span>

            {mrp > sellingPrice && (
              <span
                className="
                  text-2xl
                  text-gray-400
                  line-through
                "
              >
                ₹
                {mrp.toLocaleString()}
              </span>
            )}
          </div>

          {/* DISCOUNT */}
          {discountPercentage >
            0 && (
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <span
                className="
                  rounded-lg
                  bg-green-100
                  px-3
                  py-1.5
                  text-sm
                  font-semibold
                  text-green-700
                "
              >
                {discountPercentage}%
                OFF
              </span>

              <span
                className="
                  text-sm
                  text-gray-500
                "
              >
                You save ₹
                {(
                  mrp -
                  sellingPrice
                ).toLocaleString()}
              </span>
            </div>
          )}

          {/* STOCK */}
          <div
            className="
              ml-auto
              rounded-xl
              border
              border-green-200
              bg-green-50
              px-4
              py-2
            "
          >
            {isInStock ? (
              <div className="space-y-0.5">
                <p
                  className="
                    text-sm
                    font-semibold
                    text-green-700
                  "
                >
                  In Stocks
                </p>
              </div>
            ) : (
              <p
                className="
                  text-sm
                  font-semibold
                  text-red-500
                "
              >
                Out Of Stock
              </p>
            )}
          </div>
        </div>
      </div>

      {/* VARIANT ATTRIBUTES */}
      {!!Object.keys(attributes)
        .length && (
        <div className="space-y-2">
          <h3
            className="
              text-sm
              font-semibold
              text-gray-900
            "
          >
            Variant Details
          </h3>

          <div className="flex flex-wrap gap-2">
            {Object.entries(
              attributes
            ).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-2.5
                  "
                >
                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-wide
                      text-gray-400
                    "
                  >
                    {key}
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-sm
                      font-semibold
                      text-gray-900
                    "
                  >
                    {String(value)}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* FEATURES */}
      {!!product.features
        ?.length && (
        <div className="space-y-3">
          <h3
            className="
              text-sm
              font-semibold
              text-gray-900
            "
          >
            Key Features
          </h3>

          <div
            className="
              grid
              gap-x-6
              gap-y-2

              sm:grid-cols-2
            "
          >
            {product.features.map(
              (feature) => (
                <div
                  key={feature}
                  className="
                    flex
                    items-start
                    gap-2
                  "
                >
                  <CheckCircle2
                    className="
                      mt-0.5
                      h-4
                      w-4
                      shrink-0
                      text-green-600
                    "
                  />

                  <p
                    className="
                      text-sm
                      leading-6
                      text-gray-700
                    "
                  >
                    {feature}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}