"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { AxiosError } from "axios";

import { wishlistApi } from "@/features/wishlist/api/wishlist.api";
import { localWishlistService } from "@/features/wishlist/hooks/local-wishlist.service";

import { useAuth } from "@/features/auth/hooks/use-auth";

import {
  showError,
  showSuccess,
} from "@/shared/store/toast.store";

export const useRemoveFromWishlist =
  () => {
    const queryClient =
      useQueryClient();

    const {
      isAuthenticated,
    } = useAuth();

    return useMutation({
      mutationFn: async (
        productId: string
      ) => {
        if (
          isAuthenticated
        ) {
          return wishlistApi.remove(
            productId
          );
        }

        localWishlistService.remove(
          productId
        );

        return true;
      },

      onSuccess: async () => {
  showSuccess("Removed from wishlist");

  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ["wishlist", isAuthenticated],
    }),

    queryClient.invalidateQueries({
      queryKey: ["wishlist-count"],
    }),
  ]);
},
      onError: (
        error:
          AxiosError<any>
      ) => {
        showError(
          error.response?.data
            ?.message ??
            "Failed to remove from wishlist"
        );
      },

      retry: false,
    });
  };