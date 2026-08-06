export enum AuthMethod {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
}

// 🔥 Useful helpers

export const AUTH_METHOD_VALUES = Object.values(AuthMethod);

export type AuthMethodType = (typeof AUTH_METHOD_VALUES)[number];

// Optional: type guard (very useful in validation)
export const isAuthMethod = (value: string): value is AuthMethod => {
  return AUTH_METHOD_VALUES.includes(value as AuthMethod);
};
