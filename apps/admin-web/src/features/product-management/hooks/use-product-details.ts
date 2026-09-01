"use client";

import { useQuery } from "@tanstack/react-query";

import { productApi } from "@/infrastructure/api/product.api";

import type { Product } from "@/features/product-management/types/product.type";

// =========================================
// TYPES
// =========================================

interface UseProductDetailsParams {
  productId: string;
}

// =========================================
// HOOK
// =========================================

export function useProductDetails({
  productId,
}: UseProductDetailsParams) {
  const productDetailsQuery = useQuery({
    queryKey: [
      "product-details",
      productId,
    ],

    queryFn: () =>
      productApi.getById(productId),

    enabled: Boolean(productId),

    staleTime: 0,

    gcTime: 1000 * 60 * 10,

    refetchOnMount: true,

    refetchOnWindowFocus: true,

    refetchOnReconnect: true,
  });

  return {
    productDetailsQuery,
  };
}