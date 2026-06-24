"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { AxiosError } from "axios";

import { wishlistApi } from "../api/wishlist.api";

import {
  showError,
  showSuccess,
} from "@/shared/store/toast.store";

export const useAddToWishlist =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: (
        productId: string
      ) =>
        wishlistApi.add(
          productId
        ),

      onSuccess:
        async () => {
          showSuccess(
            "Added to wishlist"
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
            "Failed to add wishlist"
        );
      },

      retry: false,
    });
  };