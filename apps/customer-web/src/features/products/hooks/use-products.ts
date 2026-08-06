"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { productApi } from "@/features/products/api/product.api";

interface UseProductsParams {
  limit?: number;

  search?: string;

  categoryId?: string;

  subCategoryId?: string;

  miniCategoryId?: string;

  brandId?: string;

  minPrice?: number;

  maxPrice?: number;

  inStock?: boolean;

  type?: "SIMPLE" | "VARIABLE";

  sortBy?: string;

  sortOrder?: "asc" | "desc";
}

export const useProducts = (
  params?: UseProductsParams
) => {
  return useInfiniteQuery({
queryKey: [
  "products",

  params?.search,

  params?.categoryId,
  params?.subCategoryId,
  params?.miniCategoryId,

  params?.brandId,

  params?.minPrice,
  params?.maxPrice,

  params?.inStock,

  params?.type,

  params?.sortBy,
  params?.sortOrder,

  params?.limit,
],


    initialPageParam: 1,

    queryFn: async ({
      pageParam = 1,
    }) => {
      return productApi.getProducts({
        ...params,
        page: Number(pageParam),
      });
    },

    getNextPageParam: (
      lastPage: any
    ) => {
      const pagination =
        lastPage?.data?.pagination;

      if (!pagination) {
        return undefined;
      }

      const currentPage =
        Number(
          pagination.page
        );

      const totalPages =
        Number(
          pagination.totalPages
        );

      if (
        currentPage >=
        totalPages
      ) {
        return undefined;
      }

      return currentPage + 1;
    },

    staleTime:
      1000 * 60 * 5,
  });
};