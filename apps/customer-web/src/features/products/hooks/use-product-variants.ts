"use client";

import { useQuery } from "@tanstack/react-query";

import { productApi } from "@/features/products/api/product.api";

export const useProductVariants = (
  productId: string
) => {
  return useQuery({
    queryKey: ["product-variants", productId],

    queryFn: () =>
      productApi.getProductVariants(productId),

    enabled: !!productId,

    staleTime: 1000 * 60 * 5,
  });
};