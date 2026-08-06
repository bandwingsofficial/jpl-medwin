import { Product, ProductVariant } from "@/features/products/types/product.type";
import { ProductActions } from "@/features/products/components/product-actions";

interface ProductBuyBoxProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
}

export function ProductBuyBox({ product, selectedVariant }: ProductBuyBoxProps) {
  const mrp = selectedVariant?.pricing?.mrp || product.price.max;
  const sellingPrice = selectedVariant?.pricing?.sellingPrice || product.price.min;
  const discountPercentage = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const isInStock = selectedVariant?.stock?.inStock || false;

  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-4
        shadow-sm
      "
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* LEFT: Price, Savings & Stock Badge */}
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                ₹ {sellingPrice.toLocaleString()}
              </span>
              {mrp > sellingPrice && (
                <span className="text-sm sm:text-base text-gray-400 line-through">
                  ₹ {mrp.toLocaleString()}
                </span>
              )}
            </div>

            {discountPercentage > 0 && (
              <span className="text-xs font-medium text-green-600 mt-0.5">
                {discountPercentage}% OFF (Save ₹ {(mrp - sellingPrice).toLocaleString()})
              </span>
            )}
          </div>

          {/* Stock Status Pill */}
          <div
            className={`
              sm:ml-4
              rounded-lg
              border
              px-2.5
              py-1
              text-xs
              font-semibold
              ${
                isInStock
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-500"
              }
            `}
          >
            {isInStock ? "In Stock" : "Out Of Stock"}
          </div>
        </div>

        {/* RIGHT: Actions (Add to Cart / Wishlist) */}
        <div className="w-full sm:w-auto flex-shrink-0">
          <ProductActions
            product={product}
            selectedVariant={selectedVariant}
          />
        </div>

      </div>
    </div>
  );
}