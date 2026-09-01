import { LoginPayload } from "../types/auth.types";

const DEVICE_ID_KEY = "admin_device_id";

function getDeviceId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}

export const buildLoginPayload = (
  data: Partial<LoginPayload>
): LoginPayload => {
  return {
    email: data.email || "",
    password: data.password || "",
    totpCode: data.totpCode || "",
    deviceId: getDeviceId(),
    deviceName: navigator.platform || "Unknown Device",
    platform: "WEB",
    ip: "::1", // Backend should determine the real client IP
    userAgent: navigator.userAgent,
  };
};