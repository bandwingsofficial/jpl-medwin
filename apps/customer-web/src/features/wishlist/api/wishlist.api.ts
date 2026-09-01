import { apiClient } from "@/infrastructure/api/axios-client";

import { API_ENDPOINTS } from "@/infrastructure/api/endpoints";

import {
  WishlistApiResponse,
  WishlistCountResponse,
} from "@/features/wishlist/types/wishlist.type";

export const wishlistApi = {
  async getWishlist(): Promise<WishlistApiResponse> {
    const response =
      await apiClient.get(
        API_ENDPOINTS.WISHLIST.GET
      );

    return response.data;
  },

  async getCount(): Promise<WishlistCountResponse> {
    const response =
      await apiClient.get(
        API_ENDPOINTS.WISHLIST.COUNT
      );

    return response.data;
  },

  async add(
    productId: string
  ) {
    const response =
      await apiClient.post(
        API_ENDPOINTS.WISHLIST.ADD,
        {
          productId,
        }
      );

    return response.data;
  },

  async remove(
    productId: string
  ) {
    const response =
      await apiClient.delete(
        API_ENDPOINTS.WISHLIST.REMOVE(
          productId
        )
      );

    return response.data;
  },
};