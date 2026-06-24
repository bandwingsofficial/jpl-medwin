export enum BannerType {
  HOME_BANNER = "HOME_BANNER",

  CATEGORY_BANNER =
    "CATEGORY_BANNER",

  SUB_CATEGORY_BANNER =
    "SUB_CATEGORY_BANNER",

  PROMOTIONAL_BANNER =
    "PROMOTIONAL_BANNER",

  PRODUCT_BANNER =
    "PRODUCT_BANNER",
}

export interface BannerImage {
  id: string;

  bannerId: string;

  imageUrl: string;

  productId: string | null;

  sortOrder: number;

  createdAt: string;

  updatedAt: string;
}

export interface Banner {
  id: string;

  name: string;

  type: BannerType;

  status: string;

  images: BannerImage[];

  createdAt: string;

  updatedAt: string;
}