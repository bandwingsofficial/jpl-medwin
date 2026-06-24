"use client";

import { useQuery } from "@tanstack/react-query";

import { collectionApi } from "../api/collection.api";

import { collectionQueryKeys } from "../constants/collection-query-keys";

export function useCollections() {
  return useQuery({
    queryKey:
      collectionQueryKeys.list(),

    queryFn: () =>
      collectionApi.getCollections(),

    staleTime: 1000 * 60 * 5,
  });
}