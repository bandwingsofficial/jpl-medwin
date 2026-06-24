export const RATELIMIT_POLICY = {
  MAX_ATTEMPTS: 5,
  WINDOW_SECONDS: 10 * 60, // 10 min window
  BLOCK_DURATION_SECONDS: 15 * 60, // 15 min block

  // 🔥 Advanced
  ENABLE_BLOCKING: true,
  RESET_ON_SUCCESS: true, // reset attempts after successful OTP
} as const;
