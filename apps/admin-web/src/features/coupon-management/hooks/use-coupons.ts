"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { couponApi } from "@/features/coupon-management/api/coupon.api";

import {
  CreateCouponPayload,
  UpdateCouponPayload,
  ValidateCouponPayload,
} from "../types/coupon.type";

/**
 * GET ALL COUPONS
 */
export const useCoupons = () => {
  return useQuery({
    queryKey: ["coupons"],

    queryFn: async () => {
      try {
        return await couponApi.getCoupons();
      } catch (error) {
        console.error("Fetch coupons failed:", error);
        throw error;
      }
    },

    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/**
 * GET SINGLE COUPON
 */
export const useCoupon = (id: string) => {
  return useQuery({
    queryKey: ["coupon", id],

    queryFn: async () => {
      try {
        return await couponApi.getCoupon(id);
      } catch (error) {
        console.error("Fetch coupon failed:", error);
        throw error;
      }
    },

    enabled: !!id,

    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

/**
 * CREATE COUPON
 */
export const useCreateCoupon = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: CreateCouponPayload
    ) => {
      try {
        return await couponApi.createCoupon(payload);
      } catch (error) {
        console.error("Create coupon failed:", error);
        throw error;
      }
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["coupons"],
      });
    },
  });
};

/**
 * UPDATE COUPON
 */
export const useUpdateCoupon = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: UpdateCouponPayload
    ) => {
      try {
        return await couponApi.updateCoupon(payload);
      } catch (error) {
        console.error("Update coupon failed:", error);
        throw error;
      }
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["coupons"],
      });
    },
  });
};

/**
 * VALIDATE COUPON
 */
export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: async (
      payload: ValidateCouponPayload
    ) => {
      try {
        return await couponApi.validateCoupon(payload);
      } catch (error) {
        console.error("Validate coupon failed:", error);
        throw error;
      }
    },
  });
};

/**
 * ACTIVATE COUPON
 */
export const useActivateCoupon = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await couponApi.activateCoupon(id);
      } catch (error) {
        console.error("Activate coupon failed:", error);
        throw error;
      }
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["coupons"],
      });
    },
  });
};

/**
 * DEACTIVATE COUPON
 */
export const useDeactivateCoupon = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await couponApi.deactivateCoupon(id);
      } catch (error) {
        console.error("Deactivate coupon failed:", error);
        throw error;
      }
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["coupons"],
      });
    },
  });
};

/**
 * DELETE COUPON
 */
export const useDeleteCoupon = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await couponApi.deleteCoupon(id);
      } catch (error) {
        console.error("Delete coupon failed:", error);
        throw error;
      }
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["coupons"],
      });
    },
  });
};

/**
 * RESTORE COUPON
 */
export const useRestoreCoupon = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await couponApi.restoreCoupon(id);
      } catch (error) {
        console.error("Restore coupon failed:", error);
        throw error;
      }
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["coupons"],
      });
    },
  });
};