import { apiClient } from "@/infrastructure/api/axios-client";

import {
  GetActiveShippingConfigurationResponse,
} from "@/features/order-management/types/shipping-configuration.type";

const SHIPPING_CONFIGURATION_BASE_URL =
  "/admin/shipping-configurations";

export const shippingConfigurationApi = {
  async getActive(): Promise<GetActiveShippingConfigurationResponse> {
    const response =
      await apiClient.get<GetActiveShippingConfigurationResponse>(
        `${SHIPPING_CONFIGURATION_BASE_URL}/active`,
      );

    return response.data;
  },
};