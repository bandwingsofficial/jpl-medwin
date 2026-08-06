"use client";

import React, { useRef, useEffect } from "react";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const variantRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  /*
   |--------------------------------------------------------------------------
   | AUTO-CENTER SELECTED VARIANT ON CHANGE (ONLY IF SCROLLABLE)
   |--------------------------------------------------------------------------
   */
  useEffect(() => {
    const selectedElement = variantRefs.current[selectedVariantId];
    const container = scrollContainerRef.current;

    if (selectedElement && container) {
      // Check if container is actually overflowing/scrollable
      const isScrollable = container.scrollWidth > container.clientWidth;
      if (!isScrollable) return;

      const containerWidth = container.offsetWidth;
      const elementLeft = selectedElement.offsetLeft;
      const elementWidth = selectedElement.offsetWidth;

      const scrollTo = elementLeft - containerWidth / 2 + elementWidth / 2;

      container.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  }, [selectedVariantId]);

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
        ref={scrollContainerRef}
        className="
          flex 
          gap-2.5 
          overflow-x-auto 
          px-1 
          py-1.5
          scroll-smooth
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
              ref={(el) => {
                variantRefs.current[variant.id] = el;
              }}
              type="button"
              onClick={() => onChange(variant.id)}
              disabled={!isInStock}
              className={`
                relative
                flex
                min-w-[145px]
                max-w-[200px]
                shrink-0
                flex-col
                justify-between
                rounded-xl
                border
                p-3
                text-left
                transition-all
                duration-200
                focus:outline-none

                ${
                  isSelected
                    ? "border-teal-600 bg-teal-50/40 ring-2 ring-teal-600/20 shadow-sm"
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
                <h4
                  className={`text-xs font-semibold tracking-tight text-gray-900 line-clamp-2 ${
                    !isInStock && "line-through text-gray-400"
                  }`}
                >
                  {variant.name}
                </h4>

                {/* ATTRIBUTES */}
                {!!attributes.length && (
                  <div className="mt-1 space-y-0.5">
                    {attributes.map(([key, value]) => (
                      <p
                        key={`${key}-${value}`}
                        className="text-[11px] text-gray-500 leading-none truncate"
                      >
                        <span className="text-gray-400 capitalize">{key}:</span>{" "}
                        <span className="font-medium text-gray-700">{value}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* FOOTER INFO (PRICE & STOCK) */}
              <div className="mt-3 flex items-baseline justify-between w-full gap-2">
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