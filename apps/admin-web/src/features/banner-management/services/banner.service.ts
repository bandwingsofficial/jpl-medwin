import { bannerApi } from "@/features/banner-management/api/banner.api";

import {
  CreateBannerRequest,
  UpdateBannerImageRequest,
  UpdateBannerRequest,
} from "@/features/banner-management/types/banner.types";

import {
  showSuccess,
  showError,
} from "@/shared/store/toast.store";

class BannerService {
  async getBanners() {
    try {
      return await bannerApi.getAll();
    } catch (error) {
      showError(
        "Failed to load banners"
      );

      throw error;
    }
  }

  async getBanner(
    bannerId: string
  ) {
    try {
      return await bannerApi.getById(
        bannerId
      );
    } catch (error) {
      showError(
        "Failed to load banner"
      );

      throw error;
    }
  }

  async createBanner(
    payload: CreateBannerRequest
  ) {
    try {
      const formData =
        new FormData();

      formData.append(
        "name",
        payload.name
      );

      formData.append(
        "type",
        payload.type
      );

      payload.images.forEach(
        (
          image,
          index
        ) => {
          formData.append(
            "images",
            image.file
          );

          formData.append(
            `images[${index}][productId]`,
            image.productId
          );

          formData.append(
            `images[${index}][sortOrder]`,
            image.sortOrder.toString()
          );
        }
      );

      const response =
        await bannerApi.create(
          formData
        );

      showSuccess(
        "Banner created successfully"
      );

      return response;
    } catch (error) {
      showError(
        "Failed to create banner"
      );

      throw error;
    }
  }

  async updateBanner(
    bannerId: string,
    payload: UpdateBannerRequest
  ) {
    try {
      const response =
        await bannerApi.update(
          bannerId,
          payload
        );

      showSuccess(
        "Banner updated successfully"
      );

      return response;
    } catch (error) {
      showError(
        "Failed to update banner"
      );

      throw error;
    }
  }

  async activateBanner(
    bannerId: string
  ) {
    try {
      const response =
        await bannerApi.activate(
          bannerId
        );

      showSuccess(
        "Banner activated"
      );

      return response;
    } catch (error) {
      showError(
        "Failed to activate banner"
      );

      throw error;
    }
  }

  async deactivateBanner(
    bannerId: string
  ) {
    try {
      const response =
        await bannerApi.deactivate(
          bannerId
        );

      showSuccess(
        "Banner deactivated"
      );

      return response;
    } catch (error) {
      showError(
        "Failed to deactivate banner"
      );

      throw error;
    }
  }

  async deleteBanner(
    bannerId: string
  ) {
    try {
      const response =
        await bannerApi.delete(
          bannerId
        );

      showSuccess(
        "Banner deleted successfully"
      );

      return response;
    } catch (error) {
      showError(
        "Failed to delete banner"
      );

      throw error;
    }
  }

  async restoreBanner(
    bannerId: string
  ) {
    try {
      const response =
        await bannerApi.restore(
          bannerId
        );

      showSuccess(
        "Banner restored successfully"
      );

      return response;
    } catch (error) {
      showError(
        "Failed to restore banner"
      );

      throw error;
    }
  }

  async addImage(
    bannerId: string,
    file: File,
    productId: string,
    sortOrder: number
  ) {
    try {
      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );

      formData.append(
        "productId",
        productId
      );

      formData.append(
        "sortOrder",
        sortOrder.toString()
      );

      const response =
        await bannerApi.addImage(
          bannerId,
          formData
        );

      showSuccess(
        "Banner image added"
      );

      return response;
    } catch (error) {
      showError(
        "Failed to add image"
      );

      throw error;
    }
  }

  async updateImage(
    imageId: string,
    payload: UpdateBannerImageRequest
  ) {
    try {
      const formData =
        new FormData();

      if (payload.image) {
        formData.append(
          "image",
          payload.image
        );
      }

      if (
        payload.productId
      ) {
        formData.append(
          "productId",
          payload.productId
        );
      }

      if (
        payload.sortOrder !==
        undefined
      ) {
        formData.append(
          "sortOrder",
          payload.sortOrder.toString()
        );
      }

      const response =
        await bannerApi.updateImage(
          imageId,
          formData
        );

      showSuccess(
        "Image updated"
      );

      return response;
    } catch (error) {
      showError(
        "Failed to update image"
      );

      throw error;
    }
  }

  async deleteImage(
    imageId: string
  ) {
    try {
      const response =
        await bannerApi.deleteImage(
          imageId
        );

      showSuccess(
        "Image deleted"
      );

      return response;
    } catch (error) {
      showError(
        "Failed to delete image"
      );

      throw error;
    }
  }

  async restoreImage(
    imageId: string
  ) {
    try {
      const response =
        await bannerApi.restoreImage(
          imageId
        );

      showSuccess(
        "Image restored"
      );

      return response;
    } catch (error) {
      showError(
        "Failed to restore image"
      );

      throw error;
    }
  }
}

export const bannerService =
  new BannerService();