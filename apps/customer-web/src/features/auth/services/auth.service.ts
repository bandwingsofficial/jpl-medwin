import { sendOtp, verifyOtp, getMe, logout } from "@/infrastructure/api/auth.api";

export const authService = {
  sendOtp,
  verifyOtp,
  getMe,
  logout,
};