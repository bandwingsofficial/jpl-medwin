"use client";

import { useQuery } from "@tanstack/react-query";

import { collectionApi } from "../api/collection.api";

import { collectionQueryKeys } from "../constants/collection-query-keys";

export function useCollectionProducts(
  collectionId: string
) {
  return useQuery({
    queryKey:
      collectionQueryKeys.products(
        collectionId
      ),

    queryFn: () =>
      collectionApi.getCollectionProducts(
        collectionId
      ),
      

    enabled:
      !!collectionId,
  });
  
}