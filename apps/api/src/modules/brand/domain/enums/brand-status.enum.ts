export enum BrandStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// 🔥 Useful helpers

export const BRAND_STATUS_VALUES = Object.values(BrandStatus);

export type BrandStatusType = (typeof BRAND_STATUS_VALUES)[number];

// Optional: type guard (very useful in validation)
export const isBrandStatus = (value: string): value is BrandStatus => {
  return BRAND_STATUS_VALUES.includes(value as BrandStatus);
};
