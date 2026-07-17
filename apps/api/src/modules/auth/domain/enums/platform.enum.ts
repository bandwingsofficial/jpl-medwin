export enum Platform {
  WEB = 'WEB',
  ANDROID = 'ANDROID',
  IOS = 'IOS',
}

// 🔥 Helpers

export const PLATFORM_VALUES = Object.values(Platform);

export type PlatformType = (typeof PLATFORM_VALUES)[number];

// Optional: type guard
export const isPlatform = (value: string): value is Platform => {
  return PLATFORM_VALUES.includes(value as Platform);
};
