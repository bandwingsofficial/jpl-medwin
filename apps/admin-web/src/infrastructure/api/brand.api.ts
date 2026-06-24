import { apiClient } from "@/infrastructure/api/axios-client";
import {
  Brand,
  CreateBrandPayload,
  UpdateBrandPayload,
} from "@/features/brand-management/types/brand.type";

const BASE_URL = "/admin/brands";

export const brandApi = {
  // ✅ GET ALL
  async getBrands(): Promise<Brand[]> {
    const res = await apiClient.get("/brands");
    return res.data.data;
  },

  // ✅ CREATE
  async createBrand(payload: CreateBrandPayload): Promise<Brand> {
    const isFileUpload = payload.image instanceof File;

    let body: any = payload;

    if (isFileUpload) {
      const formData = new FormData();
      formData.append("name", payload.name);
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

  // ✅ UPDATE
  async updateBrand(payload: UpdateBrandPayload): Promise<Brand> {
    const { id, ...rest } = payload;

    const isFileUpload = rest.image instanceof File;

    let body: any = rest;

    if (isFileUpload) {
      const formData = new FormData();
      formData.append("name", rest.name);
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

  // ✅ DELETE
  async deleteBrand(id: string): Promise<void> {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },

  // ✅ STATUS
  async updateStatus(id: string, status: "ACTIVE" | "INACTIVE") {
    const res = await apiClient.patch(`${BASE_URL}/${id}/status`, {
      status,
    });
    return res.data.data;
  },
};