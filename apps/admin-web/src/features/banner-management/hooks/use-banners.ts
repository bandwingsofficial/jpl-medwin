"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Banner,
} from "@/features/banner-management/types/banner.types";

import {
  bannerService,
} from "@/features/banner-management/services/banner.service";

export function useBanners() {
  const [
    banners,
    setBanners,
  ] = useState<Banner[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  const loadBanners =
    useCallback(async () => {
      try {
        setIsLoading(true);

        setError(null);

        const response =
          await bannerService.getBanners();

        setBanners(
          response.data ?? []
        );
      } catch {
        setError(
          "Failed to load banners"
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  return {
    banners,

    isLoading,

    error,

    refresh:
      loadBanners,
  };
}