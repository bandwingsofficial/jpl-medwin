/**
 * Generic API Response wrapper to match your backend's
 * { success: boolean, message: string, data: T } structure
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Address structure used in both Shipping and Billing
 */
export interface Address {
  name: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * Individual item within an order
 * Matches your GET /orders/:id items array
 */
export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  sku: string;
  quantity: number;
  price: number;
  mrp: number;
  totalPrice: number;
  totalMrp: number;
  totalSavings: number;
}

/**
 * Financial breakdown of the order
 */
export interface OrderTotals {
  subtotal: number;
  discount: number;
  shippingCharge: number;
  tax: number;
  grandTotal: number;
  totalSavings: number;
}

/**
 * Main Order Entity
 */
export interface Order {
  id: string;
  orderNumber: string;
  status: "PENDING_PAYMENT" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "REFUNDED" | "CANCELLED";
  paymentStatus: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  cartId: string;
  checkoutSessionId: string;
  totals: OrderTotals;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  notes?: {
    customerNote?: string;
  };
  shipment?: {
    shippedAt?: string;
    trackingId?: string;
    courierName?: string;
  };
  refund?: {
    refundedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Payment Response Structure
 * This fixes the 'PaymentResponse' error in your orders.api.ts
 */
export interface PaymentResponse {
  id: string;
  orderId: string;
  provider: "RAZORPAY" | "STRIPE" | "CASH_ON_DELIVERY";
  status: "CREATED" | "SUCCESS" | "FAILED";
  amount: number;
  currency: string;
  providerOrderId: string;
  providerResponse: {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
    notes: Record<string, any>;
  };
  createdAt: string;
}

/**
 * Payload required for verifying a payment
 */
export interface VerifyPaymentPayload {
  paymentId: string;
  providerPaymentId: string;
  providerSignature: string;
}

/**
 * Aliases for specific API return types
 */
export type OrderResponse = ApiResponse<Order>;
export type OrdersListResponse = ApiResponse<Order[]>;
export type PaymentInitResponse = ApiResponse<PaymentResponse>;

/**
 * ============================================================================
 * RETURN / REFUND TYPES
 * ============================================================================
 */

export type ReturnType =
  | "REFUND"
  | "REPLACEMENT";
  
export type ReturnReason =
  | "DAMAGED_PRODUCT"
  | "WRONG_ITEM"
  | "QUALITY_ISSUE"
  | "OTHER";

export type ReturnStatus =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "PICKED_UP"
  | "COMPLETED";

export interface ReturnRequestPayload {
  orderId: string;
  type: ReturnType;
  reason: ReturnReason;
  description?: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  userId: string;
  type: ReturnType;
  reason: ReturnReason;
  status: ReturnStatus;

  approvedAt?: string;
  completedAt?: string;

  pickup?: {
    pickedUpAt?: string;
  };

  metadata?: Record<string, unknown>;

  createdAt: string;
  updatedAt: string;
}

export type ReturnResponse =
  ApiResponse<ReturnRequest>;