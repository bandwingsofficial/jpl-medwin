import { ProductVariant } from "@/features/products/types/product.type";

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string;
  onChange: (variantId: string) => void;
}

export function ProductVariantSelector({
  variants,
  selectedVariantId,
  onChange,
}: ProductVariantSelectorProps) {
  /*
   |--------------------------------------------------------------------------
   | EMPTY STATE
   |--------------------------------------------------------------------------
   */
  if (!variants?.length) {
    return null;
  }

  return (
    <div className="space-y-2.5">
      {/* TITLE */}
      <div>
        <h3 className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          Select Variants :
        </h3>
      </div>

      {/* HORIZONTAL CONTAINER (Scrollable, Scrollbars Hidden) */}
      <div 
        className="
          flex 
          gap-2 
          overflow-x-auto 
          px-1 py-1
          [-ms-overflow-style:none] 
          [scrollbar-width:none] 
          [&::-webkit-scrollbar]:hidden
        "
      >
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id;
          const isInStock = variant.stock?.inStock;
          const attributes = Object.entries(variant.attributes || {});

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onChange(variant.id)}
              disabled={!isInStock}
              className={`
                relative
                flex
                min-w-[130px]
                shrink-0
                flex-col
                justify-between
                rounded-xl
                border
                p-3
                text-left
                transition-all
                duration-150
                focus:outline-none

                ${
                  isSelected
                    ? "border-teal-600 bg-teal-50/40 ring-1 ring-teal-600"
                    : "border-gray-200 bg-white hover:border-gray-300 active:bg-gray-50"
                }

                ${
                  !isInStock
                    ? "cursor-not-allowed border-gray-100 bg-gray-50/50 opacity-40"
                    : ""
                }
              `}
            >
              {/* HEADER INFO */}
              <div className="w-full">
                <h4 className={`text-xs font-semibold tracking-tight text-gray-900 ${!isInStock && "line-through text-gray-400"}`}>
                  {variant.name}
                </h4>

                {/* ATTRIBUTES */}
                {!!attributes.length && (
                  <div className="mt-1 space-y-0.5">
                    {attributes.map(([key, value]) => (
                      <p key={`${key}-${value}`} className="text-[11px] text-gray-500 leading-none">
                        <span className="text-gray-400 capitalize">{key}:</span>{" "}
                        <span className="font-medium text-gray-700">{value}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* FOOTER INFO (PRICE & STOCK) */}
              <div className="mt-3.5 flex items-baseline justify-between w-full gap-2">
                <span className="text-xs font-bold text-gray-900">
                  ₹{variant.pricing.sellingPrice.toLocaleString()}
                </span>

                {!isInStock && (
                  <span className="text-[10px] font-medium tracking-wide text-red-500 uppercase">
                    Out
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}