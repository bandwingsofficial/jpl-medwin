import { apiClient } from "@/infrastructure/api/axios-client";

import { ProductExportFilters } from "../types/product-export.type";

export const ProductExportApi = {
  exportProducts: async (
    filters: ProductExportFilters,
  ): Promise<void> => {
    const response =
      await apiClient.get(
        `/admin/products/export/${filters.exportType}`,
        {
          params: {
            fromDate:
              filters.fromDate,
            toDate:
              filters.toDate,
          },
          responseType: "blob",
        },
      );

    const blob = new Blob(
      [response.data],
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    );

    const url =
      window.URL.createObjectURL(
        blob,
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.download = `products-${filters.exportType}-${Date.now()}.xlsx`;

    document.body.appendChild(
      link,
    );

    link.click();

    link.remove();

    window.URL.revokeObjectURL(
      url,
    );
  },
};