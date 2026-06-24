"use client";

import { useEffect, useState } from "react";
import { searchEverything } from "../api/global-search.api";
import { SearchResult } from "../types/global-search.types";
import { productApi } from "@/features/products/api/product.api";
export function useGlobalSearch(search: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

       const response =
  await searchEverything(search);

const productsResponse =
  await productApi.getProducts({
    search,
    limit: 10,
  });

const products =
  productsResponse.data.data.map(
    (product) => {
      const variant =
        product.variants.find(
          (item) =>
            item.id ===
            product.defaultVariantId
        ) ||
        product.variants[0];

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        type: "PRODUCT" as const,

        image:
          variant?.images?.main ||
          product.images?.main,
      };
    }
  );

const otherResults =
  response.data.results.filter(
    (item) =>
      item.type !== "PRODUCT"
  );

setResults([
  ...products,
  ...otherResults,
]);
      } catch (error) {
        console.error(error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return {
    results,
    loading,
  };
}