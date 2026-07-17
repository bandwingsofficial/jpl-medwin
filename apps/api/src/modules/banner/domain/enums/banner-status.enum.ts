export enum BannerStatus {
  ACTIVE = 'ACTIVE',

  INACTIVE = 'INACTIVE',
}

// 🔥 Useful helpers

export const BANNER_STATUS_VALUES = Object.values(BannerStatus);

export type BannerStatusType = (typeof BANNER_STATUS_VALUES)[number];

// Optional: type guard

export const isBannerStatus = (value: string): value is BannerStatus => {
  return BANNER_STATUS_VALUES.includes(value as BannerStatus);
};
