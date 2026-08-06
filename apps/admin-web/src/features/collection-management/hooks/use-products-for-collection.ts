"use client";

import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/infrastructure/api/product.api";

export function useProductsForCollection() {
  return useQuery({
    queryKey: ["collection-products-selection"],

    queryFn: async () => {
      const firstResponse = await productApi.getAll({
        page: 1,
        limit: 100,
      });

      console.log("FIRST RESPONSE", firstResponse);

      const firstProducts = firstResponse.data.data;

      const totalPages =
        firstResponse.data.pagination.totalPages;

      console.log("TOTAL PAGES:", totalPages);

      const allProducts = [...firstProducts];

      for (let page = 2; page <= totalPages; page++) {
        console.log("Fetching page:", page);

        const response = await productApi.getAll({
          page,
          limit: 100,
        });

        console.log(
          `Page ${page} products:`,
          response.data.data.length
        );

        allProducts.push(...response.data.data);
      }

      console.log("TOTAL PRODUCTS:", allProducts.length);

      return allProducts;
    },
  });
}