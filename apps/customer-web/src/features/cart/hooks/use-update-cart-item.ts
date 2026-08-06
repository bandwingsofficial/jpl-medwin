"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { cartApi } from "@/features/cart/api/cart.api";

export const useUpdateCartItem =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: ({
        cartItemId,
        quantity,
      }: {
        cartItemId: string;

        quantity: number;
      }) =>
        cartApi.updateItem(
          cartItemId,
          {
            quantity,
          }
        ),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["cart"],
        });
      },
    });
  };