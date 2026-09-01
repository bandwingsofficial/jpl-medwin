export interface ShippingConfiguration {
  id: string;
  shippingFee: number;
  freeShippingThreshold: number;
  overweightChargePerKg?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActiveShippingConfigurationResponse
  extends ShippingConfiguration {
  success: boolean;
  message: string;
}

export interface ShippingConfigurationNotFoundResponse {
  success: false;
  message: string;
  errorCode: string;
}

export type GetActiveShippingConfigurationResponse =
  | ActiveShippingConfigurationResponse
  | ShippingConfigurationNotFoundResponse;