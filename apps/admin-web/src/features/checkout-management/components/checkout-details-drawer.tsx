"use client";

import Image from "next/image";
import {
  X,
  Phone,
  Mail,
  User,
  ShoppingBag,
  Package,
  Loader2,
  Calendar,
  Clock,
  Tag,
  ShieldAlert,
  Scale,
  Receipt,
} from "lucide-react";
import { CheckoutSessionDetail } from "../types/checkout.type";
import CheckoutStatusBadge from "./checkout-status-badge";

interface Props {
  open: boolean;
  checkout?: CheckoutSessionDetail | null;
  loading?: boolean;
  onClose: () => void;
}

export default function CheckoutDetailsDrawer({
  open,
  checkout,
  loading,
  onClose,
}: Props) {
  if (!open) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex justify-end">
        {/* OVERLAY */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
          onClick={onClose}
        />
        {/* DRAWER */}
        <div className="relative z-[10000] flex h-full w-full max-w-2xl items-center justify-center bg-white shadow-2xl">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={36} className="animate-spin text-teal-600" />
            <p className="text-sm font-medium text-gray-500">
              Loading checkout details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!checkout) return null;

  const items = Array.isArray(checkout.items) ? checkout.items : [];
  const summary = checkout.summary;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div
        className="
          relative
          z-[10000]
          flex
          h-full
          w-full
          max-w-2xl
          flex-col
          overflow-hidden
          border-l
          border-gray-200
          bg-[#f8fafc]
          shadow-2xl
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
              <ShoppingBag size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">
                  Abandoned Checkout
                </h2>
                <CheckoutStatusBadge
                  status={checkout.status}
                  isExpired={checkout.isExpired}
                />
              </div>
              <p className="font-mono text-xs text-gray-500" title={checkout.id}>
                Ref: {checkout.id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* CUSTOMER INFORMATION CARD */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-3">
              <User size={16} className="text-teal-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Customer Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <span className="text-[11px] font-medium text-gray-400">Name</span>
                <p className="text-sm font-semibold text-gray-800">
                  {checkout.customer?.name || "Customer"}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-medium text-gray-400">Phone Number</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Phone size={13} className="text-gray-400" />
                  <p className="text-xs font-semibold text-gray-800">
                    {checkout.customer?.phone || "No phone provided"}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-medium text-gray-400">Email Address</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Mail size={13} className="text-gray-400" />
                  <p className="text-xs font-semibold text-gray-800">
                    {checkout.customer?.email || "No email available"}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-medium text-gray-400">Customer ID</span>
                <p className="font-mono text-xs font-medium text-gray-600 truncate">
                  {checkout.customer?.id || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* CHECKOUT TIMELINE & METADATA CARD */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-3">
              <Calendar size={16} className="text-teal-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Checkout Timeline
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <span className="text-[11px] font-medium text-gray-400">Initiated At</span>
                <p className="text-xs font-semibold text-gray-800 mt-0.5">
                  {formatDate(checkout.createdAt)}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-medium text-gray-400">Last Activity</span>
                <p className="text-xs font-semibold text-gray-800 mt-0.5">
                  {formatDate(checkout.updatedAt)}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-medium text-gray-400">Session Expiry</span>
                <p className="text-xs font-semibold text-gray-800 mt-0.5">
                  {formatDate(checkout.expiresAt)}
                </p>
              </div>
            </div>

            {checkout.couponCode && (
              <div className="mt-3.5 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-800">
                <Tag size={14} className="text-emerald-600" />
                <span>Coupon Applied: <strong>{checkout.couponCode}</strong></span>
              </div>
            )}
          </div>

          {/* PRODUCTS LIST */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-teal-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Cart Items ({items.length})
                </h3>
              </div>
              <span className="text-xs font-semibold text-gray-500">
                Total Units: {summary.totalQuantity}
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {items.map((item) => {
                const lineTotal = Number(item.totalPrice ?? item.unitPrice * item.quantity);

                return (
                  <div key={item.id} className="flex items-start gap-3 py-3.5 first:pt-1 last:pb-1">
                    {/* PRODUCT IMAGE */}
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <Package size={22} />
                        </div>
                      )}
                    </div>

                    {/* PRODUCT DETAILS */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900 line-clamp-2">
                        {item.productName}
                      </p>

                      {item.variantName && (
                        <p className="mt-0.5 text-[11px] font-medium text-teal-700">
                          Variant: {item.variantName}
                        </p>
                      )}

                      {item.sku && (
                        <p className="text-[10px] text-gray-400 font-mono">
                          SKU: {item.sku}
                        </p>
                      )}

                      {item.weightKg ? (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-500">
                          <Scale size={11} className="text-gray-400" />
                          <span>{item.weightKg} kg</span>
                          {item.isOverweight && (
                            <span className="rounded bg-amber-100 px-1 py-0.2 text-[9px] font-semibold text-amber-800">
                              Overweight
                            </span>
                          )}
                        </div>
                      ) : null}

                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          ₹{Number(item.unitPrice).toLocaleString("en-IN")} × {item.quantity}
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          ₹{lineTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FINANCIAL SUMMARY */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-3">
              <Receipt size={16} className="text-teal-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Checkout Summary
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({summary.totalQuantity} items)</span>
                <span className="font-semibold text-gray-900">
                  ₹{Number(summary.subtotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {Number(summary.shippingCharge) > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Charge</span>
                  <span className="font-semibold text-gray-900">
                    ₹{Number(summary.shippingCharge).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              {Number(summary.overweightDeliveryCharge) > 0 && (
                <div className="flex justify-between text-amber-700 font-medium">
                  <span>Overweight Delivery Charge</span>
                  <span>
                    ₹{Number(summary.overweightDeliveryCharge).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              {Number(summary.couponDiscount) > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount ({checkout.couponCode || "Coupon"})</span>
                  <span>
                    -₹{Number(summary.couponDiscount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              {Number(summary.rewardDiscount) > 0 && (
                <div className="flex justify-between text-indigo-600 font-medium">
                  <span>Reward Coins Discount ({summary.rewardCoinsUsed} coins)</span>
                  <span>
                    -₹{Number(summary.rewardDiscount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              {Number(summary.tax) > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-gray-900">
                    ₹{Number(summary.tax).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              {Number(summary.totalSavings) > 0 && (
                <div className="flex justify-between text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  <span>Total Customer Savings</span>
                  <span className="font-bold">
                    ₹{Number(summary.totalSavings).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-2.5 mt-2.5 flex justify-between text-sm font-bold text-gray-900">
                <span>Grand Total</span>
                <span className="text-base text-teal-700">
                  ₹{Number(summary.grandTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-200 bg-white p-4 text-right">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 active:scale-95"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
