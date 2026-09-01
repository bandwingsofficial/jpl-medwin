import axios from "axios";

import { apiClient } from "@/infrastructure/api/axios-client";

import { API_ENDPOINTS } from "@/infrastructure/api/endpoints";

import { CartResponse, CartSummary } from "@/features/cart/types/cart.type";

const CHECKOUT_SESSION_STORAGE_KEY =
  "checkout-session-id";

interface AddToCartPayload {
  productId: string;

  variantId: string;

  quantity: number;
}

interface UpdateCartPayload {
  quantity: number;
}

interface ApplyCouponPayload {
  couponCode: string;
}

/*
|--------------------------------------------------------------------------
| ENSURE EDITABLE CART
|--------------------------------------------------------------------------
|
| If checkout session exists and cart is LOCKED:
| - expire checkout session
| - unlock cart
| - clear stale session storage
|
|--------------------------------------------------------------------------
*/
const ensureEditableCart = async () => {
  try {
    const checkoutSessionId =
      typeof window !== "undefined"
        ? sessionStorage.getItem(CHECKOUT_SESSION_STORAGE_KEY)
        : null;

    if (!checkoutSessionId) {
      return;
    }

    console.warn(
      "CHECKOUT SESSION DETECTED → RECOVERING EDITABLE CART"
    );

    try {
      await apiClient.post(
        API_ENDPOINTS.CHECKOUT.EXPIRE_SESSION(checkoutSessionId)
      );
    } catch (expireError) {
      console.warn(
        "FAILED TO EXPIRE CHECKOUT SESSION",
        expireError
      );
    }

    try {
      await apiClient.post(API_ENDPOINTS.CART.UNLOCK);
    } catch (unlockError) {
      console.warn(
        "CART ALREADY UNLOCKED OR INVALID",
        unlockError
      );
    }

    sessionStorage.removeItem(CHECKOUT_SESSION_STORAGE_KEY);
  } catch (error) {
    console.error("ENSURE EDITABLE CART ERROR", error);
  }
};

/*
|--------------------------------------------------------------------------
| EXECUTE WITH LOCK RECOVERY
|--------------------------------------------------------------------------
|
| Safely executes cart mutation. If backend returns Cart is locked error,
| triggers existing backend unlock endpoint and retries once automatically.
|
|--------------------------------------------------------------------------
*/
async function executeWithLockRecovery<T>(fn: () => Promise<T>): Promise<T> {
  await ensureEditableCart();
  try {
    return await fn();
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || "";
    const errorCode =
      error?.response?.data?.errorCode || "";
    const isLocked =
      message.toLowerCase().includes("cart is locked") ||
      errorCode === "CART.LOCKED" ||
      errorCode === "CART_LOCKED";

    if (isLocked) {
      console.warn(
        "CART LOCKED ERROR ENCOUNTERED → RECOVERING WITH UNLOCK & RETRY"
      );
      try {
        await apiClient.post(API_ENDPOINTS.CART.UNLOCK);
        return await fn();
      } catch (retryError: any) {
        console.error(
          "CART RECOVERY RETRY FAILED:",
          retryError?.response?.data?.message || retryError?.message
        );
        throw retryError;
      }
    }
    throw error;
  }
}

export const cartApi = {
  /*
   |--------------------------------------------------------
   | GET CART
   |--------------------------------------------------------
   */
  async getCart(): Promise<CartResponse> {
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";
    if (!currentPath.startsWith("/checkout")) {
      await ensureEditableCart();
    }
    const response = await apiClient.get(API_ENDPOINTS.CART.GET);
    return response.data;
  },

  /*
   |--------------------------------------------------------
   | ADD ITEM
   |--------------------------------------------------------
   */
  async addItem(payload: AddToCartPayload): Promise<CartResponse> {
    return executeWithLockRecovery(async () => {
      const response = await apiClient.post(
        API_ENDPOINTS.CART.ADD_ITEM,
        payload
      );
      return response.data;
    });
  },

  /*
   |--------------------------------------------------------
   | UPDATE ITEM
   |--------------------------------------------------------
   */
  async updateItem(
    cartItemId: string,
    payload: UpdateCartPayload
  ): Promise<CartResponse> {
    return executeWithLockRecovery(async () => {
      const response = await apiClient.patch(
        API_ENDPOINTS.CART.UPDATE_ITEM(cartItemId),
        payload
      );
      return response.data;
    });
  },

  /*
   |--------------------------------------------------------
   | REMOVE ITEM
   |--------------------------------------------------------
   */
  async removeItem(cartItemId: string): Promise<CartResponse> {
    return executeWithLockRecovery(async () => {
      const response = await apiClient.delete(
        API_ENDPOINTS.CART.REMOVE_ITEM(cartItemId)
      );
      return response.data;
    });
  },

  /*
   |--------------------------------------------------------
   | CLEAR CART
   |--------------------------------------------------------
   */
  async clearCart(): Promise<CartResponse> {
    return executeWithLockRecovery(async () => {
      const response = await apiClient.delete(API_ENDPOINTS.CART.CLEAR);
      return response.data;
    });
  },

  /*
   |--------------------------------------------------------
   | APPLY COUPON
   |--------------------------------------------------------
   */
  async applyCoupon(
    payload: ApplyCouponPayload
  ): Promise<CartResponse> {
    return executeWithLockRecovery(async () => {
      const response = await apiClient.post(
        API_ENDPOINTS.CART.APPLY_COUPON,
        payload
      );
      return response.data;
    });
  },

  /*
   |--------------------------------------------------------
   | REMOVE COUPON
   |--------------------------------------------------------
   */
  async removeCoupon(): Promise<CartResponse> {
    return executeWithLockRecovery(async () => {
      const response = await apiClient.delete(
        API_ENDPOINTS.CART.REMOVE_COUPON
      );
      return response.data;
    });
  },

  /*
   |--------------------------------------------------------
   | LOCK CART
   |--------------------------------------------------------
   */
  async lockCart(): Promise<CartResponse> {
    const response = await apiClient.post(API_ENDPOINTS.CART.LOCK);
    return response.data;
  },

  /*
   |--------------------------------------------------------
   | UNLOCK CART
   |--------------------------------------------------------
   */
  async unlockCart(): Promise<CartResponse> {
    const response = await apiClient.post(API_ENDPOINTS.CART.UNLOCK);
    return response.data;
  },

  /*
   |--------------------------------------------------------
   | CALCULATE GUEST SUMMARY
   |--------------------------------------------------------
   */
  async calculateGuestSummary(
    items: Array<{
      productId: string;
      variantId?: string;
      quantity: number;
      price?: number;
      mrp?: number;
      isOverweight?: boolean;
      weightKg?: number | null;
    }>
  ): Promise<{ summary: CartSummary }> {
    const response = await apiClient.post(API_ENDPOINTS.CART.GUEST_SUMMARY, {
      items,
    });
    return response.data;
  },
};