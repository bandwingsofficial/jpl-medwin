"use client";

import { Product } from "@/features/products/types/product.type";
import { CartResponse, CartSummary } from "@/features/cart/types/cart.type";
import { MAX_CART_ITEM_QUANTITY } from "@/features/bulk-order/constants/bulk-order.constants";
import { cartApi } from "@/features/cart/api/cart.api";

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

  async getCart(): Promise<CartResponse> {
    const items = this.readItems();

    const cartItems = items.map((item) => {
      const product = item.product;

      const variant =
        product.variants?.find(
          (currentVariant) =>
            currentVariant.id === item.variantId,
        ) ?? product.variants?.[0];

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

        isOverweight: product.isOverweight,

        weightKg: product.weightKg,

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

    let summary: CartSummary = {
      totalProducts: cartItems.length,
      totalQuantity,
      subtotal,
      mrpTotal: totalMrp,
      productDiscount: totalMrp - subtotal,
      couponDiscount: 0,
      shipping: 0,
      overweightDeliveryCharge: 0,
      tax: 0,
      grandTotal: subtotal,
      savings: totalMrp - subtotal,
    };

    if (cartItems.length > 0) {
      try {
        const payload = items.map((item) => {
          const product = item.product;
          const variant =
            product.variants?.find((v) => v.id === item.variantId) ??
            product.variants?.[0];
          const sellingPrice =
            variant?.pricing?.sellingPrice ?? product.price?.min ?? 0;
          const mrp =
            variant?.pricing?.mrp ?? product.price?.max ?? sellingPrice;

          return {
            productId: product.id,
            variantId: variant?.id ?? item.variantId,
            quantity: item.quantity,
            price: sellingPrice,
            mrp,
            isOverweight: product.isOverweight,
            weightKg: product.weightKg,
          };
        });

        const res = await cartApi.calculateGuestSummary(payload);
        if (res?.summary) {
          summary = {
            ...summary,
            ...res.summary,
          };
        }
      } catch (error) {
        console.warn("Guest cart summary calculation fallback:", error);
      }
    } else {
      summary = {
        totalProducts: 0,
        totalQuantity: 0,
        subtotal: 0,
        mrpTotal: 0,
        productDiscount: 0,
        couponDiscount: 0,
        shipping: 0,
        overweightDeliveryCharge: 0,
        tax: 0,
        grandTotal: 0,
        savings: 0,
      };
    }

    return {
      success: true,

      message: "Guest cart",

      id: "guest-cart",

      status: "ACTIVE",

      totalItems: cartItems.length,

      totalQuantity,

      cartItems,

      summary,

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
      items[index].quantity = Math.min(
        items[index].quantity + quantity,
        MAX_CART_ITEM_QUANTITY,
      );
    } else {
      items.push({
        product,
        variantId,
        quantity: Math.min(quantity, MAX_CART_ITEM_QUANTITY),
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

    item.quantity = Math.min(quantity, MAX_CART_ITEM_QUANTITY);

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