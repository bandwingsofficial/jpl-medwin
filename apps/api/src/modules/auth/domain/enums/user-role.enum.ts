export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

// 🔥 Useful helpers

export const USER_ROLE_VALUES = Object.values(UserRole);

export type UserRoleType = (typeof USER_ROLE_VALUES)[number];

// Optional: type guard (very useful in validation)
export const isUserRole = (value: string): value is UserRole => {
  return USER_ROLE_VALUES.includes(value as UserRole);
};
