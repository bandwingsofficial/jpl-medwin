"use client";

import { useQuery } from "@tanstack/react-query";

import { wishlistApi } from "../api/wishlist.api";
import { localWishlistService } from "../hooks/local-wishlist.service";

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

      queryFn:
        async () => {
          if (
            isAuthenticated
          ) {
            return wishlistApi.getCount();
          }

          return {
            count:
              localWishlistService.getCount(),
          };
        },

      staleTime:
        1000 * 60 * 2,

      retry: 1,

      refetchOnWindowFocus:
        false,
    });
  };