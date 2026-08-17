import Link from "next/link";

import {
  ChevronRight,
  Package,
  Truck,
  CheckCircle2,
  Wallet,
  XCircle,
} from "lucide-react";

import { OrderListItem as Order } from "../types/order-list.type";

import { Card } from "@/shared/components/ui/card";

import { OrderStatusBadge } from "./order-status-badge";

interface OrderListItemProps {
  order: Order;
}

export const OrderListItem = ({
  order,
}: OrderListItemProps) => {
  /*
  |--------------------------------------------------------------------------
  | SAFE ITEM COUNT
  |--------------------------------------------------------------------------
  |
  */

  const itemCount =
    typeof order.itemCount === "number"
      ? order.itemCount
      : Array.isArray((order as any).items)
        ? (order as any).items.length
        : 0;

  /*
  |--------------------------------------------------------------------------
  | SAFE TOTAL
  |--------------------------------------------------------------------------
  |
  */

  const grandTotal =
    order?.totals?.grandTotal ??
    0;

  /*
  |--------------------------------------------------------------------------
  | STATUS ICON
  |--------------------------------------------------------------------------
  |
  */

  const StatusIcon =
    order.status === "DELIVERED"
      ? CheckCircle2
      : order.status === "SHIPPED"
        ? Truck
        : order.status === "REFUNDED"
          ? Wallet
          : order.status === "CANCELLED"
            ? XCircle
            : Package;

  /*
  |--------------------------------------------------------------------------
  | STATUS COLORS
  |--------------------------------------------------------------------------
  |
  */

  const statusColors =
    order.status === "DELIVERED"
      ? "bg-green-100 text-green-600"
      : order.status === "SHIPPED"
        ? "bg-purple-100 text-purple-600"
        : order.status === "REFUNDED"
          ? "bg-amber-100 text-amber-600"
          : order.status === "CANCELLED"
            ? "bg-red-100 text-red-600"
            : "bg-teal-100 text-teal-600";

  return (
    <Link
      href={`/account/orders/${order.id}`}
      className="block w-full"
    >
      <Card
  className="
    group
    cursor-pointer
    w-full
    rounded-none
    border-0
    border-b
    border-slate-200
    bg-transparent
    p-3
    shadow-none
    transition-all
    duration-300

    sm:rounded-2xl
    sm:border
    sm:border-teal-100
    sm:bg-white
    sm:p-4
    sm:shadow-sm
    sm:hover:border-teal-200
    sm:hover:shadow-md
  "
>
        <div className="flex min-w-0 items-center justify-between gap-2 sm:gap-3">
          {/* ========================= */}
          {/* LEFT CONTENT */}
          {/* ========================= */}
          <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
            {/* STATUS ICON */}
            <div
              className={`
                flex
                h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl
                sm:h-11 sm:w-11
                ${statusColors}
              `}
            >
              <StatusIcon
                size={19}
                className="sm:h-5 sm:w-5"
              />
            </div>

            {/* ORDER INFO */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-black md:text-base">
                {order.orderNumber || "ORD-20..."}
              </p>

              <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-black/60">
                <span className="whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>

                <span className="shrink-0">•</span>

                <span className="whitespace-nowrap">
                  {itemCount}{" "}
                  {itemCount === 1 ? "item" : "items"}
                </span>
              </div>

              {/* CLEAN HORIZONTAL INFOBAR FOR MOBILE */}
              <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2 sm:gap-3 md:hidden">
                <p className="shrink-0 text-sm font-black text-black">
                  ₹{Number(grandTotal).toFixed(2)}
                </p>

                <span
                  className={`
                    max-w-full
                    truncate
                    rounded-full
                    px-2.5 py-0.5
                    text-[10px] font-bold uppercase tracking-wider
                    ${
                      order.paymentStatus === "SUCCESS"
                        ? "bg-green-100 text-green-700"
                        : order.paymentStatus === "REFUNDED"
                          ? "bg-emerald-100 text-emerald-700"
                          : order.paymentStatus === "FAILED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                    }
                  `}
                >
                  {order.paymentStatus || "PENDING"}
                </span>
              </div>
            </div>
          </div>

          {/* ========================= */}
          {/* RIGHT CONTENT */}
          {/* ========================= */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* DESKTOP PRICING & PAYMENT STATUS */}
            <div className="hidden text-right md:block">
              <p className="text-sm font-bold text-black">
                ₹{Number(grandTotal).toFixed(2)}
              </p>

              <div className="mt-1">
                <span
                  className={`
                    rounded-full
                    px-2 py-1
                    text-[10px] font-semibold uppercase
                    ${
                      order.paymentStatus === "SUCCESS"
                        ? "bg-green-100 text-green-700"
                        : order.paymentStatus === "REFUNDED"
                          ? "bg-emerald-100 text-emerald-700"
                          : order.paymentStatus === "FAILED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                    }
                  `}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* FULFILLMENT STATUS (Hidden on Mobile if empty to prevent distortion) */}
            {order.status && (
              <div className="hidden sm:block">
                <OrderStatusBadge status={order.status} />
              </div>
            )}

            {/* ACTION ARROW */}
            <ChevronRight
              className="
                h-5 w-5
                shrink-0
                text-teal-400
                transition-all duration-300
                group-hover:translate-x-1
                group-hover:text-teal-600
                sm:h-5 sm:w-5
              "
            />
          </div>
        </div>
      </Card>
    </Link>
  );
};