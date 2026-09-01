export enum OtpStatus {
  SENT = 'SENT',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED',
}

// 🔥 Helpers

export const OTP_STATUS_VALUES = Object.values(OtpStatus);

export type OtpStatusType = (typeof OTP_STATUS_VALUES)[number];

export const isOtpStatus = (value: string): value is OtpStatus => {
  return OTP_STATUS_VALUES.includes(value as OtpStatus);
};
