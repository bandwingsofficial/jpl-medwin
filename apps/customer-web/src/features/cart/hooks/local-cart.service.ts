"use client";

import { Product } from "@/features/products/types/product.type";
import { CartResponse } from "@/features/cart/types/cart.type";

const STORAGE_KEY = "guest-cart";

interface GuestCartItem {
  product: Product;
  quantity: number;
}

class LocalCartService {
  private getItems(): GuestCartItem[] {
    if (typeof window === "undefined") {
      return [];
    }

    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data) as GuestCartItem[];
    } catch {
      return [];
    }
  }

  private saveItems(items: GuestCartItem[]) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items)
    );
  }

  getCart(): CartResponse {
    const items = this.getItems();

    const cartItems = items.map((item) => {
      const product = item.product;

      const variant =
        product.variants?.find(
          (v) =>
            v.id === product.defaultVariantId
        ) ??
        product.variants?.[0];

      const sellingPrice =
        variant?.pricing?.sellingPrice ??
        product.price?.min ??
        0;

      const mrp =
        variant?.pricing?.mrp ??
        product.price?.max ??
        sellingPrice;

      return {
  id: product.id,

  cartId: "guest-cart",

  productId: product.id,

  variantId: variant?.id ?? "",

  productName: product.name,

  brandName:
    product.brand?.name ?? "",

  category: {
    main:
      product.category?.main ?? "",

    sub:
      product.category?.sub ?? "",

    mini:
      product.category?.mini ?? "",
  },

  variant: {
    id: variant?.id ?? "",

    name:
      variant?.name ?? "",

    sku:
      variant?.sku ?? "",

    quantity: item.quantity,

    attributes:
      variant?.attributes ?? {},

    pricing: {
      sellingPrice,

      mrp,

      purchasePrice:
        variant?.pricing
          ?.purchasePrice ?? 0,
    },

    stock: {
      available:
        typeof variant?.stock === "number"
          ? variant.stock
          : variant?.stock?.quantity ??
            9999,

      inStock: true,
    },

    images: {
      main:
        variant?.images?.main ??
        product.images?.main ??
        "",
    },
  },

  totals: {
    subtotal:
      sellingPrice *
      item.quantity,

    mrpTotal:
      mrp * item.quantity,

    discount:
      (mrp - sellingPrice) *
      item.quantity,
  },

  createdAt:
    new Date().toISOString(),

  updatedAt:
    new Date().toISOString(),
};
    });

    const subtotal = cartItems.reduce(
      (total, item) =>
        total +
        item.variant.pricing
          .sellingPrice *
          item.variant.quantity,
      0
    );

    const totalMrp = cartItems.reduce(
      (total, item) =>
        total +
        item.variant.pricing.mrp *
          item.variant.quantity,
      0
    );

   return {
  success: true,

  message: "Guest cart",

  id: "guest-cart",

  status: "ACTIVE",

  totalItems: cartItems.length,

  totalQuantity: cartItems.reduce(
    (total, item) =>
      total +
      item.variant.quantity,
    0
  ),

  cartItems,

  summary: {
    totalProducts:
      cartItems.length,

    totalQuantity:
      cartItems.reduce(
        (total, item) =>
          total +
          item.variant.quantity,
        0
      ),

    subtotal,

    mrpTotal:
      totalMrp,

    productDiscount:
      totalMrp -
      subtotal,

    couponDiscount: 0,

    shipping: 0,

    tax: 0,

    grandTotal:
      subtotal,

    savings:
      totalMrp -
      subtotal,
  },

  couponCode:
    undefined,

  appliedCoupon:
    null,

  lockedAt:
    undefined,

  createdAt:
    new Date().toISOString(),

  updatedAt:
    new Date().toISOString(),
};
  }
  addItem(
    product: Product,
    quantity = 1
  ) {
    const items = this.getItems();

    const index = items.findIndex(
      (item) =>
        item.product.id === product.id
    );

    if (index >= 0) {
      items[index].quantity += quantity;
    } else {
      items.push({
        product,
        quantity,
      });
    }

    this.saveItems(items);
  }

  updateQuantity(
    productId: string,
    quantity: number
  ) {
    const items = this.getItems();

    const item = items.find(
      (i) =>
        i.product.id === productId
    );

    if (!item) {
      return;
    }

    item.quantity = quantity;

    this.saveItems(items);
  }

  removeItem(productId: string) {
    const items =
      this.getItems().filter(
        (item) =>
          item.product.id !== productId
      );

    this.saveItems(items);
  }

  clear() {
    localStorage.removeItem(
      STORAGE_KEY
    );
  }

  getCount() {
    return this.getItems().reduce(
      (count, item) =>
        count + item.quantity,
      0
    );
  }
}

export const localCartService =
  new LocalCartService();