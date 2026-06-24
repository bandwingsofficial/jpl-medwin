"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CustomerDetail,
} from "@/features/customer-management/types/customer.types";

import {
  customerService,
} from "@/features/customer-management/services/customer.service";

export function useCustomer(
  customerId?: string
) {
  const [
    customer,
    setCustomer,
  ] =
    useState<CustomerDetail | null>(
      null
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  const loadCustomer =
    useCallback(async () => {
      if (!customerId) {
        return;
      }

      try {
        setIsLoading(true);

        setError(null);

        const response =
          await customerService.getCustomer(
            customerId
          );

        const customerData =
          response?.data ??
          response;

        setCustomer({
          id:
            customerData?.id ?? "",

          role:
            customerData?.role ??
            "",

          isActive:
            Boolean(
              customerData?.isActive
            ),

          tokenVersion:
            Number(
              customerData?.tokenVersion ??
                0
            ),

          profile:
            customerData?.profile ??
            null,

          identities:
            Array.isArray(
              customerData?.identities
            )
              ? customerData.identities
              : [],

          stats: {
            totalOrders:
              Number(
                customerData?.stats
                  ?.totalOrders ??
                  0
              ),

            totalSpent:
              Number(
                customerData?.stats
                  ?.totalSpent ??
                  0
              ),
          },

          createdAt:
            customerData?.createdAt ??
            "",

          updatedAt:
            customerData?.updatedAt ??
            "",
        });
      } catch (error) {
        console.error(
          "Customer detail error:",
          error
        );

        setCustomer(null);

        setError(
          "Failed to load customer"
        );
      } finally {
        setIsLoading(false);
      }
    }, [customerId]);

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

  return {
    customer,

    isLoading,

    error,

    refresh:
      loadCustomer,
  };
}