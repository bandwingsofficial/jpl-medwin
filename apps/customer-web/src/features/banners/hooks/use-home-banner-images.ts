"use client";

import { useMemo } from "react";

import { useHomeBanners } from "./use-home-banners";

export function useHomeBannerImages() {
  const {
    data = [],
    isLoading,
    isError,
  } = useHomeBanners();

  const images = useMemo(() => {
    return data
      .flatMap(
        (banner) =>
          banner?.images ?? []
      )
      .filter(
        (image) =>
          image &&
          image.imageUrl
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