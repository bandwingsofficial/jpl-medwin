"use client";

import {
  ProductBanner,
} from "./product-banner";

interface ProductBannerGridInsertProps {
  index: number;
}

export function ProductBannerGridInsert({
  index,
}: ProductBannerGridInsertProps) {
  return (
    <div
      className="
        col-span-full
      "
    >
      <ProductBanner
        bannerIndex={index}
      />
    </div>
  );
}