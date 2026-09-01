import { apiClient } from "@/infrastructure/api/axios-client";

import {
  ProductVariant,
  VariantListResponse,
  VariantStatus,
} from "@/features/product-management/types/variant.type";

// =========================================
// GET PRODUCT VARIANTS
// =========================================

export interface GetVariantsParams {
  productId: string;

  page?: number;

  limit?: number;

  search?: string;

  onlyActive?: boolean;

  includeDeleted?: boolean;
}

export async function getProductVariants(
  params: GetVariantsParams
): Promise<VariantListResponse> {
  const {
    productId,
    page = 1,
    limit = 20,
    search,
    onlyActive = false,

    // IMPORTANT
    // admin panel should see deleted variants
    includeDeleted = true,
  } = params;

  const response =
    await apiClient.get<
      VariantListResponse
    >(
      `/admin/products/${productId}/variants`,
      {
        params: {
          page,
          limit,
          search,
          onlyActive,
          includeDeleted,
        },
      }
    );

  return response.data;
}

// =========================================
// GET SINGLE VARIANT
// =========================================

export interface SingleVariantResponse {
  success: boolean;

  message: string;

  data: ProductVariant;
}

export interface GetVariantDetailsParams {
  productId: string;

  variantId: string;
}

export async function getVariantDetails(
  params: GetVariantDetailsParams
): Promise<SingleVariantResponse> {
  const {
    productId,
    variantId,
  } = params;

  const response =
    await apiClient.get<
      SingleVariantResponse
    >(
      `/admin/products/${productId}/variants/${variantId}`
    );

  return response.data;
}

// =========================================
// DELETE VARIANT
// =========================================

export interface DeleteVariantPayload {
  productId: string;

  variantId: string;

  force?: boolean;
}

export async function deleteVariant(
  payload: DeleteVariantPayload
) {
  const {
    productId,
    variantId,
    force = false,
  } = payload;

  const response =
    await apiClient.delete(
      `/admin/products/${productId}/variants/${variantId}`,
      {
        params: {
          force,
        },
      }
    );

  return response.data;
}

// =========================================
// PREVIEW DELETE VARIANT
// =========================================

export interface PreviewDeleteVariantPayload {
  productId: string;

  variantId: string;
}

export async function previewDeleteVariant(
  payload: PreviewDeleteVariantPayload
) {
  const {
    productId,
    variantId,
  } = payload;

  const response =
    await apiClient.delete(
      `/admin/products/${productId}/variants/${variantId}`,
      {
        params: {
          preview: true,
        },
      }
    );

  return response.data;
}

// =========================================
// RESTORE VARIANT
// =========================================

export interface RestoreVariantPayload {
  productId: string;

  variantId: string;
}

export async function restoreVariant(
  payload: RestoreVariantPayload
) {
  const {
    productId,
    variantId,
  } = payload;

  const response =
    await apiClient.patch(
      `/admin/products/${productId}/variants/${variantId}/restore`
    );

  return response.data;
}

// =========================================
// TOGGLE VARIANT STATUS
// =========================================

export interface ToggleVariantStatusPayload {
  productId: string;

  variantId: string;

  status: VariantStatus;
}

export async function toggleVariantStatus(
  payload: ToggleVariantStatusPayload
) {
  const {
    productId,
    variantId,
    status,
  } = payload;

  const response =
    await apiClient.patch(
      `/admin/products/${productId}/variants/${variantId}/status`,
      {
        status,
      }
    );

  return response.data;
}