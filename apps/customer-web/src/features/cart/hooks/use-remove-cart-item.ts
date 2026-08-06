"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { cartApi } from "@/features/cart/api/cart.api";

export const useRemoveCartItem =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: (
        cartItemId: string
      ) =>
        cartApi.removeItem(
          cartItemId
        ),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["cart"],
        });
      },
    });
  };