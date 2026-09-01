export type PaymentProvider = "RAZORPAY";

export type PaymentStatus =
  | "CREATED"
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface CreatePaymentPayload {
  checkoutSessionId?: string;

  orderId?: string;

  provider: PaymentProvider;

  shippingAddressId?: string;

  billingAddressId?: string;

  isBillingSameAsShipping?: boolean;

  customerNote?: string;

  gstNumber?: string;
}

export interface VerifyPaymentPayload {
  paymentId: string;
  providerPaymentId: string;
  providerSignature: string;
}

export interface Payment {
  id: string;
  orderId?: string;
  checkoutSessionId?: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: string;

  providerOrderId: string;

  providerPaymentId?: string;

  providerSignature?: string;

  authorizedAt?: string;

  capturedAt?: string;

  createdAt: string;

  updatedAt?: string;
  
  providerResponse?: {
    id: string;
    amount: number;
    currency: string;
    entity?: string;
  };
}

export interface CreatePaymentResponse
  extends Payment {
  success: boolean;
  message: string;

  providerResponse?: {
    id: string;
    amount: number;
    currency: string;
  };
}
export interface VerifyPaymentResponse {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  status?: string;
  paymentStatus?: string;
  checkoutSessionId?: string;
  message?: string;
  data?: any;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}