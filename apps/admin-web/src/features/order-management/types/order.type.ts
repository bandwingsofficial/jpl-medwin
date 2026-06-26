export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "REFUNDED"
  | "CANCELLED"
  | "CONFIRMED"
  | "RETURNED";

export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED";

export interface OrderAddress {
  name: string;
phoneNumber: string;
  fullName: string;
  phone: string;

  line1: string;

  city: string;

  state: string;

  postalCode: string;

  country: string;
}

/*
|--------------------------------------------------------------------------
| ORDER ITEM
|--------------------------------------------------------------------------
*/

export interface OrderItem {
  id: string;

  productId?: string;

  variantId?: string;

  productName?: string;

  quantity?: number;

  /*
  |--------------------------------------------------------------------------
  | DIRECT PRICE STRUCTURE
  |--------------------------------------------------------------------------
  */

  price?: number;

  mrp?: number;

  totalPrice?: number;

  totalMrp?: number;

  totalSavings?: number;

  /*
  |--------------------------------------------------------------------------
  | BACKEND NESTED STRUCTURE SUPPORT
  |--------------------------------------------------------------------------
  */

  variant?: {
    id?: string;

    name?: string;

    sku?: string;

    quantity?: number;

    pricing?: {
      sellingPrice?: number;

      mrp?: number;
    };

    images?: {
      main?: string;
    };
  };

  totals?: {
    subtotal?: number;

    mrpTotal?: number;

    discount?: number;
  };
}

/*
|--------------------------------------------------------------------------
| ORDER SUMMARY
|--------------------------------------------------------------------------
*/

export interface OrderSummary {
  totalProducts?: number;

  totalQuantity?: number;

  subtotal?: number;

  mrpTotal?: number;

  productDiscount?: number;

  couponDiscount?: number;

  totalSavings?: number;

  shipping?: number;

  tax?: number;

  grandTotal?: number;

  isFreeShipping?: boolean;
}

/*
|--------------------------------------------------------------------------
| MAIN ORDER
|--------------------------------------------------------------------------
*/

export interface Order {
 totals?: {
  subtotal: number;

  couponDiscount: number;

  shippingCharge: number;

  tax: number;

  grandTotal: number;

  totalSavings: number;

  redeemedCoins: number;

  redeemedAmount: number;

  earnedCoins: number;
};
  id: string;

  orderNumber: string;

  status: OrderStatus;

  paymentStatus: PaymentStatus;

  cartId: string;

  checkoutSessionId: string;

  userId: string;

  /*
  |--------------------------------------------------------------------------
  | ITEMS
  |--------------------------------------------------------------------------
  */

  items?: OrderItem[];

  /*
  |--------------------------------------------------------------------------
  | ADDRESSES
  |--------------------------------------------------------------------------
  */

  shippingAddress: OrderAddress;

  billingAddress: OrderAddress;

  /*
  |--------------------------------------------------------------------------
  | DIRECT TOTALS
  |--------------------------------------------------------------------------
  */

  subtotal?: number;

  tax?: number;

  discount?: number;

  shippingCharge?: number;

  grandTotal?: number;

  totalSavings?: number;

  redeemedCoins?: number;

  redeemedAmount?: number;

  earnedCoins?: number;

  /*
  |--------------------------------------------------------------------------
  | SUMMARY SUPPORT
  |--------------------------------------------------------------------------
  */

  summary?: OrderSummary;

  /*
  |--------------------------------------------------------------------------
  | SHIPMENT
  |--------------------------------------------------------------------------
  */

  shipment?: {
  trackingId?: string;

  courierName?: string;

  shippedAt?: string;
};

  /*
  |--------------------------------------------------------------------------
  | REFUND
  |--------------------------------------------------------------------------
  */

refund?: Record<string, unknown>;
cancellation?: Record<string, unknown>;
timeline?: {
  createdAt?: string;

  updatedAt?: string;
};
returnRequest?: {
  id?: string;

  status?: string;

  type?: string;

  reason?: string;

  requestedAt?: string;

  replacementOrder?: {
    id?: string;

    orderNumber?: string;

    status?: string;

    createdAt?: string;
  };
};
  /*
  |--------------------------------------------------------------------------
  | NOTES
  |--------------------------------------------------------------------------
  */

  notes?: {
    customerNote?: string;
  };

  /*
  |--------------------------------------------------------------------------
  | META
  |--------------------------------------------------------------------------
  */

  metadata?: Record<
    string,
    any
  >;

  createdAt: string;

  updatedAt: string;
}

/*
|--------------------------------------------------------------------------
| PAGINATION
|--------------------------------------------------------------------------
*/

export interface Pagination {
  total: number;

  page: number;

  limit: number;

  totalPages: number;
}

/*
|--------------------------------------------------------------------------
| API RESPONSE
|--------------------------------------------------------------------------
*/

export interface OrdersResponse {
  orders: Order[];

  pagination: Pagination;
}