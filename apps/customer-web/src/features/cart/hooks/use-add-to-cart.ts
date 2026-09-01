"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { AxiosError } from "axios";

import { cartApi } from "@/features/cart/api/cart.api";
import { localCartService } from "@/features/cart/hooks/local-cart.service";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { Product } from "@/features/products/types/product.type";
import { MAX_CART_ITEM_QUANTITY } from "@/features/bulk-order/constants/bulk-order.constants";
import { openBulkOrderModal } from "@/features/bulk-order/store/bulk-order-modal.store";
import { showWarning } from "@/shared/store/toast.store";

interface AddToCartPayload {
  productId: string;

  variantId: string;

  quantity: number;

  product?: Product;
}

export const useAddToCart = () => {
  /*
   |--------------------------------------------------------------------------
   | QUERY CLIENT
   |--------------------------------------------------------------------------
   */
  const queryClient =
    useQueryClient();

  const {
    isAuthenticated,
  } = useAuth();

  return useMutation({
    /*
     |--------------------------------------------------------------------------
     | MUTATION
     |--------------------------------------------------------------------------
     */
    mutationFn: async (
      payload: AddToCartPayload,
    ) => {
      /*
       |--------------------------------------------------------------------------
       | CHECK EXISTING CART QUANTITY FOR BULK ORDER LIMIT (MAX = 5)
       |--------------------------------------------------------------------------
       */
      const cartData = queryClient.getQueryData<any>(["cart"]);
      const existingItem = cartData?.cartItems?.find(
        (item: any) =>
          (payload.variantId && item.variantId === payload.variantId) ||
          (!payload.variantId && item.productId === payload.productId),
      );

      const currentQuantity = existingItem?.variant?.quantity ?? 0;

      if (currentQuantity + payload.quantity > MAX_CART_ITEM_QUANTITY) {
        const variantObj = payload.product?.variants?.find(
          (v) => v.id === payload.variantId,
        );

        openBulkOrderModal({
          productName: payload.product?.name || existingItem?.productName || "Medical Product",
          variantName: variantObj?.name || existingItem?.variant?.name,
          attributes: variantObj?.attributes || existingItem?.variant?.attributes,
          productId: payload.productId,
          variantId: payload.variantId,
          sellingPrice: variantObj?.pricing?.sellingPrice || existingItem?.variant?.pricing?.sellingPrice,
          image: variantObj?.images?.main || existingItem?.variant?.images?.main || payload.product?.images?.main,
          productSlug: payload.product?.slug || existingItem?.productSlug,
          requestedQuantity: 10,
        });

        showWarning(
          `You can order up to ${MAX_CART_ITEM_QUANTITY} units through the website. Need more? Place a bulk order through WhatsApp.`,
        );

        return false;
      }

      /*
       |--------------------------------------------------------------------------
       | AUTHENTICATED USER
       |--------------------------------------------------------------------------
       |
       | Logged-in users use the real backend cart.
       |
       */
      if (isAuthenticated) {
        return cartApi.addItem({
          productId:
            payload.productId,

          variantId:
            payload.variantId,

          quantity:
            payload.quantity,
        });
      }

      /*
       |--------------------------------------------------------------------------
       | GUEST USER
       |--------------------------------------------------------------------------
       |
       | Guest users use localStorage.
       |
       */
      if (!payload.product) {
        throw new Error(
          "Product is required for guest cart.",
        );
      }

      localCartService.addItem(
        payload.product,
        payload.variantId,
        payload.quantity,
      );

      return true;
    },

    /*
     |--------------------------------------------------------------------------
     | SUCCESS
     |--------------------------------------------------------------------------
     */
    onSuccess: async (data: any) => {
      /*
       |--------------------------------------------------------------------------
       | UPDATE CACHE IMMEDIATELY
       |--------------------------------------------------------------------------
       */
      if (data && typeof data === "object" && Array.isArray(data.cartItems)) {
        queryClient.setQueryData(["cart"], data);
      }

      /*
       |--------------------------------------------------------------------------
       | INVALIDATE CART & CHECKOUT SESSION
       |--------------------------------------------------------------------------
       */
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["checkout-session"],
      });
    },

    /*
     |--------------------------------------------------------------------------
     | ERROR
     |--------------------------------------------------------------------------
     */
    onError: (
      error: any,
    ) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add item to cart";
      console.error(
        "ADD TO CART ERROR:",
        errorMessage
      );
    },

    /*
     |--------------------------------------------------------------------------
     | RETRY
     |--------------------------------------------------------------------------
     */
    retry: false,
  });
};