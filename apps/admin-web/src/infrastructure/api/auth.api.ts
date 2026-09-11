import { apiClient } from "./axios-client";
import {
  AdminLoginStartPayload,
  AdminLoginStartResponse,
  AdminVerifyEmailOtpPayload,
  AdminVerifyEmailOtpResponse,
  AdminResendEmailOtpPayload,
  AdminResendEmailOtpResponse,
  AdminVerifyTotpPayload,
  AdminVerifyTotpResponse,
} from "@/features/auth/types/auth.types";

// =======================
// 🔐 STAGE 1: CREDENTIALS -> SEND EMAIL OTP
// =======================
export const adminLoginStart = async (
  payload: AdminLoginStartPayload
): Promise<AdminLoginStartResponse> => {
  const res = await apiClient.post("/auth/admin/login", payload);
  return res.data;
};

// =======================
// 📧 STAGE 2: VERIFY EMAIL OTP
// =======================
export const adminVerifyEmailOtp = async (
  payload: AdminVerifyEmailOtpPayload
): Promise<AdminVerifyEmailOtpResponse> => {
  const res = await apiClient.post("/auth/admin/verify-email-otp", payload);
  return res.data;
};

// =======================
// 🔄 STAGE 2: RESEND EMAIL OTP
// =======================
export const adminResendEmailOtp = async (
  payload: AdminResendEmailOtpPayload
): Promise<AdminResendEmailOtpResponse> => {
  const res = await apiClient.post("/auth/admin/resend-email-otp", payload);
  return res.data;
};

// =======================
// 🔐 STAGE 3: VERIFY TOTP -> CREATE SESSION & COOKIES
// =======================
export const adminVerifyTotp = async (
  payload: AdminVerifyTotpPayload
): Promise<AdminVerifyTotpResponse> => {
  const res = await apiClient.post("/auth/admin/verify-totp", payload);
  return res.data;
};

// =======================
// 👤 CURRENT ADMIN
// =======================
export const getAdminMe = async () => {
  const res = await apiClient.get("/auth/admin/me");
  return res.data;
};

// =======================
// 🚪 LOGOUT (cookie-based & session revocation)
// =======================
export const logout = async () => {
  const res = await apiClient.post("/auth/logout");
  return res.data;
};