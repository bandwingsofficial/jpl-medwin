import { CheckCircle2 } from "lucide-react";
import { Product, ProductVariant } from "@/features/products/types/product.type";

interface ProductCommercialDetailsProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
}

export function ProductCommercialDetails({
  product,
}: ProductCommercialDetailsProps) {
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