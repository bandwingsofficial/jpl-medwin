import {
  BannerType,
} from "@/features/banner-management/types/banner.types";

export const BANNER_TYPES: {
  label: string;
  value: BannerType;
}[] = [
  {
    label: "Home Banner",
    value: "HOME_BANNER",
  },
  {
    label: "Category Banner",
    value: "CATEGORY_BANNER",
  },
  {
    label: "Sub Category Banner",
    value:
      "SUB_CATEGORY_BANNER",
  },
  {
    label:
      "Promotional Banner",
    value:
      "PROMOTIONAL_BANNER",
  },
  {
    label: "Product Banner",
    value: "PRODUCT_BANNER",
  },
];