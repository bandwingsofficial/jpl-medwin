"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { brandApi } from "@/infrastructure/api/brand.api";
import {
  Brand,
  CreateBrandPayload,
  UpdateBrandPayload,
} from "../types/brand.type";

/**
 * 🔹 GET ALL BRANDS
 */
export const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      try {
        return await brandApi.getBrands();
      } catch (error) {
        console.error("Fetch brands failed:", error);
        throw error; // 🔥 important for React Query
      }
    },

    // ✅ Production configs
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/**
 * 🔹 CREATE BRAND
 */
export const useCreateBrand = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBrandPayload) => {
      try {
        return await brandApi.createBrand(payload);
      } catch (error) {
        console.error("Create brand failed:", error);
        throw error;
      }
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brands"] });
    },
  });
};

/**
 * 🔹 UPDATE BRAND
 */
export const useUpdateBrand = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateBrandPayload) => {
      try {
        return await brandApi.updateBrand(payload);
      } catch (error) {
        console.error("Update brand failed:", error);
        throw error;
      }
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brands"] });
    },
  });
};

/**
 * 🔹 DELETE BRAND
 */
export const useDeleteBrand = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await brandApi.deleteBrand(id);
      } catch (error) {
        console.error("Delete brand failed:", error);
        throw error;
      }
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brands"] });
    },
  });
};

/**
 * 🔹 UPDATE BRAND STATUS
 */
export const useUpdateBrandStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "ACTIVE" | "INACTIVE";
    }) => {
      try {
        return await brandApi.updateStatus(id, status);
      } catch (error) {
        console.error("Status update failed:", error);
        throw error;
      }
    },

    onSuccess: (_response, variables) => {
      // ✅ Immediately update the React Query cache
      qc.setQueryData<Brand[]>(
        ["brands"],
        (currentBrands) => {
          if (!currentBrands) {
            return currentBrands;
          }

          return currentBrands.map((brand) =>
            brand.id === variables.id
              ? {
                  ...brand,
                  status: variables.status,
                }
              : brand
          );
        }
      );

      // ✅ Then synchronize with backend
      void qc.invalidateQueries({
        queryKey: ["brands"],
      });
    },
  });
};