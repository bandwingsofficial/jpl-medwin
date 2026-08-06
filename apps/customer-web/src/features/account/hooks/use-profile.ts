"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProfile,
  getProfile,
  updateProfile,
} from "@/features/account/api/profile.api";

import {
  ProfileResponse,
  UpdateProfilePayload,
} from "@/features/account/types/profile.type";

// =========================================
// QUERY KEYS
// =========================================

export const PROFILE_QUERY_KEYS = {
  all: ["customer-profile"] as const,
};

// =========================================
// GET PROFILE
// =========================================

export function useProfile() {
  return useQuery<ProfileResponse | null>({
    queryKey: PROFILE_QUERY_KEYS.all,

    queryFn: getProfile,

    staleTime: 1000 * 60 * 5,

    gcTime: 1000 * 60 * 10,

    refetchOnWindowFocus: false,

    // ✅ ADDED
    refetchOnReconnect: false,

    // ✅ ADDED
    refetchOnMount: false,

    // ✅ IMPORTANT
    // DO NOT RETRY PROFILE NOT FOUND

    retry: false,
  });
}

// =========================================
// CREATE PROFILE
// =========================================

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation<
    ProfileResponse,
    any,
    UpdateProfilePayload
  >({
    // =========================================
    // MUTATION
    // =========================================

    mutationFn: async (
      payload
    ) => {
      try {
        return await createProfile(
          payload
        );
      } catch (error: any) {
        // ✅ CLEAN ERROR
        // PREVENT NEXT.JS OVERLAY

        throw (
          error?.response?.data ||
          error
        );
      }
    },

    // =========================================
    // SUCCESS
    // =========================================

    onSuccess: async (response) => {
      // ✅ UPDATE CACHE IMMEDIATELY

      queryClient.setQueryData(
        PROFILE_QUERY_KEYS.all,
        response
      );

      // ✅ ENSURE CONSISTENT CACHE

      await queryClient.invalidateQueries({
        queryKey:
          PROFILE_QUERY_KEYS.all,
      });
    },

    // =========================================
    // ERROR
    // =========================================

    onError: () => {
      // ✅ HANDLED LOCALLY
    },

    // =========================================
    // IMPORTANT
    // =========================================

    throwOnError: false,
  });
}

// =========================================
// UPDATE PROFILE
// =========================================

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<
    ProfileResponse,
    any,
    UpdateProfilePayload
  >({
    // =========================================
    // MUTATION
    // =========================================

    mutationFn: async (
      payload
    ) => {
      try {
        return await updateProfile(
          payload
        );
      } catch (error: any) {
        // ✅ CLEAN ERROR
        // PREVENT NEXT.JS OVERLAY

        throw (
          error?.response?.data ||
          error
        );
      }
    },

    // =========================================
    // SUCCESS
    // =========================================

    onSuccess: async (response) => {
      // ✅ UPDATE CACHE IMMEDIATELY

      queryClient.setQueryData(
        PROFILE_QUERY_KEYS.all,
        response
      );

      // ✅ ENSURE CONSISTENT CACHE

      await queryClient.invalidateQueries({
        queryKey:
          PROFILE_QUERY_KEYS.all,
      });
    },

    // =========================================
    // ERROR
    // =========================================

    onError: () => {
      // ✅ HANDLED LOCALLY
    },

    // =========================================
    // IMPORTANT
    // =========================================

    throwOnError: false,
  });
}