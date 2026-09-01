import { apiClient } from "@/infrastructure/api/axios-client";

import {
  CollectionListResponse,
  CollectionDetailResponse,
} from "../types/collection-response.types";

import { Collection } from "../types/collection.types";

const BASE_URL = "/collections";

export const collectionApi = {
  async getCollections(): Promise<Collection[]> {
    const response =
      await apiClient.get<CollectionListResponse>(
        BASE_URL
      );

    return Array.isArray(
      response.data?.data?.data
    )
      ? response.data.data.data
      : [];
  },

  async getCollection(
    slug: string
  ): Promise<CollectionDetailResponse> {
    const response =
      await apiClient.get(
        `${BASE_URL}/${slug}`
      );

    return response.data.data;
  },

  async getCollectionProducts(
    slug: string
  ) {
    const response =
      await apiClient.get(
        `${BASE_URL}/${slug}`
      );

    return (
      response.data?.data?.products ??
      []
    );
  },
};