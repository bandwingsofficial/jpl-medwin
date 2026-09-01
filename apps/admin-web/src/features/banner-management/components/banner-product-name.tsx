"use client";

import {
  useProductById,
} from "@/features/product-management/hooks/use-product";

// =========================================
// TYPES
// =========================================

interface BannerProductNameProps {
  productId?: string;
}

// =========================================
// COMPONENT
// =========================================

export function BannerProductName({
  productId,
}: BannerProductNameProps) {
  const productQuery =
    useProductById(productId);

  if (!productId) {
    return (
      <span className="text-gray-400">
        Product not available
      </span>
    );
  }

  if (productQuery.isLoading) {
    return (
      <span className="text-gray-400">
        Loading...
      </span>
    );
  }

  if (productQuery.isError) {
    return (
      <span className="text-gray-400">
        Product not found
      </span>
    );
  }

  const product =
    productQuery.data?.data;

  return (
    <span
      className="
        block
        truncate
        text-sm
        font-semibold
        text-gray-900
      "
      title={product?.name || "Product not found"}
    >
      {product?.name ||
        "Product not found"}
    </span>
  );
}