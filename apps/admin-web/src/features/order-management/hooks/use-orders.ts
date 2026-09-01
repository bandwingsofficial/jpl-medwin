"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  orderApi,
} from "../api/order.api";

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

interface UseOrdersParams {
  page?: number;

  limit?: number;

  search?: string;

  status?: string;

  paymentStatus?: string;

  from?: string;

  to?: string;

  dateType?: "created" | "updated";
}

/*
|--------------------------------------------------------------------------
| GET ORDERS
|--------------------------------------------------------------------------
*/

export const useOrders = (
  params?: UseOrdersParams
) => {
  const page =
    params?.page || 1;

  const limit =
    params?.limit || 10;

  const search =
    params?.search || "";

  const status =
    params?.status || "";

  const paymentStatus =
    params?.paymentStatus || "";

  const from =
    params?.from || "";

  const to =
    params?.to || "";

  const dateType =
    params?.dateType || "created";

  /*
  |--------------------------------------------------------------------------
  | GET ORDERS
  |--------------------------------------------------------------------------
  */

  const query = useQuery({
    queryKey: [
      "admin-orders",
      page,
      limit,
      search,
      status,
      paymentStatus,
      from,
      to,
      dateType,
    ],

    queryFn: async () => {
      const response =
        await orderApi.getOrders({
          page,
          limit,
          search,
          status,
          paymentStatus,
          from: from || undefined,
          to: to || undefined,
          dateType,
        });

      return response;
    },

    /*
    |--------------------------------------------------------------------------
    | QUERY CONFIG
    |--------------------------------------------------------------------------
    */

    staleTime: 0,

    gcTime:
      1000 * 60 * 30,

    retry: 1,

    refetchOnWindowFocus: false,

    refetchOnReconnect: true,

    refetchOnMount: true,

    /*
    |--------------------------------------------------------------------------
    | CHECK EVERY 10 SECONDS
    |--------------------------------------------------------------------------
    */

    refetchInterval: 10_000,

    refetchIntervalInBackground: true,
  });

  return query;
};
/*
|--------------------------------------------------------------------------
| ORDER DETAILS
|--------------------------------------------------------------------------
*/

export const useOrderDetails = (
  id: string
) => {
  return useQuery({
    queryKey: [
      "admin-order",
      id,
    ],

    queryFn: async () => {
      const response =
        await orderApi.getOrderDetails(
          id
        );

      return response;
    },

    enabled:
      !!id,

    staleTime:
      1000 * 60 * 5,

    gcTime:
      1000 * 60 * 30,

    retry: 1,

    refetchOnWindowFocus:
      false,

    refetchOnReconnect:
      false,

    refetchOnMount:
      false,
  });
};

/*
|--------------------------------------------------------------------------
| PROCESS ORDER
|--------------------------------------------------------------------------
*/

export const useProcessOrder =
  () => {
    const qc =
      useQueryClient();

    return useMutation({
      mutationFn: (
        id: string
      ) =>
        orderApi.processOrder(
          id
        ),

      onSuccess: (
        _data,
        id
      ) => {
        qc.invalidateQueries({
          queryKey: [
            "admin-orders",
          ],
        });

        qc.invalidateQueries({
          queryKey: [
            "admin-order",
            id,
          ],
        });
      },

      onError: (
        error
      ) => {
        console.error(
          "PROCESS ORDER ERROR",
          error
        );
      },
    });
  };

/*
|--------------------------------------------------------------------------
| SHIP ORDER
|--------------------------------------------------------------------------
*/

export const useShipOrder =
  () => {
    const qc =
      useQueryClient();

    return useMutation({
      mutationFn: ({
        id,
        trackingId,
        courierName,
      }: {
        id: string;

        trackingId: string;

        courierName: string;
      }) =>
        orderApi.shipOrder(
          id,
          {
            trackingId,
            courierName,
          }
        ),

      onSuccess: (
        _data,
        variables
      ) => {
        qc.invalidateQueries({
          queryKey: [
            "admin-orders",
          ],
        });

        qc.invalidateQueries({
          queryKey: [
            "admin-order",
            variables.id,
          ],
        });
      },

      onError: (
        error
      ) => {
        console.error(
          "SHIP ORDER ERROR",
          error
        );
      },
    });
  };

/*
|--------------------------------------------------------------------------
| DELIVER ORDER
|--------------------------------------------------------------------------
*/

export const useDeliverOrder =
  () => {
    const qc =
      useQueryClient();

    return useMutation({
      mutationFn: (
        id: string
      ) =>
        orderApi.deliverOrder(
          id
        ),

      onSuccess: (
        _data,
        id
      ) => {
        qc.invalidateQueries({
          queryKey: [
            "admin-orders",
          ],
        });

        qc.invalidateQueries({
          queryKey: [
            "admin-order",
            id,
          ],
        });
      },

      onError: (
        error
      ) => {
        console.error(
          "DELIVER ORDER ERROR",
          error
        );
      },
    });
  };

/*
|--------------------------------------------------------------------------
| REFUND ORDER
|--------------------------------------------------------------------------
*/

export const useRefundOrder =
  () => {
    const qc =
      useQueryClient();

    return useMutation({
      mutationFn: (
        id: string
      ) =>
        orderApi.refundOrder(
          id
        ),

      onSuccess: (
        _data,
        id
      ) => {
        qc.invalidateQueries({
          queryKey: [
            "admin-orders",
          ],
        });

        qc.invalidateQueries({
          queryKey: [
            "admin-order",
            id,
          ],
        });
      },

      onError: (
        error
      ) => {
        console.error(
          "REFUND ORDER ERROR",
          error
        );
      },
    });
  };