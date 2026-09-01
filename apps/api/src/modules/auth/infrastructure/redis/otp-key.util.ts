// infrastructure/redis/otp-key.util.ts
export const buildOtpKey = (identifier: string) => `otp:${identifier}`;
