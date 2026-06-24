import { apiClient } from "@/infrastructure/api/axios-client";

export const customerApi = {
  getAll: async (
    search?: string,
    page = 1,
    limit = 20
  ) => {
    const response =
      await apiClient.get(
        "/admin/customers",
        {
          params: {
            search,
            page,
            limit,
          },
        }
      );

    return response.data;
  },

  getById: async (
    customerId: string
  ) => {
    const response =
      await apiClient.get(
        `/admin/customers/${customerId}`
      );

    return response.data;
  },

  getAnalytics: async () => {
    const response =
      await apiClient.get(
        "/admin/customers/analytics"
      );

    return response.data;
  },

  deactivate: async (
    customerId: string
  ) => {
    const response =
      await apiClient.patch(
        `/admin/customers/${customerId}/deactivate`
      );

    return response.data;
  },
};