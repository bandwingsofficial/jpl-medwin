import { apiClient } from "@/infrastructure/api/axios-client";
import {
  Brand,
  CreateBrandPayload,
  UpdateBrandPayload,
} from "@/features/brand-management/types/brand.type";

const BASE_URL = "/admin/brands";

export const brandApi = {
  async getBrands(): Promise<Brand[]> {
    const res = await apiClient.get("/brands");
    return res.data.data;
  },

  async checkSkuPrefix(prefix: string, excludeId?: string) {
    const res = await apiClient.get(`${BASE_URL}/check-sku-prefix`, {
      params: { prefix, excludeId },
    });
    return res.data.data as {
      skuPrefix: string;
      exists: boolean;
      available: boolean;
    };
  },

  async suggestSkuPrefix(name: string, excludeId?: string) {
    const res = await apiClient.get(`${BASE_URL}/suggest-sku-prefix`, {
      params: { name, excludeId },
    });
    return res.data.data as { skuPrefix: string };
  },

  async createBrand(payload: CreateBrandPayload): Promise<Brand> {
    const isFileUpload = payload.image instanceof File;

    let body: CreateBrandPayload | FormData = payload;

    if (isFileUpload) {
      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("skuPrefix", payload.skuPrefix);
      if (payload.image) formData.append("image", payload.image);
      if (payload.description)
        formData.append("description", payload.description);
      if (payload.metaDescription)
        formData.append("metaDescription", payload.metaDescription);

      body = formData;
    }

    const res = await apiClient.post(BASE_URL, body);
    return res.data.data;
  },

  async updateBrand(payload: UpdateBrandPayload): Promise<Brand> {
    const { id, ...rest } = payload;

    const isFileUpload = rest.image instanceof File;

    let body: Omit<UpdateBrandPayload, "id"> | FormData = rest;

    if (isFileUpload) {
      const formData = new FormData();
      formData.append("name", rest.name);
      formData.append("skuPrefix", rest.skuPrefix);
      if (rest.image) formData.append("image", rest.image);
      if (rest.description)
        formData.append("description", rest.description);
      if (rest.metaDescription)
        formData.append("metaDescription", rest.metaDescription);

      body = formData;
    }

    const res = await apiClient.patch(`${BASE_URL}/${id}`, body);
    return res.data.data;
  },

  async deleteBrand(id: string): Promise<void> {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },

  async updateStatus(id: string, status: "ACTIVE" | "INACTIVE") {
    const res = await apiClient.patch(`${BASE_URL}/${id}/status`, {
      status,
    });
    return res.data.data;
  },
};
