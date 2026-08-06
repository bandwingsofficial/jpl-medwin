import { apiClient } from "@/infrastructure/api/axios-client";

import {
  ShippingConfiguration,
} from "@/features/order-management/types/shipping-configuration.type";

export interface UpdateShippingConfigurationRequest {
  shippingFee?: number;
  freeShippingThreshold?: number;
  isActive?: boolean;
}

export interface UpdateShippingConfigurationResponse
  extends ShippingConfiguration {
  success: boolean;
  message: string;
}

const SHIPPING_CONFIGURATION_BASE_URL =
  "/admin/shipping-configurations";

export const updateShippingConfigurationApi = {
  async update(
    id: string,
    payload: UpdateShippingConfigurationRequest,
  ): Promise<UpdateShippingConfigurationResponse> {
    const response =
      await apiClient.patch<UpdateShippingConfigurationResponse>(
        `${SHIPPING_CONFIGURATION_BASE_URL}/${id}`,
        payload,
      );

    return response.data;
  },
};