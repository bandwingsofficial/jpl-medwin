import { apiClient } from "@/infrastructure/api/axios-client";
import { Brand } from "../types/brand.type";

class BrandApi {
  async getBrands(): Promise<Brand[]> {
    const res = await apiClient.get("/brands");

    // SAFETY: handle both formats
    const data = res.data?.data ?? res.data ?? [];

    // Filter only ACTIVE brands
    return data.filter((b: Brand) => b.status === "ACTIVE");
  }
}

export const brandApi = new BrandApi();