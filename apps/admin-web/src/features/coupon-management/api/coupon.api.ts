import { apiClient } from "@/infrastructure/api/axios-client";

import {
  Coupon,
  CreateCouponPayload,
  UpdateCouponPayload,
  ValidateCouponPayload,
  ValidateCouponResponse,
} from "@/features/coupon-management/types/coupon.type";

const BASE_URL = "/admin/coupons";

export const couponApi = {
  /**
   * GET ALL COUPONS
   */
  async getCoupons(): Promise<Coupon[]> {
    const res = await apiClient.get(BASE_URL);
    return res.data.data;
  },

  /**
   * GET SINGLE COUPON
   */
  async getCoupon(id: string): Promise<Coupon> {
    const res = await apiClient.get(`${BASE_URL}/${id}`);
    return res.data.data;
  },

  /**
   * CREATE COUPON
   */
  async createCoupon(
    payload: CreateCouponPayload
  ): Promise<Coupon> {
    const res = await apiClient.post(BASE_URL, payload);
    return res.data.data;
  },

  /**
   * UPDATE COUPON
   */
  async updateCoupon(
    payload: UpdateCouponPayload
  ): Promise<Coupon> {
    const { id, ...body } = payload;

    const res = await apiClient.patch(
      `${BASE_URL}/${id}`,
      body
    );

    return res.data.data;
  },

  /**
   * VALIDATE COUPON
   */
  async validateCoupon(
    payload: ValidateCouponPayload
  ): Promise<ValidateCouponResponse> {
    const res = await apiClient.post(
      `${BASE_URL}/validate`,
      payload
    );

    return res.data.data;
  },

  /**
   * ACTIVATE COUPON
   */
  async activateCoupon(id: string): Promise<Coupon> {
    const res = await apiClient.patch(
      `${BASE_URL}/${id}/activate`
    );

    return res.data.data;
  },

  /**
   * DEACTIVATE COUPON
   */
  async deactivateCoupon(id: string): Promise<Coupon> {
    const res = await apiClient.patch(
      `${BASE_URL}/${id}/deactivate`
    );

    return res.data.data;
  },

  /**
   * DELETE COUPON
   */
  async deleteCoupon(id: string): Promise<void> {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },

  /**
   * RESTORE COUPON
   */
  async restoreCoupon(id: string): Promise<Coupon> {
    const res = await apiClient.patch(
      `${BASE_URL}/${id}/restore`
    );

    return res.data.data;
  },
};