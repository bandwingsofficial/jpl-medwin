"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { bannerApi } from "../api/banner.api";

import { bannerQueryKeys } from "../constants/banner-query-keys";

import { BannerType } from "../types/banner.types";

export function useSubCategoryBannerImages() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey:
      bannerQueryKeys.type(
        BannerType.SUB_CATEGORY_BANNER
      ),

    queryFn: async () => {
      return bannerApi.getBannersByType(
        BannerType.SUB_CATEGORY_BANNER
      );
    },

    staleTime:
      1000 * 60 * 5,
  });

  const images = useMemo(() => {
    return data
      .flatMap(
        (banner) =>
          banner.images ?? []
      )
      .filter(
        (image) =>
          image?.imageUrl
      )
      .sort(
        (a, b) =>
          a.sortOrder -
          b.sortOrder
      );
  }, [data]);

  return {
    images,
    isLoading,
    isError,
  };
}