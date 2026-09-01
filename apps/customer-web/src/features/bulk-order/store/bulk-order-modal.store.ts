"use client";

import { create } from "zustand";
import { BulkOrderData, BulkOrderModalState } from "../types/bulk-order.types";
import { DEFAULT_BULK_ORDER_QUANTITY } from "../constants/bulk-order.constants";

export const useBulkOrderModalStore = create<BulkOrderModalState>((set) => ({
  isOpen: false,
  productName: "",
  variantName: undefined,
  attributes: undefined,
  productId: undefined,
  variantId: undefined,
  sellingPrice: undefined,
  image: undefined,
  productSlug: undefined,
  requestedQuantity: DEFAULT_BULK_ORDER_QUANTITY,

  openBulkOrderModal: (data: BulkOrderData) => {
    set({
      isOpen: true,
      productName: data.productName || "Medical Product",
      variantName: data.variantName,
      attributes: data.attributes,
      productId: data.productId,
      variantId: data.variantId,
      sellingPrice: data.sellingPrice,
      image: data.image,
      productSlug: data.productSlug,
      requestedQuantity:
        typeof data.requestedQuantity === "number" && data.requestedQuantity > 5
          ? data.requestedQuantity
          : DEFAULT_BULK_ORDER_QUANTITY,
    });
  },

  closeBulkOrderModal: () => {
    set({
      isOpen: false,
    });
  },
}));

/**
 * Helper function to trigger Bulk Order Modal from non-React or standard event handlers.
 */
export const openBulkOrderModal = (data: BulkOrderData) => {
  useBulkOrderModalStore.getState().openBulkOrderModal(data);
};
