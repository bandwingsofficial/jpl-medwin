import {
  Product,
  ProductVariant,
} from "@/features/products/types/product.type";

interface ProductCommercialDetailsProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
}

export function ProductCommercialDetails({
  product,
}: ProductCommercialDetailsProps) {
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
    </div>
  );
}