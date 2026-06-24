"use client";

import { useQuery } from "@tanstack/react-query";

import { bannerApi } from "../api/banner.api";

import { bannerQueryKeys } from "../constants/banner-query-keys";

import { BannerType } from "../types/banner.types";

export function useHomeBanners() {
  return useQuery({
    queryKey:
      bannerQueryKeys.type(
        BannerType.HOME_BANNER
      ),

    queryFn: () =>
      bannerApi.getHomeBanners(),

    staleTime: 1000 * 60 * 5,
  });
}