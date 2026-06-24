"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { wishlistApi } from "../api/wishlist.api";

import { useAuth } from "@/features/auth/hooks/use-auth";

export const useWishlist = () => {
  const { isAuthenticated } =
    useAuth();

  const query = useQuery({
    queryKey: ["wishlist"],

    queryFn: () =>
      wishlistApi.getWishlist(),

    enabled: isAuthenticated,

    staleTime:
      1000 * 60 * 2,

    retry: 1,

    refetchOnWindowFocus:
      false,
  });

  const wishlistIds =
    useMemo(() => {
      const ids =
       query.data?.items
          ?.filter(
            (item) =>
              item?.id
          )
          .map(
            (item) =>
              item.id
          ) ?? [];


      return new Set(ids);
    }, [query.data]);

  return {
    ...query,

    wishlistIds,
  };
};