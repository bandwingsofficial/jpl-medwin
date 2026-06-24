"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CustomerAnalytics,
} from "@/features/customer-management/types/customer.types";

import {
  customerService,
} from "@/features/customer-management/services/customer.service";

export function useCustomerAnalytics() {
  const [
    analytics,
    setAnalytics,
  ] = useState<CustomerAnalytics | null>(
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

  const loadAnalytics =
    useCallback(async () => {
      try {
        setIsLoading(true);

        setError(null);

        const response =
          await customerService.getAnalytics();

        const analyticsData =
          response?.data ??
          response;

        setAnalytics({
          totalCustomers:
            Number(
              analyticsData?.totalCustomers ??
                0
            ),

          activeCustomers:
            Number(
              analyticsData?.activeCustomers ??
                0
            ),

          inactiveCustomers:
            Number(
              analyticsData?.inactiveCustomers ??
                0
            ),

          totalRevenue:
            Number(
              analyticsData?.totalRevenue ??
                0
            ),

          averageOrderValue:
            Number(
              analyticsData?.averageOrderValue ??
                0
            ),
        });
      } catch (error) {
        console.error(
          "Customer analytics error:",
          error
        );

        setError(
          "Failed to load analytics"
        );

        setAnalytics({
          totalCustomers: 0,
          activeCustomers: 0,
          inactiveCustomers: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
        });
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return {
    analytics,

    isLoading,

    error,

    refresh:
      loadAnalytics,
  };
}