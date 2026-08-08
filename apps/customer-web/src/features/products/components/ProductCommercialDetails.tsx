import { CheckCircle2,ChevronDown } from "lucide-react";
import { Product, ProductVariant } from "@/features/products/types/product.type";
import { useState } from "react";

interface ProductCommercialDetailsProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
}

export function ProductCommercialDetails({
  product,
}: ProductCommercialDetailsProps) {
  const [showKeyFeatures, setShowKeyFeatures] = useState(false);
  return (
    <div className="space-y-4 mt-2">
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

       {/* FEATURES */}
      {!!product.features?.length && (
        <div className="space-y-3 pt-2">
          {/* KEY FEATURES DROPDOWN BUTTON */}
          <button
            type="button"
            onClick={() =>
              setShowKeyFeatures((previous) => !previous)
            }
            className="
              flex
              w-full
              items-center
              justify-between
              rounded-lg
              border
              border-gray-200
              bg-white
              px-3
              py-2.5
              text-left
              transition-colors
              duration-200
              hover:bg-gray-50
            "
          >
            <span
              className="
                text-xs
                sm:text-sm
                font-semibold
                text-gray-900
              "
            >
              Key Features
            </span>

            <ChevronDown
              size={18}
              className={`
                shrink-0
                text-gray-500
                transition-transform
                duration-200
                ${
                  showKeyFeatures
                    ? "rotate-180"
                    : "rotate-0"
                }
              `}
            />
          </button>

          {/* KEY FEATURES CONTENT */}
          {showKeyFeatures && (
            <div
              className="
                grid
                gap-x-6
                gap-y-2
                grid-cols-1
                sm:grid-cols-2
                rounded-lg
                border
                border-gray-100
                bg-gray-50
                p-3
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
          )}
        </div>
      )}
    </div>
  );
}