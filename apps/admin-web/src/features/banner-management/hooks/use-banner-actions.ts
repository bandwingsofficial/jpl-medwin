"use client";

import {
  useState,
} from "react";

import {
  bannerService,
} from "@/features/banner-management/services/banner.service";

import {
  CreateBannerRequest,
  UpdateBannerRequest,
} from "@/features/banner-management/types/banner.types";

export function useBannerActions() {
  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const createBanner =
    async (
      payload: CreateBannerRequest
    ) => {
      try {
        setIsSubmitting(
          true
        );

        return await bannerService.createBanner(
          payload
        );
      } finally {
        setIsSubmitting(
          false
        );
      }
    };

  const updateBanner =
    async (
      bannerId: string,
      payload: UpdateBannerRequest
    ) => {
      try {
        setIsSubmitting(
          true
        );

        return await bannerService.updateBanner(
          bannerId,
          payload
        );
      } finally {
        setIsSubmitting(
          false
        );
      }
    };

  const deleteBanner =
    async (
      bannerId: string
    ) => {
      try {
        setIsSubmitting(
          true
        );

        return await bannerService.deleteBanner(
          bannerId
        );
      } finally {
        setIsSubmitting(
          false
        );
      }
    };

  const activateBanner =
    async (
      bannerId: string
    ) => {
      try {
        setIsSubmitting(
          true
        );

        return await bannerService.activateBanner(
          bannerId
        );
      } finally {
        setIsSubmitting(
          false
        );
      }
    };

  const deactivateBanner =
    async (
      bannerId: string
    ) => {
      try {
        setIsSubmitting(
          true
        );

        return await bannerService.deactivateBanner(
          bannerId
        );
      } finally {
        setIsSubmitting(
          false
        );
      }
    };

  const restoreBanner =
    async (
      bannerId: string
    ) => {
      try {
        setIsSubmitting(
          true
        );

        return await bannerService.restoreBanner(
          bannerId
        );
      } finally {
        setIsSubmitting(
          false
        );
      }
    };

  return {
    isSubmitting,

    createBanner,

    updateBanner,

    deleteBanner,

    activateBanner,

    deactivateBanner,

    restoreBanner,
  };
}