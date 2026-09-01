import { apiClient } from "./axios-client";

/**
 * 🔐 TYPES
 */
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * 📌 SEND OTP
 */
export const sendOtp = async (payload: {
  email?: string;
  phone?: string;
}): Promise<ApiResponse<{
  method: string;
  target: string;
  retryAfter: number;
  remainingSendAttempts: number;
}>> => {
  const res = await apiClient.post("/auth/send-otp", payload);
  return res.data;
};

/**
 * 📌 VERIFY OTP (LOGIN)
 */
export const verifyOtp = async (payload: {
  email?: string;
  phone?: string;
  code: string;
  deviceId: string;
  deviceName: string;
  platform: "web";
}): Promise<ApiResponse<{
  user: {
    id: string;
    role: "USER";
  };
  session: {
    id: string;
    deviceId: string;
    deviceName: string;
  };
  token: {
    accessToken: string;
    refreshToken: string;
  };
}>> => {
  const res = await apiClient.post("/auth/verify-otp", payload);
  return res.data;
};

/**
 * 📌 GET CURRENT USER
 * ✅ FIXED → Backend uses GET
 */
export const getMe = async (): Promise<ApiResponse<{
  user: {
    id: string;
    role: "USER";
  };
}>> => {
  const res = await apiClient.get("/auth/me"); // ✅ FIXED
  return res.data;
};

/**
 * 🔄 REFRESH TOKEN
 */
export const refresh = async (): Promise<ApiResponse<{
  accessToken: string;
  refreshToken: string;
}>> => {
  const res = await apiClient.post("/auth/refresh");
  return res.data;
};

/**
 * 🚪 LOGOUT
 */
export const logout = async (): Promise<ApiResponse<{
  message: string;
}>> => {
  const res = await apiClient.post("/auth/logout");
  return res.data;
};