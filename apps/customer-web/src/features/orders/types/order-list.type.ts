export interface OrderListItem {
  id: string;

  orderNumber: string;

  status:
    | "PENDING_PAYMENT"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "REFUNDED"
    | "CANCELLED"
    | "CONFIRMED";

  paymentStatus:
    | "PENDING"
    | "SUCCESS"
    | "FAILED"
    | "REFUNDED";

  itemCount: number;

  totalQuantity: number;

  totals: {
    subtotal: number;

    discount: number;

    shippingCharge: number;

    tax: number;

    grandTotal: number;

    totalSavings: number;
  };

  previewItems: {
    id: string;

    productName: string;

    variantName: string;

    imageUrl: string;

    quantity: number;

    totalPrice: number;
  }[];

  createdAt: string;

  updatedAt: string;
}