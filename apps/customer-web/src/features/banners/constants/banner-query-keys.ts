export const bannerQueryKeys = {
  all: ["banners"],

  list: () => [
    ...bannerQueryKeys.all,
    "list",
  ],

  type: (
    bannerType: string
  ) => [
    ...bannerQueryKeys.all,
    "type",
    bannerType,
  ],

  detail: (
    bannerId: string
  ) => [
    ...bannerQueryKeys.all,
    "detail",
    bannerId,
  ],
};