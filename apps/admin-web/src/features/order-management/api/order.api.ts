import { apiClient } from "@/infrastructure/api/axios-client";

import {
  Order,
  OrdersResponse,
} from "../types/order.type";

/*
|--------------------------------------------------------------------------
| PARAMS
|--------------------------------------------------------------------------
*/

export interface GetOrdersParams {
  page?: number;

  limit?: number;

  search?: string;

  status?: string;
}

/*
|--------------------------------------------------------------------------
| SAFE RESPONSE HELPERS
|--------------------------------------------------------------------------
*/

const extractData = (
  response: any
) => {
  return (
    response?.data?.data ||
    response?.data ||
    null
  );
};

const extractNestedData = (
  response: any
) => {
  return (
    response?.data?.data
      ?.data ||
    response?.data?.data ||
    response?.data ||
    null
  );
};

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

export const orderApi = {
  /*
  |--------------------------------------------------------------------------
  | GET ORDERS
  |--------------------------------------------------------------------------
  */

  getOrders: async (
    params?: GetOrdersParams
  ): Promise<OrdersResponse> => {
    const res =
      await apiClient.get(
        "/admin/orders",
        {
          params: {
            page:
              params?.page || 1,

            limit:
              params?.limit || 10,

            search:
              params?.search || "",

            status:
              params?.status || "",
          },
        }
      );
    /*
    |--------------------------------------------------------------------------
    | SAFE RESPONSE
    |--------------------------------------------------------------------------
    */

    const orders =
  Array.isArray(res.data?.data)
    ? res.data.data
    : [];

const pagination =
  res.data?.pagination || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };
    /*
    |--------------------------------------------------------------------------
    | RETURN FLAT STRUCTURE
    |--------------------------------------------------------------------------
    */

    return {
      orders,

      pagination,
    };
  },

  /*
  |--------------------------------------------------------------------------
  | GET ORDER DETAILS
  |--------------------------------------------------------------------------
  */

  getOrderDetails: async (
  id: string
): Promise<Order | null> => {
  const res =
    await apiClient.get(
      `/admin/orders/${id}`
    );


  /*
  |------------------------------------------------------------------
  | SAFE RESPONSE EXTRACTION
  |------------------------------------------------------------------
  */

  const raw = res.data;

if (!raw) {
  return null;
}
  /*
  |------------------------------------------------------------------
  | NORMALIZED ORDER
  |------------------------------------------------------------------
  */

  const normalizedOrder: Order = {
    ...raw,

    /*
    |----------------------------------------------------------------
    | ITEMS NORMALIZATION
    |----------------------------------------------------------------
    */

    items:
      raw.items ||
      raw.orderItems ||
      [],

    /*
    |----------------------------------------------------------------
    | ADDRESS FALLBACKS
    |----------------------------------------------------------------
    */

    shippingAddress: {
  name:
    raw.shippingAddress?.name ||
    raw.shippingAddress?.fullName ||
    "",

  phone:
    raw.shippingAddress?.phone ||
    raw.shippingAddress?.phoneNumber ||
    "",

  line1:
    raw.shippingAddress?.line1 ||
    raw.shippingAddress?.addressLine1 ||
    "",

  city:
    raw.shippingAddress?.city ||
    "",

  state:
    raw.shippingAddress?.state ||
    "",

  postalCode:
    raw.shippingAddress?.postalCode ||
    "",

  country:
    raw.shippingAddress?.country ||
    "",
},

billingAddress: {
  name:
    raw.billingAddress?.name ||
    raw.billingAddress?.fullName ||
    raw.shippingAddress?.name ||
    raw.shippingAddress?.fullName ||
    "",

  phone:
    raw.billingAddress?.phone ||
    raw.billingAddress?.phoneNumber ||
    raw.shippingAddress?.phone ||
    raw.shippingAddress?.phoneNumber ||
    "",

  line1:
    raw.billingAddress?.line1 ||
    raw.billingAddress?.addressLine1 ||
    raw.shippingAddress?.line1 ||
    raw.shippingAddress?.addressLine1 ||
    "",

  city:
    raw.billingAddress?.city ||
    raw.shippingAddress?.city ||
    "",

  state:
    raw.billingAddress?.state ||
    raw.shippingAddress?.state ||
    "",

  postalCode:
    raw.billingAddress?.postalCode ||
    raw.shippingAddress?.postalCode ||
    "",

  country:
    raw.billingAddress?.country ||
    raw.shippingAddress?.country ||
    "",
},
    /*
    |----------------------------------------------------------------
    | TOTAL FALLBACKS
    |----------------------------------------------------------------
    */

    totals: raw.totals,

subtotal: Number(raw.totals?.subtotal ?? 0),

tax: Number(raw.totals?.tax ?? 0),

shippingCharge: Number(raw.totals?.shippingCharge ?? 0),

grandTotal: Number(raw.totals?.grandTotal ?? 0),

totalSavings: Number(raw.totals?.totalSavings ?? 0),
  };

  return normalizedOrder;
},

  /*
  |--------------------------------------------------------------------------
  | PROCESS ORDER
  |--------------------------------------------------------------------------
  */

  processOrder:
    async (
      id: string
    ): Promise<Order | null> => {
      const res =
        await apiClient.post(
          `/admin/orders/${id}/process`
        );
      return extractData(
        res.data
      );
    },

  /*
  |--------------------------------------------------------------------------
  | SHIP ORDER
  |--------------------------------------------------------------------------
  */

  shipOrder: async (
    id: string,
    payload: {
      trackingId: string;

      courierName: string;
    }
  ): Promise<Order | null> => {
    const res =
      await apiClient.post(
        `/admin/orders/${id}/ship`,
        payload
      );
    return extractNestedData(
      res.data
    );
  },

  /*
  |--------------------------------------------------------------------------
  | DELIVER ORDER
  |--------------------------------------------------------------------------
  */

  deliverOrder:
    async (
      id: string
    ): Promise<Order | null> => {
      const res =
        await apiClient.post(
          `/admin/orders/${id}/deliver`
        );
      return extractData(
        res.data
      );
    },

  /*
  |--------------------------------------------------------------------------
  | REFUND ORDER
  |--------------------------------------------------------------------------
  */

  refundOrder:
    async (
      id: string
    ): Promise<Order | null> => {
      const res =
        await apiClient.post(
          `/admin/orders/${id}/refund`
        );

      return extractData(
        res.data
      );
    },
};