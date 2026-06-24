"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Package,
  Truck,
  Home,
  XCircle,
  Wallet,
  MoreVertical, // Added 3-dot icon
} from "lucide-react";

import { Card } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";
// Imported Dropdown components to hold the actions simply
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import { OrderStatusBadge } from "./order-status-badge";
import { RefundStatusCard } from "./refund-status-card";
import { ShipmentTrackingCard } from "./shipment-tracking-card";

interface Props {
  order: any;
  onCancel?: () => void;
  onRequestReturn?: () => void;
}

export const OrderDetailsView = ({
  order,
  onCancel,
  onRequestReturn,
}: Props) => {
    const router = useRouter();
  /*
  |--------------------------------------------------------------------------
  | ORDER FLOW STEPS
  |--------------------------------------------------------------------------
  */

  const orderSteps = [
    {
      label: "Processing",
      icon: Package,
      key: "PROCESSING",
    },

    {
      label: "Shipped",
      icon: Truck,
      key: "SHIPPED",
    },

    {
      label: "Delivered",
      icon: Home,
      key: "DELIVERED",
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | STEP INDEX
  |--------------------------------------------------------------------------
  */

  const currentStepIndex =
    order.status === "PROCESSING"
      ? 0
      : order.status === "SHIPPED"
      ? 1
      : order.status === "DELIVERED"
      ? 2
      : 0;

  /*
  |--------------------------------------------------------------------------
  | FLAGS
  |--------------------------------------------------------------------------
  */

  // 🔥 FIX: Removed 'PROCESSING' status from this condition so the cancel button is hidden during warehouse processing
  const canCancel =
    order.status === "PENDING_PAYMENT" || 
    order.status === "PENDING";

  const isRefunded =
    order.status === "REFUNDED";

  const isCancelled =
    order.status === "CANCELLED";

  const showShipment =
  order.status === "SHIPPED" ||
  order.status === "DELIVERED";

const hasReturnRequest =
  !!order.returnRequest;

const canRequestReturn =
  order.status === "DELIVERED" &&
  !hasReturnRequest;
  
  // Checking if there are any context actions available to show the 3-dot menu icon
  const hasDropdownActions = (order.status === "PENDING_PAYMENT") || canCancel;

  return (
    <div className="space-y-5">
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div
        className="
          relative overflow-visible
          rounded-2xl
          border border-teal-100
          bg-gradient-to-br from-teal-50 via-white to-cyan-50
          p-5
          shadow-sm
        "
      >
        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-teal-100/40 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-teal-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              Order Details
            </p>

            <h1 className="text-2xl font-black tracking-tight text-black">
              {order.orderNumber}
            </h1>

            <p className="mt-1 text-sm text-black/60">
              Placed on{" "}
              {new Date(
                order.createdAt
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-20">
  <OrderStatusBadge
    status={order.status}
  />

  {canRequestReturn && (
    <Button
      onClick={onRequestReturn}
      className="
        rounded-xl
        bg-amber-600
        px-4
        hover:bg-amber-700
      "
    >
      Request Return
    </Button>
  )}

  {hasReturnRequest && (
    <Button
      disabled
      className="
        rounded-xl
        bg-amber-100
        text-amber-700
        px-4
        cursor-not-allowed
        hover:bg-amber-100
      "
    >
      {order.returnRequest.type ===
      "REPLACEMENT"
        ? "Replacement Requested"
        : "Refund Requested"}
    </Button>
  )}

  {/* 3-DOT MENU FOR ACTION BUTTONS */}
  {hasDropdownActions && (
    <div className="relative inline-flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-10 w-10 p-0 flex items-center justify-center rounded-xl text-black/70 bg-gray-100 hover:bg-black/5"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 absolute right-0 top-full mt-2 z-50 rounded-xl p-1 bg-white border border-gray-100 shadow-lg">
          {order.status === "PENDING_PAYMENT" && (
            <DropdownMenuItem
              onClick={() => router.push(`/checkout/payment?orderId=${order.id}`)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-teal-600 cursor-pointer hover:bg-teal-50"
            >
              Make Payment
            </DropdownMenuItem>
          )}
          {canCancel && (
            <DropdownMenuItem
              onClick={onCancel}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 cursor-pointer hover:bg-red-50"
            >
              Cancel Order
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )}
</div>
        </div>
      </div>
{order?.returnRequest && (
  <Card className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
        <Wallet className="h-6 w-6 text-amber-600" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-black">
          {order.returnRequest.type ===
          "REPLACEMENT"
            ? "Replacement Requested"
            : "Refund Requested"}
        </h3>

        <p className="mt-1 text-sm text-black/60">
          Status:
          {" "}
          <span className="font-semibold">
            {order.returnRequest.status}
          </span>
        </p>

        <p className="mt-1 text-sm text-black/60">
          Reason:
          {" "}
          {order.returnRequest.reason}
        </p>
      </div>
    </div>
  </Card>
)}
      {/* ========================= */}
      {/* ORDER TRACKING */}
      {/* ========================= */}

      {!isCancelled &&
        !isRefunded && (
          <Card className="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-black">
                  Order Tracking
                </h2>

                <p className="mt-1 text-sm text-black/60">
                  Live order progress
                </p>
              </div>

              <div className="rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white">
                {order.status}
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-0 top-5 h-1 w-full rounded-full bg-gray-200" />

              <div
                className="
                  absolute left-0 top-5 h-1
                  rounded-full
                  bg-gradient-to-r
                  from-teal-500 to-cyan-500
                  transition-all duration-500
                "
                style={{
                  width: `${
                    (currentStepIndex /
                      (orderSteps.length -
                        1)) *
                    100
                  }%`,
                }}
              />

              <div className="relative grid grid-cols-3 gap-3">
                {orderSteps.map(
                  (
                    step,
                    index
                  ) => {
                    const Icon =
                      step.icon;

                    const active =
                      index <=
                      currentStepIndex;

                    return (
                      <div
                        key={step.key}
                        className="flex flex-col items-center text-center"
                      >
                        <div
                          className={`
                          relative z-10
                          flex h-10 w-10 items-center justify-center
                          rounded-full border-4 bg-white
                          transition-all duration-300
                          ${
                            active
                              ? "border-teal-500 text-teal-600 shadow-md"
                              : "border-gray-200 text-gray-400"
                          }
                        `}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <p
                          className={`
                          mt-2 text-xs font-semibold
                          ${
                            active
                              ? "text-black"
                              : "text-black/40"
                          }
                        `}
                        >
                          {
                            step.label
                          }
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </Card>
        )}

      {/* ========================= */}
      {/* CANCELLED */}
      {/* ========================= */}

      {isCancelled && (
        <Card className="rounded-2xl border border-red-100 bg-red-50/40 p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-black">
                Order Cancelled
              </h3>

              <p className="mt-1 text-sm text-black/60">
                This order has been cancelled successfully.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* ========================= */}
      {/* REFUNDED */}
      {/* ========================= */}

      {isRefunded && (
        <RefundStatusCard
          refundedAt={
            order?.refund
              ?.refundedAt
          }
        />
      )}

      {/* ========================= */}
      {/* SHIPMENT */}
      {/* ========================= */}

      {showShipment && (
        <ShipmentTrackingCard
          trackingId={
            order?.shipment
              ?.trackingId
          }
          courierName={
            order?.shipment
              ?.courierName
          }
          shippedAt={
            order?.shipment
              ?.shippedAt
          }
        />
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        {/* ========================= */}
        {/* ITEMS */}
        {/* ========================= */}

        <Card className="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-5">
            <h3 className="text-xl font-bold text-black">
              Order Items
            </h3>

            <p className="mt-1 text-sm text-black/60">
              {
                order?.items
                  ?.length
              }{" "}
              items in this order
            </p>
          </div>

          <div className="space-y-4">
            {order?.items?.map(
              (item: any) => {
                const image =
                  item?.variant
                    ?.images?.main;

                return (
                  <div
                    key={item.id}
                    className="
                      flex gap-4
                      rounded-2xl
                      border border-teal-100
                      bg-teal-50/20
                      p-4
                      transition-all duration-300
                      hover:border-teal-200
                    "
                  >
                    {/* IMAGE */}

                    <div
                      className="
                        relative
                        h-24 w-24
                        shrink-0 overflow-hidden
                        rounded-xl
                        border border-teal-100
                        bg-gray-100
                      "
                    >
                      <Image
                        src={
                          image ||
                          "/placeholder.png"
                        }
                        alt={
                          item.productName
                        }
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    {/* INFO */}

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h4 className="text-base font-bold text-black">
                          {
                            item.productName
                          }
                        </h4>

                        <p className="mt-1 text-sm text-black/60">
                          {
                            item
                              ?.variant
                              ?.name
                          }
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-teal-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                            Qty:{" "}
                            {
                              item
                                ?.variant
                                ?.quantity
                            }
                          </span>

                          {item?.totals
                            ?.discount >
                            0 && (
                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                              Saved ₹
                              {
                                item
                                  ?.totals
                                  ?.discount
                              }
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-xl font-black text-black">
                          ₹
                          {
                            item
                              ?.totals
                              ?.subtotal
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </Card>

        {/* ========================= */}
        {/* RIGHT SIDE */}
        {/* ========================= */}

        <div className="space-y-5">
          {/* SUMMARY */}

          <Card className="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-black">
                Order Summary
              </h3>

              <p className="mt-1 text-sm text-black/60">
                Payment details
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-black/70">
                <span>
                  Subtotal
                </span>

                <span className="font-semibold">
                  ₹
                  {
                    order?.totals
                      ?.subtotal
                  }
                </span>
              </div>

              <div className="flex items-center justify-between text-black/70">
                <span>
                  Shipping
                </span>

                <span className="font-semibold">
                  ₹
                  {
                    order?.totals
                      ?.shippingCharge
                  }
                </span>
              </div>

              <div className="flex items-center justify-between text-black/70">
                <span>Tax</span>

                <span className="font-semibold">
                  ₹
                  {
                    order?.totals
                      ?.tax
                  }
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between rounded-xl bg-teal-50 p-3">
                <span className="font-bold text-black">
                  Grand Total
                </span>

                <span className="text-xl font-black text-teal-600">
                  ₹
                  {
                    order?.totals
                      ?.grandTotal
                  }
                </span>
              </div>
            </div>
          </Card>

          {/* ADDRESS */}

          <Card className="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-black">
                Shipping Address
              </h3>

              <p className="mt-1 text-sm text-black/60">
                Delivery details
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 text-sm text-black/70">
              <p className="font-bold text-black">
                {
                  order
                    ?.shippingAddress
                    ?.name
                }
              </p>

              <div className="mt-2 space-y-1">
                <p>
                  {
                    order
                      ?.shippingAddress
                      ?.line1
                  }
                </p>

                <p>
                  {
                    order
                      ?.shippingAddress
                      ?.city
                  }
                  ,{" "}
                  {
                    order
                      ?.shippingAddress
                      ?.state
                  }{" "}
                  -{" "}
                  {
                    order
                      ?.shippingAddress
                      ?.postalCode
                  }
                </p>

                <p>
                  {
                    order
                      ?.shippingAddress
                      ?.country
                  }
                </p>

                <p className="pt-2 font-medium text-black">
                  Phone:{" "}
                  {
                    order
                      ?.shippingAddress
                      ?.phone
                  }
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};