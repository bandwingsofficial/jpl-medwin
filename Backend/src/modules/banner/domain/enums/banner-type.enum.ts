export enum BannerType {
  HOME_BANNER = 'HOME_BANNER',

  CATEGORY_BANNER = 'CATEGORY_BANNER',

  SUB_CATEGORY_BANNER = 'SUB_CATEGORY_BANNER',

  PROMOTIONAL_BANNER = 'PROMOTIONAL_BANNER',

  PRODUCT_BANNER = 'PRODUCT_BANNER',
}

// 🔥 Useful helpers

export const BANNER_TYPE_VALUES =
  Object.values(BannerType);

export type BannerTypeType =
  (typeof BANNER_TYPE_VALUES)[number];

// Optional: type guard

export const isBannerType = (
  value: string,
): value is BannerType => {
  return BANNER_TYPE_VALUES.includes(
    value as BannerType,
  );
};