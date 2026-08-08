import {
  CheckCircle2,
  ChevronDown,
  Truck,
} from "lucide-react";
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
    <div className="w-full space-y-5">
      {/* ========================================================== */}
      {/* DELIVERY INFO */}
      {/* ========================================================== */}

      <div
        className="
          flex
          items-center
          gap-3
          rounded-xl
          border
          border-teal-100
          bg-gradient-to-r
          from-teal-50
          via-white
          to-teal-50
          px-4
          py-3
          shadow-sm
        "
      >
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-teal-100
            text-teal-700
          "
        >
          <Truck
            size={18}
            strokeWidth={2}
          />
        </div>

        <div className="min-w-0">
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              text-teal-600
            "
          >
            Delivery Information
          </p>

          <p
            className="
              mt-0.5
              text-sm
              font-semibold
              text-gray-800
            "
          >
            Delivery within 3–7 business days
          </p>
        </div>
      </div>

      {/* ========================================================== */}
      {/* DESCRIPTION */}
      {/* ========================================================== */}

      {!!product.descriptions?.short && (
        <div
          className="
            rounded-xl
            border
            border-gray-100
            bg-white
            px-4
            py-3.5
            shadow-sm
          "
        >
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
        </div>
      )}

      {/* ========================================================== */}
      {/* FEATURES */}
      {/* ========================================================== */}

      {!!product.features?.length && (
        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >
          {/* ====================================================== */}
          {/* KEY FEATURES HEADER */}
          {/* ====================================================== */}

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
              gap-4
              bg-gradient-to-r
              from-gray-50
              via-white
              to-teal-50/40
              px-4
              py-3.5
              text-left
              transition-all
              duration-200
              hover:from-teal-50
              hover:to-white
              sm:px-5
              sm:py-4
            "
          >
            <div className="flex min-w-0 items-center gap-3">
              {/* FEATURE ICON */}
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-teal-100
                  text-teal-700
                "
              >
                <CheckCircle2
                  size={19}
                  strokeWidth={2}
                />
              </div>

              {/* TITLE */}
              <div className="min-w-0">
                <p
                  className="
                    text-sm
                    font-bold
                    text-gray-900
                    sm:text-base
                  "
                >
                  Key Features
                </p>

                <p
                  className="
                    mt-0.5
                    text-[10px]
                    font-medium
                    text-gray-500
                    sm:text-xs
                  "
                >
                  Product highlights & specifications
                </p>
              </div>
            </div>

            {/* ARROW */}
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-gray-200
                bg-white
                text-gray-500
                shadow-sm
                transition-all
                duration-200
              "
            >
              <ChevronDown
                size={17}
                className={`
                  transition-transform
                  duration-300
                  ${
                    showKeyFeatures
                      ? "rotate-180 text-teal-600"
                      : "rotate-0"
                  }
                `}
              />
            </div>
          </button>

          {/* ====================================================== */}
          {/* KEY FEATURES CONTENT */}
          {/* ====================================================== */}

          {showKeyFeatures && (
            <div
              className="
                border-t
                border-gray-100
                bg-gradient-to-b
                from-teal-50/30
                via-white
                to-gray-50/60
                p-3
                sm:p-4
              "
            >
              <div
                className="
                  grid
                  grid-cols-1
                  gap-2.5
                  sm:grid-cols-2
                  sm:gap-3
                "
              >
                {product.features.map((feature, index) => (
                  <div
                    key={feature}
                    className="
                      group
                      flex
                      items-start
                      gap-3
                      rounded-xl
                      border
                      border-gray-100
                      bg-white
                      px-3
                      py-3
                      shadow-[0_1px_3px_rgba(15,23,42,0.04)]
                      transition-all
                      duration-200
                      hover:border-teal-100
                      hover:bg-teal-50/40
                      hover:shadow-sm
                    "
                  >
                    {/* CHECK ICON */}
                    <div
                      className="
                        mt-0.5
                        flex
                        h-6
                        w-6
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-emerald-50
                        text-emerald-600
                        transition-colors
                        duration-200
                        group-hover:bg-emerald-100
                      "
                    >
                      <CheckCircle2
                        size={16}
                        strokeWidth={2.2}
                      />
                    </div>

                    {/* FEATURE TEXT */}
                    <p
                      className="
                        min-w-0
                        text-xs
                        font-medium
                        leading-5
                        text-gray-700
                        sm:text-sm
                        sm:leading-6
                      "
                    >
                      {feature}
                    </p>
                  </div>
                ))}
              </div>

              {/* FEATURE COUNT */}
              <div
                className="
                  mt-3
                  flex
                  items-center
                  justify-center
                  border-t
                  border-gray-100
                  pt-3
                "
              >
                <span
                  className="
                    rounded-full
                    bg-teal-50
                    px-3
                    py-1
                    text-[10px]
                    font-semibold
                    tracking-wide
                    text-teal-700
                    sm:text-xs
                  "
                >
                  {product.features.length} key features
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}