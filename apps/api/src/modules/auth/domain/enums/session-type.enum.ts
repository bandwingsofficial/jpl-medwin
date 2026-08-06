export enum SessionType {
  USER = 'USER',
  ADMIN = 'ADMIN',
  API = 'API',
  OTHER = 'OTHER',
}

// 🔥 Helpers

export const SESSION_TYPE_VALUES = Object.values(SessionType);

export type SessionTypeType = (typeof SESSION_TYPE_VALUES)[number];

// Optional: type guard
export const isSessionType = (value: string): value is SessionType => {
  return SESSION_TYPE_VALUES.includes(value as SessionType);
};
