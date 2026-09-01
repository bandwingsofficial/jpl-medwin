"use client";

import { useQuery } from "@tanstack/react-query";

import { productApi } from "@/features/products/api/product.api";

export const useProductDetails = (
  productSlug: string
) => {
  return useQuery({
    queryKey: [
      "product-details",
      productSlug,
    ],

    queryFn: () =>
      productApi.getProductBySlug(
        productSlug
      ),

    enabled: !!productSlug,

    staleTime:
      1000 * 60 * 5,

    retry: 1,

    refetchOnWindowFocus: false,
  });
};