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
  MoreVertical,
} from "lucide-react";

import { Card } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";

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
  const hasDropdownActions =
    order.status === "PENDING_PAYMENT" ||
    canCancel;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div
        className="
          relative
          overflow-visible
          rounded-2xl
          border border-teal-100
          bg-gradient-to-br
          from-teal-50
          via-white
          to-cyan-50
          p-4
          sm:p-5
          shadow-sm
        "
      >
        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-teal-100/40 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="mb-2 inline-flex max-w-full rounded-full bg-teal-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white sm:text-[11px]">
              Order Details
            </p>

            <h1 className="break-all text-xl font-black tracking-tight text-black sm:text-2xl">
              {order.orderNumber}
            </h1>

            <p className="mt-1 text-xs text-black/60 sm:text-sm">
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

          <div className="relative z-20 flex w-full flex-nowrap items-center gap-2 md:w-auto md:flex-wrap md:gap-3">
  {/* MAKE PAYMENT - LEFT OF STATUS */}
  {order.status === "PENDING_PAYMENT" && (
    <Button
      onClick={() =>
        router.push(`/checkout/payment?orderId=${order.id}`)
      }
      className="
  order-1
  min-w-0
  flex-1
  rounded-xl
  bg-teal-600
  px-4
  font-semibold
  text-white
  shadow-sm
  hover:bg-teal-700
  sm:w-auto
  sm:flex-none
  md:order-none
"
    >
      Make Payment
    </Button>
  )}

  {/* ORDER STATUS */}
  <div className="order-2 md:order-none">
    <OrderStatusBadge status={order.status} />
  </div>

  {/* REQUEST RETURN */}
  {canRequestReturn && (
    <Button
      onClick={onRequestReturn}
      className="
        order-3
        w-full
        rounded-xl
        bg-amber-600
        px-4
        hover:bg-amber-700
        sm:w-auto
        md:order-none
      "
    >
      Request Return
    </Button>
  )}

  {/* RETURN REQUESTED */}
  {hasReturnRequest && (
    <Button
      disabled
      className="
        order-3
        w-full
        cursor-not-allowed
        rounded-xl
        bg-amber-100
        px-4
        text-amber-700
        hover:bg-amber-100
        sm:w-auto
        md:order-none
      "
    >
      {order.returnRequest.type === "REPLACEMENT"
        ? "Replacement Requested"
        : "Refund Requested"}
    </Button>
  )}

  {/* 3-DOT MENU - CANCEL ONLY */}
  {canCancel && (
    <div className="relative order-4 inline-flex shrink-0 items-center justify-center md:order-none">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-gray-100
              p-0
              text-black/70
              hover:bg-black/5
            "
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="
            z-50
            mt-2
            w-48
            rounded-xl
            border
            border-gray-100
            bg-white
            p-1
            shadow-lg
          "
        >
          {/* CANCEL ORDER */}
          <DropdownMenuItem
            onClick={onCancel}
            className="
              flex
              cursor-pointer
              items-center
              gap-2
              rounded-lg
              px-3
              py-2
              text-sm
              font-semibold
              text-red-600
              hover:bg-red-50
            "
          >
            <XCircle className="h-4 w-4" />
            Cancel Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )}
