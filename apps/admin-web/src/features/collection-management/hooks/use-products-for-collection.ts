"use client";

import { useQuery } from "@tanstack/react-query";

import { productApi } from "@/infrastructure/api/product.api";

export function useProductsForCollection() {
  return useQuery({
    queryKey: ["collection-products-selection"],

    queryFn: async () => {
      const response =
        await productApi.getAll();

      return Array.isArray(
        response?.data?.data
      )
        ? response.data.data
        : [];
    },
  });
}