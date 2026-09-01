"use client";

import React, { useState, useEffect } from "react";
import { X, MessageSquare, Plus, Minus, CheckCircle, ArrowRight } from "lucide-react";
import { useBulkOrderModalStore } from "../store/bulk-order-modal.store";
import { openBulkOrderWhatsApp } from "../utils/bulk-order.utils";
import { MAX_CART_ITEM_QUANTITY, DEFAULT_BULK_ORDER_QUANTITY } from "../constants/bulk-order.constants";

export function BulkOrderDialog() {
  const {
    isOpen,
    productName,
    variantName,
    attributes,
    sellingPrice,
    image,
    productSlug,
    requestedQuantity: initialQuantity,
    closeBulkOrderModal,
  } = useBulkOrderModalStore();

  const [quantity, setQuantity] = useState<number>(DEFAULT_BULK_ORDER_QUANTITY);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setQuantity(initialQuantity || DEFAULT_BULK_ORDER_QUANTITY);
      setError("");
    }
  }, [isOpen, initialQuantity]);

  if (!isOpen) return null;

  const handleQuantityChange = (val: number) => {
    setQuantity(val);
    if (val <= MAX_CART_ITEM_QUANTITY) {
      setError(`Bulk orders require more than ${MAX_CART_ITEM_QUANTITY} units. For 1-${MAX_CART_ITEM_QUANTITY} units, please use normal cart.`);
    } else {
      setError("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.trim();
    if (rawVal === "") {
      setQuantity(0);
      setError(`Please enter a quantity greater than ${MAX_CART_ITEM_QUANTITY}.`);
      return;
    }
    const num = parseInt(rawVal, 10);
    if (isNaN(num)) {
      setError("Please enter a valid numeric quantity.");
      return;
    }
    handleQuantityChange(num);
  };

  const handleIncrement = () => {
    handleQuantityChange(Math.max(quantity || 0, MAX_CART_ITEM_QUANTITY) + 1);
  };

  const handleDecrement = () => {
    if (quantity > MAX_CART_ITEM_QUANTITY + 1) {
      handleQuantityChange(quantity - 1);
    } else {
      handleQuantityChange(MAX_CART_ITEM_QUANTITY + 1);
    }
  };

  const handleQuickAdd = (amount: number) => {
    handleQuantityChange(Math.max(quantity || 0, MAX_CART_ITEM_QUANTITY) + amount);
  };

  const handleSendWhatsApp = () => {
    if (quantity <= MAX_CART_ITEM_QUANTITY) {
      setError(`Bulk orders require a minimum of ${MAX_CART_ITEM_QUANTITY + 1} units.`);
      return;
    }

    openBulkOrderWhatsApp({
      productName,
      variantName,
      attributes,
      sellingPrice,
      productSlug,
      requestedQuantity: quantity,
    });

    closeBulkOrderModal();
  };

  const isQuantityValid = quantity > MAX_CART_ITEM_QUANTITY;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      aria-labelledby="bulk-order-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeBulkOrderModal}
      />

      {/* Dialog Container */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100 max-h-[92vh] flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-white px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-sm shadow-emerald-200">
              <MessageSquare className="h-5 w-5 fill-current text-white" />
            </div>
            <div>
              <h3 id="bulk-order-title" className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                Bulk Purchase Notice
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                For quantities of 6 units or more
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeBulkOrderModal}
            aria-label="Close bulk order dialog"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Informational Banner */}
          <div className="rounded-xl border border-teal-100 bg-teal-50/70 p-3 sm:p-3.5 text-xs sm:text-sm text-teal-900 leading-relaxed">
            <span className="font-semibold text-teal-950">Need to Order More:</span> Contact our team for special bulk pricing, customized quotations, and priority dispatch.
          </div>

          {/* Product Summary Card */}
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/70 p-3">
            {image ? (
              <img
                src={image}
                alt={productName}
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg object-contain bg-white border border-gray-200 shrink-0 p-1"
              />
            ) : (
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-lg bg-gray-200 text-gray-400 shrink-0 text-xs">
                No image
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2">
                {productName}
              </h4>
              {variantName && variantName !== productName && (
                <p className="text-[11px] sm:text-xs text-teal-700 font-medium mt-0.5">
                  Variant: {variantName}
                </p>
              )}
              {sellingPrice && sellingPrice > 0 ? (
                <p className="text-xs font-semibold text-gray-700 mt-1">
                  Unit Price: ₹{sellingPrice.toLocaleString("en-IN")}
                </p>
              ) : null}
            </div>
          </div>

          {/* Quantity Selector Section */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs sm:text-sm font-semibold text-gray-800">
              Desired Bulk Quantity:
            </label>

            <div className="flex items-center gap-3">
              <div className="flex h-11 items-center overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= MAX_CART_ITEM_QUANTITY + 1}
                  className="flex h-full w-11 items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  min={MAX_CART_ITEM_QUANTITY + 1}
                  value={quantity === 0 ? "" : quantity}
                  onChange={handleInputChange}
                  className="h-full w-16 sm:w-20 border-x border-gray-300 text-center font-bold text-gray-900 text-base sm:text-lg focus:outline-none focus:bg-teal-50/40"
                />
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="flex h-full w-11 items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[10, 20, 50, 100].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleQuantityChange(preset)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                      quantity === preset
                        ? "bg-teal-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Validation Error Message */}
            {error && (
              <p className="text-xs font-medium text-red-600 pt-0.5">
                {error}
              </p>
            )}
          </div>

          {/* Benefits */}
          <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600 space-y-1.5">
            <div className="flex items-center gap-2 text-gray-800 font-medium">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span>Special B2B & wholesale pricing rates</span>
            </div>
            <div className="flex items-center gap-2 text-gray-800 font-medium">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span>GST invoice & customized shipping arrangements</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 border-t border-gray-100 bg-gray-50 px-4 py-3 sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={closeBulkOrderModal}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSendWhatsApp}
            disabled={!isQuantityValid}
            className="flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-100 hover:bg-[#20bd5a] active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageSquare className="h-4 w-4 fill-current" />
            <span>Contact Our Team</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
