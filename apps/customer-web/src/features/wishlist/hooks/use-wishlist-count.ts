"use client";

import { useQuery } from "@tanstack/react-query";

import { wishlistApi } from "../api/wishlist.api";

import { useAuth } from "@/features/auth/hooks/use-auth";

export const useWishlistCount =
  () => {
    const {
      isAuthenticated,
    } = useAuth();

    return useQuery({
      queryKey: [
        "wishlist-count",
      ],

      queryFn: () =>
        wishlistApi.getCount(),

      enabled:
        isAuthenticated,

      staleTime:
        1000 * 60 * 2,

      retry: 1,

      refetchOnWindowFocus:
        false,
    });
  };