"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getProductVariants,
  getVariantDetails,
  toggleVariantStatus,
  deleteVariant,
  previewDeleteVariant,
  restoreVariant,
} from "@/infrastructure/api/variant.api";

// =========================================
// USE VARIANTS
// =========================================

interface UseVariantsParams {
  productId: string;

  page?: number;

  limit?: number;
}

export function useVariants(
  params: UseVariantsParams
) {
  const {
    productId,
    page = 1,
    limit = 20,
  } = params;

  const queryClient =
    useQueryClient();

  // =========================================
  // REFRESH HELPERS
  // =========================================

  const refreshAllQueries =
    async () => {

      // =====================================
      // PRODUCT LIST
      // =====================================

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      await queryClient.refetchQueries({
        queryKey: ["products"],
      });

      // =====================================
      // PRODUCT VARIANTS
      // =====================================

      await queryClient.invalidateQueries({
        queryKey: [
          "product-variants",
          productId,
        ],
      });

      await queryClient.refetchQueries({
        queryKey: [
          "product-variants",
          productId,
        ],
      });

      // =====================================
      // VARIANT DETAILS
      // =====================================

      await queryClient.invalidateQueries({
        queryKey: [
          "variant-details",
        ],
      });

      await queryClient.refetchQueries({
        queryKey: [
          "variant-details",
        ],
      });
    };

  // =========================================
  // VARIANTS QUERY
  // =========================================

  const variantsQuery =
    useQuery({
      queryKey: [
        "product-variants",
        productId,
        page,
        limit,
      ],

      queryFn: () =>
        getProductVariants({
          productId,
          page,
          limit,
        }),

      enabled: !!productId,

      staleTime: 0,

      gcTime:
        1000 * 60 * 10,

      refetchOnMount: true,

      refetchOnWindowFocus: true,

      refetchOnReconnect: true,
    });

  // =========================================
  // TOGGLE STATUS
  // =========================================

  const toggleVariantStatusMutation =
    useMutation({
      mutationFn:
        toggleVariantStatus,

      onSuccess:
        async () => {
          await refreshAllQueries();
        },
    });

  // =========================================
  // DELETE VARIANT
  // =========================================

  const deleteVariantMutation =
    useMutation({
      mutationFn:
        deleteVariant,

      onSuccess:
        async () => {
          await refreshAllQueries();
        },
    });

  // =========================================
  // PREVIEW DELETE VARIANT
  // =========================================

  const previewDeleteVariantMutation =
    useMutation({
      mutationFn:
        previewDeleteVariant,
    });

  // =========================================
  // RESTORE VARIANT
  // =========================================

  const restoreVariantMutation =
    useMutation({
      mutationFn:
        restoreVariant,

      onSuccess:
        async () => {
          await refreshAllQueries();
        },
    });

  return {
    variantsQuery,

    toggleVariantStatusMutation,

    deleteVariantMutation,

    previewDeleteVariantMutation,

    restoreVariantMutation,
  };
}

// =========================================
// USE SINGLE VARIANT
// =========================================

interface UseVariantDetailsParams {
  productId: string;

  variantId: string;
}

export function useVariantDetails(
  params: UseVariantDetailsParams
) {
  const {
    productId,
    variantId,
  } = params;

  const variantDetailsQuery =
    useQuery({
      queryKey: [
        "variant-details",
        productId,
        variantId,
      ],

      queryFn: () =>
        getVariantDetails({
          productId,
          variantId,
        }),

      enabled:
        !!productId &&
        !!variantId,

      staleTime: 0,

      gcTime:
        1000 * 60 * 10,

      refetchOnMount: true,

      refetchOnWindowFocus: true,

      refetchOnReconnect: true,
    });

  return {
    variantDetailsQuery,
  };
}