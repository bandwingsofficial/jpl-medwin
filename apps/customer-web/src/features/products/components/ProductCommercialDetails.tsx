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
          Delivery within 3–7 business days
        </p>
      </div>

      {/* DESCRIPTION */}
      {!!product.descriptions?.short && (
        <p
          className="
            text-sm
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
          <div className="flex items-center gap-3">
            <span
              className="
                text-4xl
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
                  text-2xl
                  text-gray-400
                  line-through
                "
              >
                ₹ {mrp.toLocaleString()}
              </span>
            )}
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
                  px-3
                  py-1.5
                  text-sm
                  font-semibold
                  text-green-700
                "
              >
                {discountPercentage}% OFF
              </span>

              <span
                className="
                  text-sm
                  text-gray-500
                "
              >
                You save ₹ {(mrp - sellingPrice).toLocaleString()}
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

      {/* FEATURES */}
      {!!product.features?.length && (
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
                    text-sm
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