import { apiClient } from "@/infrastructure/api/axios-client";
import { ExportOrderFilters } from "../types/export-order.type";

export const OrderExportApi = {
  exportOrders: async (
    filters: ExportOrderFilters,
  ) => {
    const params = new URLSearchParams();

    if (filters.from)
      params.append("from", filters.from);

    if (filters.to)
      params.append("to", filters.to);

    if (filters.status)
      params.append("status", filters.status);

    if (filters.paymentStatus)
      params.append(
        "paymentStatus",
        filters.paymentStatus,
      );

    if (filters.search)
      params.append("search", filters.search);

    const response =
      await apiClient.get(
        `/admin/orders/export?${params.toString()}`,
        {
          responseType: "blob",
        },
      );

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download = `orders-${Date.now()}.xlsx`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  },
};