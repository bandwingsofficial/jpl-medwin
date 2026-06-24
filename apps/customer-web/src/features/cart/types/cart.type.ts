import { AppliedCoupon } from "./coupon.type";

export interface CartSummary {
  totalProducts: number;

  totalQuantity: number;

  subtotal: number;

  mrpTotal: number;

  productDiscount: number;

  /**
   * COUPON DISCOUNT
   */
  couponDiscount: number;

  shipping: number;

  tax: number;

  grandTotal: number;

  savings: number;
}

export interface CartItemVariant {
  id: string;

  name: string;

  sku: string;

  quantity: number;

  attributes: Record<string, string>;

  pricing: {
    sellingPrice: number;

    mrp: number;

    purchasePrice: number;
  };

  stock: {
    available: number;

    inStock: boolean;
  };

  images: {
    main: string;
  };
}

export interface CartItem {
  id: string;

  cartId: string;

  productId: string;

  variantId: string;

  productName: string;

  brandName: string;

  category: {
    main: string;

    sub: string;

    mini: string;
  };

  variant: CartItemVariant;

  totals: {
    subtotal: number;

    mrpTotal: number;

    discount: number;
  };

  createdAt: string;

  updatedAt: string;
}

export interface Cart {
  id: string;

  status:
    | "ACTIVE"
    | "LOCKED"
    | "CONVERTED";

  totalItems: number;

  totalQuantity: number;

  cartItems: CartItem[];

  summary: CartSummary;

  /**
   * LEGACY SUPPORT
   */
  couponCode?: string;

  /**
   * APPLIED COUPON
   */
  appliedCoupon?:
    | AppliedCoupon
    | null;

  lockedAt?: string;

  createdAt: string;

  updatedAt: string;
}

export interface CartResponse extends Cart {
  success: boolean;
  message: string;
}