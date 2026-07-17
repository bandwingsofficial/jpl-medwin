export const OTP_POLICY = {
  EXPIRY_SECONDS: 5 * 60, // 5 minutes
  RESEND_COOLDOWN_SECONDS: 30, // 30 seconds
  MAX_ATTEMPTS: 5,
  LENGTH: 6,

  // 🔥 Advanced (very useful)
  HASH: true, // store hashed OTP in Redis
  ALLOWED_PURPOSES: ['LOGIN', 'SIGNUP', 'PASSWORD_RESET', 'TRANSACTION'] as const,
} as const;
