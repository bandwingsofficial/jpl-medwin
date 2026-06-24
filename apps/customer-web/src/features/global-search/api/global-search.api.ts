import { apiClient } from "@/infrastructure/api/axios-client";
import {
  GlobalSearchResponse,
} from "../types/global-search.types";

export async function searchEverything(
  query: string
): Promise<GlobalSearchResponse> {
  const response = await apiClient.get(
    `/search?q=${encodeURIComponent(query)}`
  );

  return response.data;
}