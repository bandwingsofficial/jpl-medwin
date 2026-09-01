import { apiClient } from "@/infrastructure/api/axios-client";

import {
  AddressListResponse,
  AddressResponse,
  CreateAddressPayload,
  UpdateAddressPayload,
} from "@/features/address/types/address.type";

// ========================================
// GET ALL
// ========================================

export async function getAddresses(): Promise<AddressListResponse> {
  const response =
    await apiClient.get("/saved-addresses");

  return response.data;
}

// ========================================
// CREATE
// ========================================

export async function createAddress(
  payload: CreateAddressPayload
): Promise<AddressResponse> {
  const response =
    await apiClient.post(
      "/saved-addresses",
      payload
    );

  return response.data;
}

// ========================================
// UPDATE
// ========================================

export async function updateAddress(
  payload: UpdateAddressPayload
): Promise<AddressResponse> {
  const { id, ...data } = payload;

  const response =
    await apiClient.patch(
      `/saved-addresses/${id}`,
      data
    );

  return response.data;
}

// ========================================
// DELETE
// ========================================

export async function deleteAddress(
  id: string
) {
  const response =
    await apiClient.delete(
      `/saved-addresses/${id}`
    );

  return response.data;
}