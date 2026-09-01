import { useQuery } from "@tanstack/react-query";

import { shippingConfigurationApi } from "@/features/order-management/api/shipping-configuration.api";

import {
  ActiveShippingConfigurationResponse,
} from "@/features/order-management/types/shipping-configuration.type";

const SHIPPING_CONFIGURATION_QUERY_KEY = [
  "shipping-configuration",
  "active",
] as const;

export function useShippingConfiguration() {
  const query = useQuery({
    queryKey: SHIPPING_CONFIGURATION_QUERY_KEY,
    queryFn: () => shippingConfigurationApi.getActive(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const shippingConfiguration: ActiveShippingConfigurationResponse | null =
    query.data?.success ? query.data : null;

  return {
    ...query,
    shippingConfiguration,
    hasActiveConfiguration: query.data?.success === true,
  };
}

export { SHIPPING_CONFIGURATION_QUERY_KEY };