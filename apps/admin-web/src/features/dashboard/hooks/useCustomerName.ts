import { useQuery } from "@tanstack/react-query";

import { customerApi } from "@/features/customer-management/api/customer.api";

export const useCustomerName = (
  customerId: string
) => {
  return useQuery({
    queryKey: [
      "customer-name",
      customerId,
    ],

    queryFn: async () => {
      const response =
        await customerApi.getById(
          customerId
        );

      const customer =
        response?.data ?? response;

      return {
        name:
          customer?.profile?.name,
        phoneNumber:
          customer?.profile
            ?.phoneNumber,
      };
    },

    enabled: !!customerId,

    staleTime: 0,

    refetchInterval: 5000,
    refetchIntervalInBackground: true,

    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
};