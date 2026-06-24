import { apiClient } from "@/infrastructure/api/axios-client";

import {
  Collection,
} from "../types/collection.types";

import {
  CollectionListResponse,
  CollectionSingleResponse,
  CollectionDetailsResponse,
  CollectionDeleteResponse,
} from "../types/collection-response.types";

import {
  CreateCollectionRequest,
  UpdateCollectionRequest,
  AssignProductRequest,
} from "../types/collection-request.types";

const BASE_URL = "/admin/collections";

export const collectionApi = {
  // ===================================
  // GET ALL COLLECTIONS
  // ===================================
  async getCollections(): Promise<Collection[]> {
    const response =
      await apiClient.get<CollectionListResponse>(
        BASE_URL
      );

    return response.data.data.data;
  },

  // ===================================
  // GET SINGLE COLLECTION
  // ===================================
  async getCollection(
    id: string
  ): Promise<CollectionDetailsResponse["data"]> {
    const response =
      await apiClient.get<CollectionDetailsResponse>(
        `${BASE_URL}/${id}`
      );

    return response.data.data;
  },

  // ===================================
  // CREATE COLLECTION
  // ===================================
  async createCollection(
    payload: CreateCollectionRequest
  ): Promise<Collection> {
    const formData = new FormData();

    formData.append("name", payload.name);

    if (payload.description) {
      formData.append(
        "description",
        payload.description
      );
    }

    if (payload.metaDescription) {
      formData.append(
        "metaDescription",
        payload.metaDescription
      );
    }

    if (payload.image) {
      formData.append(
        "image",
        payload.image
      );
    }

    const response =
      await apiClient.post<CollectionSingleResponse>(
        BASE_URL,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data.data;
  },

  // ===================================
  // UPDATE COLLECTION
  // ===================================
  async updateCollection(
    id: string,
    payload: UpdateCollectionRequest
  ): Promise<Collection> {
    const formData = new FormData();

    if (payload.name) {
      formData.append(
        "name",
        payload.name
      );
    }

    if (payload.description) {
      formData.append(
        "description",
        payload.description
      );
    }

    if (payload.metaDescription) {
      formData.append(
        "metaDescription",
        payload.metaDescription
      );
    }

    if (payload.image) {
      formData.append(
        "image",
        payload.image
      );
    }

    const response =
      await apiClient.patch<CollectionSingleResponse>(
        `${BASE_URL}/${id}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data.data;
  },

  // ===================================
  // ACTIVATE COLLECTION
  // ===================================
  async activateCollection(
    id: string
  ): Promise<Collection> {
    const response =
      await apiClient.patch<CollectionSingleResponse>(
        `${BASE_URL}/${id}/activate`
      );

    return response.data.data;
  },

  // ===================================
  // DEACTIVATE COLLECTION
  // ===================================
  async deactivateCollection(
    id: string
  ): Promise<Collection> {
    const response =
      await apiClient.patch<CollectionSingleResponse>(
        `${BASE_URL}/${id}/deactivate`
      );

    return response.data.data;
  },

  // ===================================
  // DELETE COLLECTION
  // ===================================
  async deleteCollection(
    id: string
  ): Promise<boolean> {
    const response =
      await apiClient.delete<CollectionDeleteResponse>(
        `${BASE_URL}/${id}`
      );

    return response.data.data.success;
  },

  // ===================================
  // RESTORE COLLECTION
  // ===================================
  async restoreCollection(
    id: string
  ): Promise<Collection> {
    const response =
      await apiClient.patch<CollectionSingleResponse>(
        `${BASE_URL}/${id}/restore`
      );

    return response.data.data;
  },

  // ===================================
  // ASSIGN PRODUCT
  // ===================================
  async assignProduct(
    collectionId: string,
    payload: AssignProductRequest
  ): Promise<void> {
    await apiClient.post(
      `${BASE_URL}/${collectionId}/products`,
      payload
    );
  },

  // ===================================
  // REMOVE PRODUCT
  // ===================================
  async removeProduct(
    collectionId: string,
    productId: string
  ): Promise<boolean> {
    const response =
      await apiClient.delete<CollectionDeleteResponse>(
        `${BASE_URL}/${collectionId}/products/${productId}`
      );

    return response.data.data.success;
  },
};