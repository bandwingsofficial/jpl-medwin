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

  link?: string | null;

  productId?: string | null;

  productSlug?: string | null;

  sortOrder: number;

  createdAt: string;

  updatedAt: string;
}

export interface Banner {
  id: string;

  name: string;

  type: BannerType;

  priority?: number;

  status: string;

  images: BannerImage[];

  createdAt: string;

  updatedAt: string;
}