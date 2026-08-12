import {
  Product,
  ProductVariant,
} from "@/features/products/types/product.type";

import { Truck } from "lucide-react";

interface ProductCommercialDetailsProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
}

export function ProductCommercialDetails({
  product,
}: ProductCommercialDetailsProps) {
  // Calculate expected delivery date:
  // Today + 3 calendar days
  const expectedDeliveryDate = new Date();

  expectedDeliveryDate.setDate(
    expectedDeliveryDate.getDate() + 3
  );

  const formattedDeliveryDate =
    expectedDeliveryDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="w-full space-y-4">
      {/* DELIVERY INFO */}
      <div
        className="
          flex
          items-center
          gap-2.5
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
        <Truck className="h-5 w-5 shrink-0 text-blue-600" />

        <span>
          Delivery by {formattedDeliveryDate}
        </span>
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
    </div>
  );
}