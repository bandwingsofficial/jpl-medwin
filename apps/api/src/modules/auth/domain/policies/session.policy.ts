export const SESSION_POLICY = {
  REFRESH_TOKEN_EXPIRY_DAYS: 7,

  ROTATE_ON_REFRESH: true, // 🔁 security best practice

  // 🔥 Advanced
  MAX_SESSIONS_PER_USER: 5, // limit active devices
  REVOKE_ON_PASSWORD_CHANGE: true,
  UPDATE_LAST_USED_ON_ACCESS: true,
} as const;
