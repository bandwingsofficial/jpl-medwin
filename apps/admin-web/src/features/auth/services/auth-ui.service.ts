import { LoginPayload } from "../types/auth.types";

export const buildLoginPayload = (
  data: Partial<LoginPayload>
): LoginPayload => {
  return {
    email: data.email || "",
    password: data.password || "",
    totpCode: data.totpCode || "",
    deviceId: "admin-device-1",
    deviceName: "Chrome Windows",
    platform: "WEB",
    ip: "::1",
    userAgent: navigator.userAgent,
  };
};