export enum OtpPurpose {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  PASSWORD_RESET = 'PASSWORD_RESET',
  TRANSACTION = 'TRANSACTION',
}

// 🔥 Helpers

export const OTP_PURPOSE_VALUES = Object.values(OtpPurpose);

export type OtpPurposeType = (typeof OTP_PURPOSE_VALUES)[number];

export const isOtpPurpose = (value: string): value is OtpPurpose => {
  return OTP_PURPOSE_VALUES.includes(value as OtpPurpose);
};
