"use client";

import { Product } from "@/features/products/types/product.type";
import { CartResponse } from "@/features/cart/types/cart.type";

const STORAGE_KEY = "guest-cart";

export interface GuestCartItem {
  product: Product;
  variantId: string;
  quantity: number;
}

class LocalCartService {
  private readItems(): GuestCartItem[] {
    if (typeof window === "undefined") {
      return [];
    }

    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    try {
      const parsed: unknown = JSON.parse(data);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed as GuestCartItem[];
    } catch {
      return [];
    }
  }

  private saveItems(items: GuestCartItem[]): void {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items),
    );
  }

  /**
   * Public access for guest-cart migration.
   */
  getItems(): GuestCartItem[] {
    return this.readItems();
  }

  getCart(): CartResponse {
    const items = this.readItems();

    const cartItems = items.map((item) => {
      const product = item.product;

      const variant =
        product.variants.find(
          (currentVariant) =>
            currentVariant.id === item.variantId,
        ) ?? product.variants[0];

      const sellingPrice =
        variant?.pricing?.sellingPrice ??
        product.price?.min ??
        0;

      const mrp =
        variant?.pricing?.mrp ??
        product.price?.max ??
        sellingPrice;

      return {
        id: `${product.id}-${variant?.id ?? ""}`,

        cartId: "guest-cart",

        productId: product.id,

        variantId: variant?.id ?? "",

        productName: product.name,

        productSlug: product.slug,

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
              variant?.pricing?.purchasePrice ??
              0,
          },

          stock: {
            available:
              typeof variant?.stock === "number"
                ? variant.stock
                : variant?.stock?.quantity ?? 9999,

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
            sellingPrice * item.quantity,

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
        item.variant.pricing.sellingPrice *
          item.variant.quantity,
      0,
    );

    const totalMrp = cartItems.reduce(
      (total, item) =>
        total +
        item.variant.pricing.mrp *
          item.variant.quantity,
      0,
    );

    const totalQuantity =
      cartItems.reduce(
        (total, item) =>
          total + item.variant.quantity,
        0,
      );

    return {
      success: true,

      message: "Guest cart",

      id: "guest-cart",

      status: "ACTIVE",

      totalItems: cartItems.length,

      totalQuantity,

      cartItems,

      summary: {
        totalProducts:
          cartItems.length,

        totalQuantity,

        subtotal,

        mrpTotal: totalMrp,

        productDiscount:
          totalMrp - subtotal,

        couponDiscount: 0,

        shipping: 0,

        tax: 0,

        grandTotal: subtotal,

        savings:
          totalMrp - subtotal,
      },

      couponCode: undefined,

      appliedCoupon: null,

      lockedAt: undefined,

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),
    };
  }

  addItem(
    product: Product,
    variantId: string,
    quantity = 1,
  ): void {
    const items = this.readItems();

    const index = items.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.variantId === variantId,
    );

    if (index >= 0) {
      items[index].quantity += quantity;
    } else {
      items.push({
        product,
        variantId,
        quantity,
      });
    }

    this.saveItems(items);
  }

  updateQuantity(
    productId: string,
    variantId: string,
    quantity: number,
  ): void {
    const items = this.readItems();

    const item = items.find(
      (currentItem) =>
        currentItem.product.id === productId &&
        currentItem.variantId === variantId,
    );

    if (!item) {
      return;
    }

    if (quantity <= 0) {
      this.removeItem(
        productId,
        variantId,
      );

      return;
    }

    item.quantity = quantity;

    this.saveItems(items);
  }

  removeItem(
    productId: string,
    variantId: string,
  ): void {
    const items = this.readItems().filter(
      (item) =>
        !(
          item.product.id === productId &&
          item.variantId === variantId
        ),
    );

    this.saveItems(items);
  }

  clear(): void {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  }

  getCount(): number {
    return this.readItems().reduce(
      (count, item) =>
        count + item.quantity,
      0,
    );
  }

  hasItems(): boolean {
    return this.readItems().length > 0;
  }
}

export const localCartService =
  new LocalCartService();