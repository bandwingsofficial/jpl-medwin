"use client";

import Image from "next/image";
import { useState } from "react";
import { PackageSearch } from "lucide-react";
import { 
  CheckoutSessionResponse, 
  CheckoutItem 
} from "@/features/checkout/types/checkout.type";

interface CheckoutItemsProps {
  checkout?: CheckoutSessionResponse | null;
}

// CRITICAL: Ensure this file actually exists in your /public folder
const PLACEHOLDER_IMAGE = "/product-placeholder.png"; 

const getImageUrl = (item: any) => {
  if (item.variant?.images?.main) return item.variant.images.main;
  if (item.productImage) return item.productImage;
  if (item.image) return item.image;
  return PLACEHOLDER_IMAGE;
};

export function CheckoutItems({ checkout }: CheckoutItemsProps) {
  const items: CheckoutItem[] = checkout?.items || [];

  if (!items.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 leading-tight">Order Items</h2>
          <p className="text-xs text-slate-500">Review products before payment</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 py-10 text-center">
          <PackageSearch size={24} className="text-slate-400" />
          <h3 className="mt-3 text-sm font-semibold text-slate-900">No items found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900 leading-tight">Order Items</h2>
        <p className="text-xs text-slate-500">Review your selection</p>
      </div>

      <div className="space-y-3">
        {items.map((item: any) => {
          const [imgSrc, setImgSrc] = useState(getImageUrl(item));
          
          const productName = item.productName || "Product";
          const variantName = item.variantName || item.variant?.name || "Default";
          const quantity = item.quantity || item.variant?.quantity || 0;
          const price = item.price || item.variant?.pricing?.sellingPrice || 0;
          const mrp = item.mrp || item.variant?.pricing?.mrp || 0;

          return (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border border-slate-100 p-2.5 transition-colors hover:bg-slate-50/50">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white">
                <Image
                  src={imgSrc}
                  alt={productName}
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                  // This handles broken URLs by switching to the placeholder
                  onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
                />
              </div>

              <div className="flex flex-1 items-center justify-between min-w-0">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-slate-900">{productName}</h3>
                  <div className="mt-0.5 flex items-center gap-2">
                    <p className="text-[11px] text-slate-500">{variantName}</p>
                    <span className="text-[10px] font-bold text-slate-400">|</span>
                    <p className="text-[11px] font-bold text-slate-700">Qty: {quantity}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-slate-900">₹{price.toLocaleString()}</p>
                  {mrp > price && (
                    <p className="text-[10px] text-slate-400 line-through">₹{mrp.toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}