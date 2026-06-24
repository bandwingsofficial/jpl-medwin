import { AxiosError } from "axios";

import { apiClient } from "@/infrastructure/api/axios-client";

import {
  ProfileResponse,
  UpdateProfilePayload,
} from "@/features/account/types/profile.type";

// =========================================
// BUILD FORM DATA
// =========================================

function buildProfileFormData(
  payload: UpdateProfilePayload
) {
  const formData = new FormData();

  // ✅ NAME
  formData.append("name", payload.name);

  // ✅ EMAIL
  // ONLY APPEND IF EXISTS
  if (payload.email) {
    formData.append(
      "email",
      payload.email
    );
  }

  // ✅ PHONE NUMBER
  if (payload.phoneNumber) {
    formData.append(
      "phoneNumber",
      payload.phoneNumber
    );
  }

  // ✅ AVATAR
  if (payload.avatar instanceof File) {
    formData.append(
      "avatar",
      payload.avatar
    );
  }

  return formData;
}

// =========================================
// GET CUSTOMER PROFILE
// =========================================

export async function getProfile(): Promise<ProfileResponse | null> {
  try {
    const response =
      await apiClient.get("/profile");

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{
      message?: string;
    }>;

    // =========================================
    // NEW USER
    // PROFILE NOT CREATED YET
    // =========================================

    if (
      axiosError.response?.data
        ?.message ===
      "Profile not found"
    ) {
      return null;
    }

    throw error;
  }
}

// =========================================
// CREATE CUSTOMER PROFILE
// =========================================

export async function createProfile(
  payload: UpdateProfilePayload
): Promise<ProfileResponse> {
  const formData =
    buildProfileFormData(payload);

  const response =
    await apiClient.post(
      "/profile",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return response.data;
}

// =========================================
// UPDATE CUSTOMER PROFILE
// =========================================

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<ProfileResponse> {
  const formData =
    buildProfileFormData(payload);

  const response =
    await apiClient.patch(
      "/profile",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return response.data;
}
