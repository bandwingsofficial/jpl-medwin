"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Customer,
} from "@/features/customer-management/types/customer.types";

import {
  customerService,
} from "@/features/customer-management/services/customer.service";

interface UseCustomersParams {
  search?: string;

  page?: number;

  limit?: number;
}

export function useCustomers({
  search,
  page = 1,
  limit = 20,
}: UseCustomersParams) {
  const [
    customers,
    setCustomers,
  ] = useState<Customer[]>([]);

  const [
    total,
    setTotal,
  ] = useState(0);

  const [
    totalPages,
    setTotalPages,
  ] = useState(0);

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

  const loadCustomers =
    useCallback(async () => {
      try {
        setIsLoading(true);

        setError(null);

        const response =
          await customerService.getCustomers(
            search,
            page,
            limit
          );

        const payload =
          response?.data ??
          response;

        setCustomers(
          Array.isArray(
            payload?.customers
          )
            ? payload.customers
            : []
        );

        setTotal(
          Number(
            payload?.total ?? 0
          )
        );

        setTotalPages(
          Number(
            payload?.totalPages ?? 0
          )
        );
      } catch (error) {
        console.error(
          "Customer load error:",
          error
        );

        setCustomers([]);

        setTotal(0);

        setTotalPages(0);

        setError(
          "Failed to load customers"
        );
      } finally {
        setIsLoading(false);
      }
    }, [
      search,
      page,
      limit,
    ]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  return {
    customers,

    total,

    totalPages,

    isLoading,

    error,

    refresh:
      loadCustomers,
  };
}