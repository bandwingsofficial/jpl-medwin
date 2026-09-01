export type CheckoutStatus = "ACTIVE" | "EXPIRED" | "COMPLETED" | "FAILED";

export interface CheckoutCustomer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
}

export interface CheckoutTotals {
  subtotal: number;
  shippingCharge: number;
  overweightDeliveryCharge: number;
  couponDiscount: number;
  rewardDiscount: number;
  rewardCoinsUsed: number;
  tax: number;
  grandTotal: number;
  totalSavings: number;
}

export interface CheckoutItem {
  id: string;
  checkoutSessionId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string | null;
  sku: string | null;
  imageUrl: string | null;
  quantity: number;
  unitPrice: number;
  mrp: number;
  totalPrice: number;
  mrpTotal: number;
  discount: number;
  isOverweight?: boolean;
  weightKg?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutSessionSummary {
  id: string;
  cartId: string;
  userId: string | null;
  guestId: string | null;
  status: CheckoutStatus;
  rawStatus: CheckoutStatus;
  isExpired: boolean;
  couponCode: string | null;
  customer: CheckoutCustomer;
  totalProducts: number;
  totalQuantity: number;
  totals: CheckoutTotals;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface CheckoutSessionDetail {
  id: string;
  cartId: string;
  userId: string | null;
  guestId: string | null;
  status: CheckoutStatus;
  rawStatus: CheckoutStatus;
  isExpired: boolean;
  couponCode: string | null;
  customer: CheckoutCustomer;
  items: CheckoutItem[];
  summary: {
    totalProducts: number;
    totalQuantity: number;
    subtotal: number;
    shippingCharge: number;
    overweightDeliveryCharge: number;
    couponDiscount: number;
    rewardCoinsUsed: number;
    rewardDiscount: number;
    tax: number;
    totalSavings: number;
    grandTotal: number;
  };
  hasCompletedOrder: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CheckoutsResponse {
  data: CheckoutSessionSummary[];
  pagination: Pagination;
}

export interface GetCheckoutsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  from?: string;
  to?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
