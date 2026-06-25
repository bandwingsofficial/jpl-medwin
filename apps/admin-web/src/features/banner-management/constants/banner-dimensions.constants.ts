export interface BannerDimensionRule {
  width: number;

  height: number;

  tolerance: number;
}

export const BANNER_DIMENSIONS = {
  HOME_BANNER: {
    width: 1920,
    height: 700,
    tolerance: 300,
  },

  CATEGORY_BANNER_HORIZONTAL: {
    width: 1200,
    height: 630,
    tolerance: 200,
  },

  CATEGORY_BANNER_VERTICAL: {
    width: 900,
    height: 1400,
    tolerance: 200,
  },

  SUB_CATEGORY_BANNER: {
    width: 1200,
    height: 300,
    tolerance: 200,
  },

  PROMOTIONAL_BANNER: {
    width: 1200,
    height: 300,
    tolerance: 200,
  },

  PRODUCT_BANNER: {
    width: 1200,
    height: 300,
    tolerance: 200,
  },
} as const;