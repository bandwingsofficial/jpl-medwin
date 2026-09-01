"use client";

import { useQuery } from "@tanstack/react-query";

import { collectionApi } from "../api/collection.api";

import { collectionQueryKeys } from "../constants/collection-query-keys";

export function useCollection(
  collectionId: string
) {
  return useQuery({
    queryKey:
      collectionQueryKeys.detail(
        collectionId
      ),

    queryFn: () =>
      collectionApi.getCollection(
        collectionId
      ),

    enabled: !!collectionId,
  });
}