</div>
        </div>
      </div>

      {order?.returnRequest && (
        <Card className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm sm:p-5">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 sm:h-12 sm:w-12">
              <Wallet className="h-5 w-5 text-amber-600 sm:h-6 sm:w-6" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="break-words text-base font-bold text-black sm:text-lg">
                {order.returnRequest.type ===
                "REPLACEMENT"
                  ? "Replacement Requested"
                  : "Refund Requested"}
              </h3>

              <p className="mt-1 break-words text-sm text-black/60">
                Status:{" "}
                <span className="font-semibold">
                  {order.returnRequest.status}
                </span>
              </p>

              <p className="mt-1 break-words text-sm text-black/60">
                Reason:{" "}
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
          <Card className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-5 flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-base font-bold text-black sm:text-lg">
                  Order Tracking
                </h2>

                <p className="mt-1 text-xs text-black/60 sm:text-sm">
                  Live order progress
                </p>
              </div>

              <div className="shrink-0 rounded-full bg-teal-600 px-2.5 py-1 text-[10px] font-semibold text-white sm:px-3 sm:text-xs">
                {order.status}
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-5 h-1 w-full rounded-full bg-gray-200" />

              <div
                className="
                  absolute
                  left-0
                  top-5
                  h-1
                  rounded-full
                  bg-gradient-to-r
                  from-teal-500
                  to-cyan-500
                  transition-all
                  duration-500
                "
                style={{
                  width: `${
                    (currentStepIndex /
                      (orderSteps.length - 1)) *
                    100
                  }%`,
                }}
              />

              <div className="relative grid grid-cols-3 gap-1 sm:gap-3">
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
                        className="flex min-w-0 flex-col items-center text-center"
                      >
                        <div
                          className={`
                            relative
                            z-10
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            border-4
                            bg-white
                            transition-all
                            duration-300
                            sm:h-10
                            sm:w-10
                            ${
                              active
                                ? "border-teal-500 text-teal-600 shadow-md"
                                : "border-gray-200 text-gray-400"
                            }
                          `}
                        >
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>

                        <p
                          className={`
                            mt-2
                            max-w-full
                            break-words
                            text-[10px]
                            font-semibold
                            leading-tight
                            sm:text-xs
                            ${
                              active
                                ? "text-black"
                                : "text-black/40"
                            }
                          `}
                        >
                          {step.label}
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
        <Card className="rounded-2xl border border-red-100 bg-red-50/40 p-4 shadow-sm sm:p-5">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-100 sm:h-12 sm:w-12">
              <XCircle className="h-5 w-5 text-red-600 sm:h-6 sm:w-6" />
            </div>

            <div className="min-w-0">
              <h3 className="break-words text-base font-bold text-black sm:text-lg">
                Order Cancelled
              </h3>

              <p className="mt-1 break-words text-sm text-black/60">
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

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
        {/* ========================= */}
        {/* ITEMS */}
        {/* ========================= */}

        <Card className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm sm:p-5 lg:col-span-2">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-black sm:text-xl">
              Order Items
            </h3>

            <p className="mt-1 text-xs text-black/60 sm:text-sm">
              {order?.items?.length}{" "}
              items in this order
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {order?.items?.map(
              (item: any) => {
                const image =
                  item?.variant
                    ?.images?.main;

                return (
                  <div
                    key={item.id}
                    className="
                      flex
                      min-w-0
                      gap-3
                      rounded-2xl
                      border
                      border-teal-100
                      bg-teal-50/20
                      p-3
                      transition-all
                      duration-300
                      hover:border-teal-200
                      sm:gap-4
                      sm:p-4
                    "
                  >
                    {/* IMAGE */}

                    <div
                      className="
                        relative
                        h-20
                        w-20
                        shrink-0
                        overflow-hidden
                        rounded-xl
                        border
                        border-teal-100
                        bg-gray-100
                        sm:h-24
                        sm:w-24
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
                        sizes="(max-width: 640px) 80px, 96px"
                      />
                    </div>

                    {/* INFO */}

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="min-w-0">
                        <h4 className="break-words text-sm font-bold leading-snug text-black sm:text-base">
                          {item.productName}
                        </h4>

                        <p className="mt-1 break-words text-xs text-black/60 sm:text-sm">
                          {
                            item
                              ?.variant
                              ?.name
                          }
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="rounded-full bg-teal-600 px-2 py-1 text-[10px] font-semibold text-white sm:px-2.5 sm:text-[11px]">
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
                            <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700 sm:px-2.5 sm:text-[11px]">
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

                      <div className="mt-3 sm:mt-4">
                        <p className="break-all text-lg font-black text-black sm:text-xl">
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

        <div className="space-y-4 sm:space-y-5">
          {/* SUMMARY */}

          <Card className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-5">
              <h3 className="text-base font-bold text-black sm:text-lg">
                Order Summary
              </h3>

              <p className="mt-1 text-xs text-black/60 sm:text-sm">
                Payment details
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex min-w-0 items-center justify-between gap-3 text-black/70">
                <span>
                  Subtotal
                </span>

                <span className="shrink-0 font-semibold">
                  ₹
                  {
                    order?.totals
                      ?.subtotal
                  }
                </span>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-3 text-black/70">
                <span>
                  Shipping
                </span>

                <span className="shrink-0 font-semibold">
                  ₹
                  {
                    order?.totals
                      ?.shippingCharge
                  }
                </span>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-3 text-black/70">
                <span>Tax</span>

                <span className="shrink-0 font-semibold">
                  ₹
                  {
                    order?.totals
                      ?.tax
                  }
                </span>
              </div>

              <Separator />

              <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl bg-teal-50 p-3">
                <span className="font-bold text-black">
                  Grand Total
                </span>

                <span className="shrink-0 text-lg font-black text-teal-600 sm:text-xl">
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

          <Card className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4">
              <h3 className="text-base font-bold text-black sm:text-lg">
                Shipping Address
              </h3>

              <p className="mt-1 text-xs text-black/60 sm:text-sm">
                Delivery details
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-3 text-xs text-black/70 sm:p-4 sm:text-sm">
              <p className="break-words font-bold text-black">
                {
                  order
                    ?.shippingAddress
                    ?.name
                }
              </p>

              <div className="mt-2 space-y-1">
                <p className="break-words">
                  {
                    order
                      ?.shippingAddress
                      ?.line1
                  }
                </p>

                <p className="break-words">
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

                <p className="break-words">
                  {
                    order
                      ?.shippingAddress
                      ?.country
                  }
                </p>

                <p className="break-words pt-2 font-medium text-black">
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