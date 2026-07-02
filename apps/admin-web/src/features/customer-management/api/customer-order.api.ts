import { apiClient } from "@/infrastructure/api/axios-client";

import { Order } from "@/features/order-management/types/order.type";

export interface CustomerOrdersResponse {
  orders: Order[];

  total: number;
}

export const customerOrderApi = {
  getCustomerOrders: async (
    customerId: string,
  ): Promise<CustomerOrdersResponse> => {
    const response =
      await apiClient.get(
        "/admin/orders",
        {
          params: {
            page: 1,
            limit: 100000,
          },
        },
      );

    const orders = Array.isArray(
      response.data?.data,
    )
      ? response.data.data
      : [];

    const customerOrders =
      orders.filter(
        (order: Order) =>
          order.userId ===
          customerId,
      );

    return {
      orders:
        customerOrders,

      total:
        customerOrders.length,
    };
  },
};