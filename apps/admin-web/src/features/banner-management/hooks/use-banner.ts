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

export function useBanner(
  bannerId: string
) {
  const [
    banner,
    setBanner,
  ] =
    useState<Banner | null>(
      null
    );

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

  const loadBanner =
    useCallback(async () => {
      if (!bannerId) {
        return;
      }

      try {
        setIsLoading(true);

        setError(null);

        const response =
          await bannerService.getBanner(
            bannerId
          );

        setBanner(
          response.data
        );
      } catch {
        setError(
          "Failed to load banner"
        );
      } finally {
        setIsLoading(false);
      }
    }, [bannerId]);

  useEffect(() => {
    loadBanner();
  }, [loadBanner]);

  return {
    banner,

    isLoading,

    error,

    refresh:
      loadBanner,
  };
}