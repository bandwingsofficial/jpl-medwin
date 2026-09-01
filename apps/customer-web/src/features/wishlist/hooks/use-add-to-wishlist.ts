"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { AxiosError } from "axios";

import { wishlistApi } from "../api/wishlist.api";
import { localWishlistService } from "../hooks/local-wishlist.service";

import { Product } from "@/features/products/types/product.type";

import { useAuth } from "@/features/auth/hooks/use-auth";

import {
  showError,
  showSuccess,
} from "@/shared/store/toast.store";

export const useAddToWishlist = () => {
  const queryClient =
    useQueryClient();

  const {
    isAuthenticated,
  } = useAuth();

  return useMutation<
    unknown,
    AxiosError<any>,
    Product
  >({
    mutationFn: async (
      product
    ) => {
      if (isAuthenticated) {
        return wishlistApi.add(
          product.id
        );
      }

      // Save the complete Product object for guest wishlist
      localWishlistService.add(
        product
      );

      return true;
    },

    onSuccess: async () => {
      showSuccess(
        "Added to wishlist"
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            "wishlist",
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "wishlist-count",
          ],
        }),
      ]);
    },

  onError: async (error) => {
  const message =
    error.response?.data?.message ??
    "Failed to add wishlist";

  // Refresh wishlist even when backend says
  // the product already exists.
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ["wishlist"],
    }),

    queryClient.invalidateQueries({
      queryKey: ["wishlist-count"],
    }),
  ]);

  const alreadyExists =
    message.toLowerCase().includes("already exists") ||
    message.toLowerCase().includes("already exist");

  // Don't show an error for an already-wishlisted product.
  if (alreadyExists) {
    return;
  }

  showError(message);
},

    retry: false,
  });
};