import {
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import {
  Product,
  ProductVariant,
} from "@/features/products/types/product.type";
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
    <div className="w-full space-y-4">
      {/* DELIVERY INFO */}
      <div
        className="
          rounded-lg
          border
          border-blue-100
          bg-blue-50
          px-4
          py-2.5
          text-sm
          font-medium
          text-blue-700
        "
      >
        Delivery within 3–7 business days
      </div>

      {/* DESCRIPTION */}
      {!!product.descriptions?.short && (
        <p
          className="
            text-xs
            leading-6
            text-gray-600
            sm:text-sm
          "
        >
          {product.descriptions.short}
        </p>
      )}

      {/* FEATURES */}
      {!!product.features?.length && (
        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-teal-100
            bg-white
          "
        >
          {/* KEY FEATURES HEADER */}
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
              border-b
              border-teal-100
              bg-teal-50
              px-4
              py-3
              text-left
            "
          >
            <div className="flex items-center gap-2.5">
              <div
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-md
                  bg-teal-100
                  text-teal-600
                "
              >
                <CheckCircle2
                  size={16}
                  strokeWidth={2.2}
                />
              </div>

              <div>
                <p
                  className="
                    text-sm
                    font-semibold
                    text-gray-900
                  "
                >
                  Key Features
                </p>

                <p
                  className="
                    text-[10px]
                    text-gray-500
                  "
                >
                  Product highlights
                </p>
              </div>
            </div>

            {/* ARROW */}
            <div
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                bg-white
                text-teal-600
                ring-1
                ring-teal-100
              "
            >
              <ChevronDown
                size={16}
                className={`
                  transition-transform
                  duration-200
                  ${
                    showKeyFeatures
                      ? "rotate-180"
                      : "rotate-0"
                  }
                `}
              />
            </div>
          </button>

          {/* KEY FEATURES CONTENT */}
          {showKeyFeatures && (
            <div
              className="
                bg-gradient-to-b
                from-white
                to-teal-50/30
                px-4
                py-3
              "
            >
              <div
                className="
                  grid
                  grid-cols-1
                  gap-x-8
                  gap-y-2.5
                  sm:grid-cols-2
                "
              >
                {product.features.map((feature) => (
                  <div
                    key={feature}
                    className="
                      flex
                      items-start
                      gap-2.5
                    "
                  >
                    <CheckCircle2
                      className="
                        mt-0.5
                        h-4
                        w-4
                        shrink-0
                        text-emerald-500
                      "
                      strokeWidth={2.2}
                    />

                    <p
                      className="
                        text-xs
                        leading-5
                        text-gray-700
                        sm:text-sm
                        sm:leading-5
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
      )}
    </div>
  );
}