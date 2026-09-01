import { apiClient } from "@/infrastructure/api/axios-client";
import {
  CheckoutSessionDetail,
  CheckoutsResponse,
  GetCheckoutsParams,
} from "../types/checkout.type";

export const checkoutApi = {
  /*
  |--------------------------------------------------------------------------
  | GET ABANDONED CHECKOUTS (LIST)
  |--------------------------------------------------------------------------
  */
  getCheckouts: async (
    params?: GetCheckoutsParams
  ): Promise<CheckoutsResponse> => {
    const res = await apiClient.get("/admin/checkouts", {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        search: params?.search || "",
        status: params?.status || "",
        from: params?.from || undefined,
        to: params?.to || undefined,
        sortBy: params?.sortBy || undefined,
        sortOrder: params?.sortOrder || undefined,
      },
    });

    const data = Array.isArray(res.data?.data) ? res.data.data : [];
    const pagination = res.data?.pagination || {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    return {
      data,
      pagination,
    };
  },

  /*
  |--------------------------------------------------------------------------
  | GET ABANDONED CHECKOUT DETAILS
  |--------------------------------------------------------------------------
  */
  getCheckoutDetails: async (
    id: string
  ): Promise<CheckoutSessionDetail | null> => {
    if (!id) return null;

    const res = await apiClient.get(`/admin/checkouts/${id}`);
    const data = res.data?.data || res.data || null;

    return data;
  },
};
