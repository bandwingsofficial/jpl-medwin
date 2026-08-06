import { CheckCircle2 } from "lucide-react";
import { Product, ProductVariant } from "@/features/products/types/product.type";

interface ProductCommercialDetailsProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
}

export function ProductCommercialDetails({
  product,
  selectedVariant,
}: ProductCommercialDetailsProps) {
  /*
   |--------------------------------------------------------------------------
   | PRICING
   |--------------------------------------------------------------------------
   */
  const mrp = selectedVariant?.pricing?.mrp || product.price.max;
  const sellingPrice = selectedVariant?.pricing?.sellingPrice || product.price.min;

  const discountPercentage =
    mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

  /*
   |--------------------------------------------------------------------------
   | STOCK
   |--------------------------------------------------------------------------
   */
  const isInStock = selectedVariant?.stock?.inStock || false;

  /*
   |--------------------------------------------------------------------------
   | ATTRIBUTES
   |--------------------------------------------------------------------------
   */
  const attributes: Record<string, string> = selectedVariant?.attributes || {};

  return (
    <div className="space-y-4 mt-4">
      {/* DELIVERY INFO */}
      <div
        className="
          rounded-xl
          border
          border-blue-100
          bg-blue-50
          p-3.5
          sm:p-4
        "
      >
        <p
          className="
            text-xs
            sm:text-sm
            font-medium
            text-blue-900
          "
        >
          Delivery within 3–7 business days
        </p>
      </div>

      {/* DESCRIPTION */}
      {!!product.descriptions?.short && (
        <p
          className="
            text-xs
            sm:text-sm
            leading-6
            text-gray-600
          "
        >
          {product.descriptions.short}
        </p>
      )}

      
      {/* PRICE SECTION */}
      <div
        className="
          rounded-2xl
          border
          border-gray-200
          bg-gray-50
          p-3.5
          sm:p-4
        "
      >
        <div
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:flex-wrap
            sm:items-center
            sm:justify-between
            sm:gap-x-4
            sm:gap-y-3
          "
        >
          {/* PRICE & DISCOUNT CONTAINER FOR MOBILE */}
          <div className="flex items-center justify-between sm:justify-start sm:gap-3">
            {/* PRICE */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span
                className="
                  text-2xl
                  sm:text-4xl
                  font-bold
                  leading-none
                  text-black
                "
              >
                ₹ {sellingPrice.toLocaleString()}
              </span>

              {mrp > sellingPrice && (
                <span
                  className="
                    text-lg
                    sm:text-2xl
                    text-gray-400
                    line-through
                  "
                >
                  ₹ {mrp.toLocaleString()}
                </span>
              )}
            </div>

            {/* STOCK (MOBILE: MOVED UP NEXT TO PRICE FOR CLEAN LAYOUT) */}
            <div
              className="
                sm:hidden
                rounded-xl
                border
                border-green-200
                bg-green-50
                px-3
                py-1.5
              "
            >
              {isInStock ? (
                <div className="space-y-0.5">
                  <p
                    className="
                      text-xs
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
                    text-xs
                    font-semibold
                    text-red-500
                  "
                >
                  Out Of Stock
                </p>
              )}
            </div>
          </div>

          {/* DISCOUNT */}
          {discountPercentage > 0 && (
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
                  px-2.5
                  py-1
                  sm:px-3
                  sm:py-1.5
                  text-xs
                  sm:text-sm
                  font-semibold
                  text-green-700
                "
              >
                {discountPercentage}% OFF
              </span>

              <span
                className="
                  text-xs
                  sm:text-sm
                  text-gray-500
                "
              >
                You save ₹ {(mrp - sellingPrice).toLocaleString()}
              </span>
            </div>
          )}

          {/* STOCK (DESKTOP) */}
          <div
            className="
              hidden
              sm:block
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

      {/* FEATURES */}
      {!!product.features?.length && (
        <div className="space-y-3">
          <h3
            className="
              text-xs
              sm:text-sm
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
              grid-cols-1
              sm:grid-cols-2
            "
          >
            {product.features.map((feature) => (
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
                    text-xs
                    sm:text-sm
                    leading-6
                    text-gray-700
                  "
                >
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}