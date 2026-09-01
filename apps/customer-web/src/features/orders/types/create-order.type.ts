export interface AddressPayload {
  name: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderPayload {
  checkoutSessionId: string;

  shippingAddressId: string;

  billingAddressId: string;

  isBillingSameAsShipping: boolean;

  customerNote?: string;

  gstNumber?: string;

  paymentMethod:
    | "RAZORPAY"
    | "UPI"
    | "COD";
}