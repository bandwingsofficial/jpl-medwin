import { apiClient } from "@/infrastructure/api/axios-client";

export const bannerApi = {
  getAll: async () => {
    const response =
      await apiClient.get(
        "/admin/banners"
      );

    return response.data;
  },

  getById: async (
    bannerId: string
  ) => {
    const response =
      await apiClient.get(
        `/admin/banners/${bannerId}`
      );

    return response.data;
  },

  create: async (
    formData: FormData
  ) => {
    const response =
      await apiClient.post(
        "/admin/banners",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  },

  update: async (
    bannerId: string,
    payload: {
      name: string;
      type: string;
    }
  ) => {
    const response =
      await apiClient.patch(
        `/admin/banners/${bannerId}`,
        payload
      );

    return response.data;
  },

  activate: async (
    bannerId: string
  ) => {
    const response =
      await apiClient.patch(
        `/admin/banners/${bannerId}/activate`
      );

    return response.data;
  },

  deactivate: async (
    bannerId: string
  ) => {
    const response =
      await apiClient.patch(
        `/admin/banners/${bannerId}/deactivate`
      );

    return response.data;
  },

  restore: async (
    bannerId: string
  ) => {
    const response =
      await apiClient.patch(
        `/admin/banners/${bannerId}/restore`
      );

    return response.data;
  },

  delete: async (
    bannerId: string
  ) => {
    const response =
      await apiClient.delete(
        `/admin/banners/${bannerId}`
      );

    return response.data;
  },

  addImage: async (
    bannerId: string,
    formData: FormData
  ) => {
    const response =
      await apiClient.post(
        `/admin/banners/${bannerId}/images`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  },

  updateImage: async (
    imageId: string,
    formData: FormData
  ) => {
    const response =
      await apiClient.patch(
        `/admin/banners/images/${imageId}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  },

  deleteImage: async (
    imageId: string
  ) => {
    const response =
      await apiClient.delete(
        `/admin/banners/images/${imageId}`
      );

    return response.data;
  },

  restoreImage: async (
    imageId: string
  ) => {
    const response =
      await apiClient.patch(
        `/admin/banners/images/${imageId}/restore`
      );

    return response.data;
  },
};