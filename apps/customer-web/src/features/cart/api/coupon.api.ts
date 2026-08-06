import { apiClient } from "@/infrastructure/api/axios-client";

import { API_ENDPOINTS } from "@/infrastructure/api/endpoints";

import {
  ApplyCouponPayload,
  ApplyCouponResponse,
  RemoveCouponResponse,
} from "../types/coupon.type";

/**
 * --------------------------------------------------------
 * COUPON API
 * --------------------------------------------------------
 */

export const couponApi = {
  /**
   * APPLY COUPON
   */
  async applyCoupon(
    payload: ApplyCouponPayload
  ): Promise<ApplyCouponResponse> {
    const response =
      await apiClient.post(
        API_ENDPOINTS.CART.APPLY_COUPON,
        payload
      );

    return response.data;
  },

  /**
   * REMOVE COUPON
   */
  async removeCoupon(): Promise<RemoveCouponResponse> {
    const response =
      await apiClient.delete(
        API_ENDPOINTS.CART.REMOVE_COUPON
      );

    return response.data;
  },
};