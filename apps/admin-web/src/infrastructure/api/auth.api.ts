import { apiClient } from "./axios-client";
import { LoginPayload, LoginResponse } from "@/features/auth/types/auth.types";

export const adminLogin = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const res = await apiClient.post("/auth/admin/login", payload);
  return res.data;
};

export const getAdminMe = async () => {
  const res = await apiClient.get("/auth/admin/me");
  return res.data;
};

// ✅ LOGOUT (cookie-based)
export const logout = async () => {
  const res = await apiClient.post("/auth/logout");
  return res.data;
};