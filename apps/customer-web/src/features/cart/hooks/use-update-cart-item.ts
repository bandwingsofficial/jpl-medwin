"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { cartApi } from "@/features/cart/api/cart.api";
import { localCartService } from "@/features/cart/hooks/local-cart.service";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { MAX_CART_ITEM_QUANTITY } from "@/features/bulk-order/constants/bulk-order.constants";
import { openBulkOrderModal } from "@/features/bulk-order/store/bulk-order-modal.store";
import { showWarning } from "@/shared/store/toast.store";

interface UpdateCartItemPayload {
  productId: string;
  variantId: string;
  quantity: number;

  /*
   * Real cart item ID returned by backend.
   *
   * This is required only for authenticated users.
   * Guest cart continues using productId + variantId.
   */
  cartItemId?: string;
}

export const useUpdateCartItem = () => {
  const queryClient =
    useQueryClient();

  const {
    isAuthenticated,
  } = useAuth();

  return useMutation({
    mutationFn: async ({
      productId,
      variantId,
      quantity,
      cartItemId,
    }: UpdateCartItemPayload) => {
      /*
       |--------------------------------------------------------------------------
       | CHECK BULK ORDER LIMIT (MAX = 5)
       |--------------------------------------------------------------------------
       */
      if (quantity > MAX_CART_ITEM_QUANTITY) {
        const cartData = queryClient.getQueryData<any>(["cart"]);
        const existingItem = cartData?.cartItems?.find(
          (item: any) =>
            (variantId && item.variantId === variantId) ||
            (!variantId && item.productId === productId),
        );

        openBulkOrderModal({
          productName: existingItem?.productName || "Medical Product",
          variantName: existingItem?.variant?.name,
          attributes: existingItem?.variant?.attributes,
          productId,
          variantId,
          sellingPrice: existingItem?.variant?.pricing?.sellingPrice,
          image: existingItem?.variant?.images?.main,
          productSlug: existingItem?.productSlug,
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
       */
      if (isAuthenticated) {
        let targetCartItemId = cartItemId;

        /*
         |--------------------------------------------------------------------------
         | AUTO-RESOLVE CART ITEM ID FROM CACHE IF NOT EXPLICITLY PROVIDED
         |--------------------------------------------------------------------------
         */
        if (!targetCartItemId) {
          const cartData = queryClient.getQueryData<any>(["cart"]);
          const foundItem = cartData?.cartItems?.find(
            (item: any) =>
              (variantId && item.variantId === variantId) ||
              (!variantId && item.productId === productId),
          );
          targetCartItemId = foundItem?.id;
        }

        /*
         |--------------------------------------------------------------------------
         | FALLBACK: FRESH FETCH IF NOT IN CACHE
         |--------------------------------------------------------------------------
         */
        if (!targetCartItemId) {
          try {
            const freshCart = await cartApi.getCart();
            const foundItem = freshCart?.cartItems?.find(
              (item: any) =>
                (variantId && item.variantId === variantId) ||
                (!variantId && item.productId === productId),
            );
            targetCartItemId = foundItem?.id;
          } catch {
            // Ignore fetch error, will throw below if unresolved
          }
        }

        if (!targetCartItemId) {
          throw new Error(
            "Cart item ID is required for authenticated cart.",
          );
        }

        return cartApi.updateItem(
          targetCartItemId,
          {
            quantity,
          },
        );
      }

      /*
       |--------------------------------------------------------------------------
       | GUEST USER
       |--------------------------------------------------------------------------
       */
      localCartService.updateQuantity(
        productId,
        variantId,
        quantity,
      );

      return true;
    },

    /*
     |--------------------------------------------------------------------------
     | SUCCESS
     |--------------------------------------------------------------------------
     */
    onSuccess: async (data: any) => {
      if (data && typeof data === "object" && Array.isArray(data.cartItems)) {
        queryClient.setQueryData(["cart"], data);
      }

      await queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },

    /*
     |--------------------------------------------------------------------------
     | ERROR
     |--------------------------------------------------------------------------
     */
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update cart item";
      console.error(
        "UPDATE CART ITEM ERROR:",
        errorMessage
      );
    },

    retry: false,
  });
};