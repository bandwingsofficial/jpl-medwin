"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
  returnsApi,
} from "../api/returns.api";

/*
|--------------------------------------------------------------------------
| GET RETURNS
|--------------------------------------------------------------------------
*/
export const useReturns = (
  page = 1,
  limit = 10
) => {
  return useQuery({
    queryKey: [
      "admin-returns",
      page,
      limit,
    ],
    queryFn: () =>
      returnsApi.getReturns({
        page,
        limit,
      }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

/*
|--------------------------------------------------------------------------
| GET RETURN DETAILS
|--------------------------------------------------------------------------
*/
export const useReturnDetails =
  (id: string) => {
    return useQuery({
      queryKey: [
        "admin-return",
        id,
      ],
      queryFn: () =>
        returnsApi.getReturnDetails(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    });
  };

/*
|--------------------------------------------------------------------------
| APPROVE
|--------------------------------------------------------------------------
*/
export const useApproveReturn = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => returnsApi.approveReturn(id),
    onSuccess: (data, id) => {
      toast.success("Return approved successfully");

      // 1. Refreshes the list table view
      qc.invalidateQueries({
        queryKey: ["admin-returns"],
      });
      
      // 2. Refreshes the drawer data automatically
      qc.invalidateQueries({
        queryKey: ["admin-return", id],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to approve return"
      );
    },
  });
};

/*
|--------------------------------------------------------------------------
| REJECT
|--------------------------------------------------------------------------
*/
export const useRejectReturn = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => returnsApi.rejectReturn(id),
    onSuccess: (data, id) => {
      toast.success("Return rejected successfully");

      qc.invalidateQueries({
        queryKey: ["admin-returns"],
      });

      qc.invalidateQueries({
        queryKey: ["admin-return", id],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to reject return"
      );
    },
  });
};

/*
|--------------------------------------------------------------------------
| PICKUP
|--------------------------------------------------------------------------
*/
export const usePickupReturn = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => returnsApi.pickupReturn(id),
    onSuccess: (data, id) => {
      toast.success("Return picked up successfully");

      qc.invalidateQueries({
        queryKey: ["admin-returns"],
      });

      qc.invalidateQueries({
        queryKey: ["admin-return", id],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to pickup return"
      );
    },
  });
};

/*
|--------------------------------------------------------------------------
| COMPLETE
|--------------------------------------------------------------------------
*/
export const useCompleteReturn = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => returnsApi.completeReturn(id),
    onSuccess: (data, id) => {
      toast.success("Return completed successfully");

      qc.invalidateQueries({
        queryKey: ["admin-returns"],
      });

      qc.invalidateQueries({
        queryKey: ["admin-return", id],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to complete return"
      );
    },
  });
};