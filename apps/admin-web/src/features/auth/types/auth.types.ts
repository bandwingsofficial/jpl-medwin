export interface AdminUser {
  id: string;
  role: "ADMIN";
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AdminLoginStartPayload {
  email: string;
  password: string;
  deviceId?: string;
  deviceName?: string;
  platform?: "WEB";
  ip?: string;
  userAgent?: string;
}

export interface AdminLoginStartResponse {
  success: boolean;
  message: string;
  challengeId?: string;
  target?: string;
  expiresIn?: number;
  resendCooldown?: number;
  step?: "EMAIL_OTP";
  data?: {
    challengeId: string;
    target: string;
    expiresIn: number;
    resendCooldown: number;
    step: "EMAIL_OTP";
  };
}

export interface AdminVerifyEmailOtpPayload {
  challengeId: string;
  otp: string;
}

export interface AdminVerifyEmailOtpResponse {
  success: boolean;
  message: string;
  challengeId?: string;
  emailOtpVerified?: boolean;
  step?: "TOTP";
  data?: {
    challengeId: string;
    emailOtpVerified: boolean;
    step: "TOTP";
  };
}

export interface AdminResendEmailOtpPayload {
  challengeId: string;
}

export interface AdminResendEmailOtpResponse {
  success: boolean;
  message: string;
  challengeId?: string;
  expiresIn?: number;
  resendCooldown?: number;
  data?: {
    challengeId: string;
    expiresIn: number;
    resendCooldown: number;
  };
}

export interface AdminVerifyTotpPayload {
  challengeId: string;
  totpCode: string;
  deviceId: string;
  deviceName?: string;
  platform?: "WEB";
  ip?: string;
  userAgent?: string;
}

export interface AdminVerifyTotpResponse {
  success: boolean;
  message: string;
  user?: AdminUser;
  session?: {
    id: string;
    deviceId: string;
    deviceName?: string;
    platform?: string;
  };
  data?: {
    user: AdminUser;
    session: {
      id: string;
      deviceId: string;
      deviceName?: string;
      platform?: string;
    };
  };
}