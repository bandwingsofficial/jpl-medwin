export interface AdminUser {
  id: string;
  role: "ADMIN";
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  message: string | undefined;
  success: boolean;
  data: {
    message: string;
    user: AdminUser;
    token: AuthTokens;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
  totpCode: string;
  deviceId: string;
  deviceName: string;
  platform: "WEB";
  ip: string;
  userAgent: string;
}