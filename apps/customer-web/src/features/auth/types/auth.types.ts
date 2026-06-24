export interface CustomerUser {
  id: string;
  email?: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: CustomerUser;
  };
}

export interface SendOtpPayload {
  email?: string;
  phone?: string;
}

export interface VerifyOtpPayload extends SendOtpPayload {
  code: string;
  deviceId: string;
  deviceName: string;
  platform: "web";
}