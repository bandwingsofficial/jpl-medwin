export const TOKEN_POLICY = {
  ACCESS_TOKEN_EXPIRY_MINUTES: 15, // short-lived
  REFRESH_TOKEN_EXPIRY_DAYS: 7,

  ISSUER: 'your-app',
  AUDIENCE: 'your-app-users',

  // 🔥 Security
  ALGORITHM: 'HS256',
} as const;
