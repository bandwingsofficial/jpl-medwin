// src/features/wishlist/hooks/use-remove-from-wishlist.ts

"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { AxiosError } from "axios";

import { wishlistApi } from "@/features/wishlist/api/wishlist.api";

import {
  showError,
  showSuccess,
} from "@/shared/store/toast.store";

export const useRemoveFromWishlist =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: (
        productId: string
      ) =>
        wishlistApi.remove(
          productId
        ),

      onSuccess:
        async () => {
          showSuccess(
            "Removed from wishlist"
          );

          await Promise.all([
            queryClient.invalidateQueries(
              {
                queryKey: [
                  "wishlist",
                ],
              }
            ),

            queryClient.invalidateQueries(
              {
                queryKey: [
                  "wishlist-count",
                ],
              }
            ),
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