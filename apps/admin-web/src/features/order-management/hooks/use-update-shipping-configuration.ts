import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateShippingConfigurationApi,
  UpdateShippingConfigurationRequest,
} from "@/features/order-management/api/update-shipping-configuration.api";

import {
  SHIPPING_CONFIGURATION_QUERY_KEY,
} from "@/features/order-management/hooks/use-shipping-configuration";

export function useUpdateShippingConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateShippingConfigurationRequest;
    }) =>
      updateShippingConfigurationApi.update(
        id,
        payload,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: SHIPPING_CONFIGURATION_QUERY_KEY,
      });
    },
  });
}