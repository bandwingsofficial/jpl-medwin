import { Banner } from "./banner.types";

export interface BannerListResponse {
  success: boolean;

  message: string;

  data: Banner[];
}

export interface BannerDetailResponse {
  success: boolean;

  message: string;

  data: Banner;
}