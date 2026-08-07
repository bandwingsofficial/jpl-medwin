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
   | AUTO-CENTER / SCROLL SELECTED VARIANT ON CHANGE (VERTICAL)
   |--------------------------------------------------------------------------
   */
  useEffect(() => {
    const selectedElement = variantRefs.current[selectedVariantId];
    const container = scrollContainerRef.current;

    if (selectedElement && container) {
      const isScrollable = container.scrollHeight > container.clientHeight;
      if (!isScrollable) return;

      const containerHeight = container.offsetHeight;
      const elementTop = selectedElement.offsetTop;
      const elementHeight = selectedElement.offsetHeight;

      const scrollTo = elementTop - containerHeight / 2 + elementHeight / 2;

      container.scrollTo({
        top: scrollTo,
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
    <div className="space-y-2">
      {/* TITLE */}
      <div>
        <h3 className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          Select Variants :
        </h3>
      </div>

      {/* VERTICAL CONTAINER (Scrollable if too many variants, Scrollbars Hidden) */}
      <div
        ref={scrollContainerRef}
        className="
          flex 
          flex-col 
          gap-2 
          max-h-[320px]
          overflow-y-auto 
          pr-1 
          py-1
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

          // Calculate discount percentage if MRP and Selling Price exist
          const mrp = variant.pricing?.mrp || 0;
          const sellingPrice = variant.pricing?.sellingPrice || 0;
          const discountPercentage =
            mrp > sellingPrice
              ? Math.round(((mrp - sellingPrice) / mrp) * 100)
              : 0;

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
                w-full
                items-center
                justify-between
                rounded-lg
                border
                p-2.5
                text-left
                transition-all
                duration-200
                focus:outline-none

                ${
                  isSelected
                    ? "border-teal-600 bg-teal-50/40 ring-1 ring-teal-600/20 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300 active:bg-gray-50"
                }

                ${
                  !isInStock
                    ? "cursor-not-allowed border-gray-100 bg-gray-50/50 opacity-40"
                    : ""
                }
              `}
            >
              {/* LEFT SECTION: THUMBNAIL + DETAILS */}
              <div className="flex items-center space-x-2.5 overflow-hidden">
                {(variant.images?.main || variant.images?.gallery?.length) && (
                  <img
                    src={variant.images.main || variant.images.gallery[0]}
                    alt={variant.name}
                    className="h-10 w-10 shrink-0 rounded-md border border-gray-200 object-cover"
                  />
                )}

                <div className="overflow-hidden space-y-0.5">
                  <h4
                    className={`text-xs font-semibold tracking-tight text-gray-900 truncate ${
                      !isInStock && "line-through text-gray-400"
                    }`}
                  >
                    {variant.name}
                  </h4>

                  {/* ATTRIBUTES */}
                  {!!attributes.length && (
                    <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                      {attributes.map(([key, value]) => (
                        <span
                          key={`${key}-${value}`}
                          className="text-[11px] text-gray-500 leading-none"
                        >
                          <span className="text-gray-400 capitalize">{key}:</span>{" "}
                          <span className="font-medium text-gray-700">{value}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* WARRANTY & RATINGS SUB-LINE */}
                  <div className="flex items-center gap-2 pt-0.5">
                    {variant.warrantyMonths ? (
                      <span className="text-[10px] text-gray-500 font-medium">
                        {variant.warrantyMonths} Months Warranty
                      </span>
                    ) : null}

                    {variant.ratings?.average ? (
                      <span className="text-[10px] text-gray-600 font-medium flex items-center gap-0.5">
                        ⭐ {variant.ratings.average.toFixed(1)} ({variant.ratings.count || 0})
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* RIGHT SECTION: PRICE, MRP, DISCOUNT & STOCK STATUS */}
              <div className="flex shrink-0 flex-col items-end pl-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-bold text-gray-900">
                    ₹{sellingPrice.toLocaleString()}
                  </span>
                  {mrp > sellingPrice && (
                    <span className="text-[10px] text-gray-400 line-through">
                      ₹{mrp.toLocaleString()}
                    </span>
                  )}
                </div>

                {discountPercentage > 0 && (
                  <span className="text-[9px] font-bold text-emerald-600 mt-0.5">
                    {discountPercentage}% OFF
                  </span>
                )}

                {!isInStock && (
                  <span className="text-[10px] font-medium tracking-wide text-red-500 uppercase mt-0.5">
                    Out of Stock
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