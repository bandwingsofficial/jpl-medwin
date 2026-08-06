import { apiClient } from "@/infrastructure/api/axios-client";

import {
  BannerListResponse,
  BannerDetailResponse,
} from "../types/banner-response.types";

import {
  Banner,
  BannerType,
} from "../types/banner.types";

const BASE_URL = "/banners";

export const bannerApi = {
  async getHomeBanners(): Promise<
    Banner[]
  > {
    const response =
      await apiClient.get<BannerListResponse>(
        `${BASE_URL}/type/${BannerType.HOME_BANNER}`
      );

    const banners =
      Array.isArray(
        response.data?.data
      )
        ? response.data.data
        : [];

    if (
      banners.length === 0
    ) {
      return [];
    }

    const bannerDetails =
      await Promise.all(
        banners.map(
          async (
            banner
          ) => {
            const detailResponse =
              await apiClient.get<BannerDetailResponse>(
                `${BASE_URL}/${banner.id}`
              );

            return (
              detailResponse
                .data.data
            );
          }
        )
      );
    return bannerDetails;
  },

  async getBanner(
    bannerId: string
  ): Promise<Banner> {
    const response =
      await apiClient.get<BannerDetailResponse>(
        `${BASE_URL}/${bannerId}`
      );

    return response.data.data;
  },
  async getBannersByType(
  type: BannerType
): Promise<Banner[]> {
  const response =
    await apiClient.get(
      `${BASE_URL}/type/${type}`
    );

  const banners =
    response.data?.data ?? [];

  const details =
    await Promise.all(
      banners.map(
        async (
          banner: {
            id: string;
          }
        ) => {
          const detail =
            await apiClient.get(
              `${BASE_URL}/${banner.id}`
            );

          return detail.data.data;
        }
      )
    );

  return details;
},
};