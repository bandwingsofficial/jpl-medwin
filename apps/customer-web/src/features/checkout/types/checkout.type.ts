export interface CheckoutCart {
  id: string;

  status:
    | "ACTIVE"
    | "LOCKED"
    | "CONVERTED";
}

export interface CheckoutItem {
  id: string;

  checkoutSessionId?: string;

  productId: string;

  variantId: string;

  productName: string;

  variantName: string;

  sku: string;

  quantity: number;

  price: number;

  mrp: number;

  totalPrice: number;

  createdAt?: string;

  updatedAt?: string;
}

/*
|--------------------------------------------------------------------------
| CHECKOUT SUMMARY
|--------------------------------------------------------------------------
*/

export interface CheckoutSummary {
  totalProducts: number;

  totalQuantity: number;

  subtotal: number;

  mrpTotal?: number;

  productDiscount?: number;

  couponDiscount: number;

  totalSavings: number;

  shipping: number;

  tax: number;

  grandTotal: number;

  isFreeShipping: boolean;

  /*
   |--------------------------------------------------------------------------
   | REWARD FIELDS
   |--------------------------------------------------------------------------
   */

  rewardDiscount?: number;

  redeemedCoins?: number;

  finalPayableAmount?: number;
}

/*
|--------------------------------------------------------------------------
| CHECKOUT TOTALS
|--------------------------------------------------------------------------
*/

export interface CheckoutTotals {
  subtotal: number;

  discount: number;

  shippingCharge: number;

  tax: number;

  grandTotal: number;

  totalSavings: number;

  /*
   |--------------------------------------------------------------------------
   | OPTIONAL REWARD TOTALS
   |--------------------------------------------------------------------------
   */

  rewardDiscount?: number;

  redeemedCoins?: number;

  finalPayableAmount?: number;
}

/*
|--------------------------------------------------------------------------
| CREATE CHECKOUT SESSION
|--------------------------------------------------------------------------
*/

export interface CreateCheckoutSessionResponse {
  /*
   |--------------------------------------------------------------------------
   | EXACT BACKEND KEY
   |--------------------------------------------------------------------------
   */

  checkoutSessionId: string;

  status:
    | "ACTIVE"
    | "COMPLETED"
    | "EXPIRED";

  expiresAt: string;

  reused: boolean;

  cart?: CheckoutCart;

  items?: CheckoutItem[];

  summary?: CheckoutSummary;

  createdAt?: string;
}

/*
|--------------------------------------------------------------------------
| GET CHECKOUT SESSION
|--------------------------------------------------------------------------
*/

export type CheckoutSession =
  CheckoutSessionResponse;

export interface CheckoutSessionResponse {
  /*
   |--------------------------------------------------------------------------
   | BACKEND GET SESSION ID
   |--------------------------------------------------------------------------
   */

  id: string;

  status:
    | "ACTIVE"
    | "COMPLETED"
    | "EXPIRED";

  isExpired: boolean;

  expiresAt: string;

  remainingMinutes: number;

  cart: CheckoutCart;

  totals: CheckoutTotals;

  items: CheckoutItem[];

  summary: CheckoutSummary;

  /*
   |--------------------------------------------------------------------------
   | OPTIONAL REWARD DATA
   |--------------------------------------------------------------------------
   */

  rewards?: {
    redeemedCoins?: number;

    rewardDiscount?: number;

    finalPayableAmount?: number;
  };

  createdAt: string;

  updatedAt: string;
}

/*
|--------------------------------------------------------------------------
| EXPIRE CHECKOUT SESSION RESPONSE
|--------------------------------------------------------------------------
*/

export interface ExpireCheckoutSessionResponse {
  id: string;

  status: "EXPIRED";

  expiredAt: string;

  cartUnlocked: boolean;
}

/*
|--------------------------------------------------------------------------
| COMPLETE CHECKOUT SESSION RESPONSE
|--------------------------------------------------------------------------
*/

export interface CompleteCheckoutSessionResponse {
  id: string;

  status: "COMPLETED";

  completedAt: string;

  payment: Record<
    string,
    unknown
  >;

  cart: {
    id: string;

    status: "CONVERTED";
  };

  totals: CheckoutTotals;

  /*
   |--------------------------------------------------------------------------
   | OPTIONAL REWARD DATA
   |--------------------------------------------------------------------------
   */

  rewards?: {
    redeemedCoins?: number;

    rewardDiscount?: number;

    finalPayableAmount?: number;
  };

  itemCount: number;

  totalQuantity: number;

  updatedAt: string;
}