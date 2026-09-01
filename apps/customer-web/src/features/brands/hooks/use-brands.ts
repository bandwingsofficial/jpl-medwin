"use client";

import { useQuery } from "@tanstack/react-query";
import { brandApi } from "../api/brand.api";

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => brandApi.getBrands(),
  });
}