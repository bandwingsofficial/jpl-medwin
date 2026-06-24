import { apiClient } from "@/infrastructure/api/axios-client";

import {
  ReturnRequest,
  ReturnsResponse,
} from "../types/return.type";

export interface GetReturnsParams {
  page?: number;

  limit?: number;
}

export const returnsApi = {
  /*
  |--------------------------------------------------------------------------
  | GET RETURNS
  |--------------------------------------------------------------------------
  */

  getReturns: async (
    params?: GetReturnsParams
  ): Promise<ReturnsResponse> => {
    const res =
      await apiClient.get(
        "/admin/returns",
        {
          params: {
            page:
              params?.page || 1,

            limit:
              params?.limit || 10,
          },
        }
      );

    return {
      returns:
        res.data?.data || [],

      pagination:
        res.data?.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        },
    };
  },

  /*
  |--------------------------------------------------------------------------
  | GET RETURN DETAILS
  |--------------------------------------------------------------------------
  */

  getReturnDetails: async (
    id: string
  ): Promise<ReturnRequest | null> => {
    const res =
      await apiClient.get(
        `/admin/returns/${id}`
      );

    return res.data ?? null;
  },

  /*
  |--------------------------------------------------------------------------
  | APPROVE RETURN
  |--------------------------------------------------------------------------
  */

  approveReturn: async (
    id: string
  ) => {
    const res =
      await apiClient.post(
        `/admin/returns/${id}/approve`
      );

    return res.data;
  },

  /*
  |--------------------------------------------------------------------------
  | REJECT RETURN
  |--------------------------------------------------------------------------
  */

  rejectReturn: async (
    id: string
  ) => {
    const res =
      await apiClient.post(
        `/admin/returns/${id}/reject`
      );

    return res.data;
  },

  /*
  |--------------------------------------------------------------------------
  | PICKUP RETURN
  |--------------------------------------------------------------------------
  */

  pickupReturn: async (
    id: string
  ) => {
    const res =
      await apiClient.post(
        `/admin/returns/${id}/pickup`
      );

    return res.data;
  },

  /*
  |--------------------------------------------------------------------------
  | COMPLETE RETURN
  |--------------------------------------------------------------------------
  */

  completeReturn: async (
    id: string
  ) => {
    const res =
      await apiClient.post(
        `/admin/returns/${id}/complete`
      );

    return res.data;
  },
};