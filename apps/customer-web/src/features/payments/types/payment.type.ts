export type PaymentProvider = "RAZORPAY";

export type PaymentStatus =
  | "CREATED"
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface CreatePaymentPayload {
  orderId: string;

  provider: PaymentProvider;

  redeemedCoins?: number;
}

export interface VerifyPaymentPayload {
  paymentId: string;
  providerPaymentId: string;
  providerSignature: string;
}

export interface Payment {
  id: string;
  orderId: string;
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
  message: string;
  data: Payment;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}