"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  CheckCircle2,
  Clock3,
  Copy,
  CreditCard,
  Home,
  Loader2,
  MapPin,
  MoreVertical,
  Package,
  ReceiptText,
  RotateCcw,
  Truck,
  Wallet,
  XCircle,
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

import { useCreatePayment } from "@/features/payments/hooks/useCreatePayment";
import { useRazorpay } from "@/features/payments/hooks/useRazorpay";
import { OrderStatusBadge } from "./order-status-badge";
import { RefundStatusCard } from "./refund-status-card";
import { ShipmentTrackingCard } from "./shipment-tracking-card";

interface OrderAddress {
  id?: string;
  fullName?: string;
  phoneNumber?: string;
  type?: string;
  alias?: string;
  addressLine1?: string;
  addressLine2?: string;
  landmark?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;

  // Backward compatibility
  name?: string;
  phone?: string;
  line1?: string;
}
type OrderStatus =
  | "PENDING_PAYMENT"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "REFUNDED"
  | "CANCELLED"
  | "CONFIRMED";

interface OrderItemVariant {
  id?: string;
  name?: string;
  sku?: string;
  quantity?: number;
  pricing?: {
    sellingPrice?: number;
    mrp?: number;
  };
  images?: {
    main?: string;
  };
}

interface OrderItem {
  id: string;
  orderId?: string;
  productId?: string;
  variantId?: string;
  productName?: string;
  variant?: OrderItemVariant;
  totals?: {
    subtotal?: number;
    mrpTotal?: number;
    discount?: number;
  };
}

interface OrderTotals {
  subtotal?: number;
  couponDiscount?: number;
  shippingCharge?: number;
  overweightDeliveryCharge?: number;
  tax?: number;
  grandTotal?: number;
  totalSavings?: number;
  redeemedCoins?: number;
  redeemedAmount?: number;
  earnedCoins?: number;
}

interface OrderSummary {
  totalProducts?: number;
  totalQuantity?: number;
  subtotal?: number;
  mrpTotal?: number;
  productDiscount?: number;
  couponDiscount?: number;
  rewardDiscount?: number;
  totalSavings?: number;
  shipping?: number;
  overweightDeliveryCharge?: number;
  tax?: number;
  grandTotal?: number;
  isFreeShipping?: boolean;
}

interface Shipment {
  trackingId?: string;
  courierName?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

interface ReturnRequest {
  type?: string;
  status?: string;
  reason?: string;
  createdAt?: string;
}

interface Refund {
  refundedAt?: string;
  amount?: number;
  status?: string;
  reason?: string;
}

interface Cancellation {
  cancelledAt?: string;
  reason?: string;
}

interface OrderMetadata {
  checkoutSessionId?: string;
  paymentMethod?: string;
  [key: string]: any;
}

interface Order {
  success?: boolean;
  message?: string;

  id: string;

  orderNumber?: string;

  status?: OrderStatus;

  paymentStatus?:
    | "PENDING"
    | "SUCCESS"
    | "FAILED"
    | "REFUNDED";

  paymentMethod?: "COD" | "ONLINE" | "RAZORPAY" | "UPI" | string;

  returnRequest?: ReturnRequest | null;

  cartId?: string;

  checkoutSessionId?: string;

  couponCode?: string | null;

  gstNumber?: string | null;

  totals?: OrderTotals;

  shippingAddressId?: string;

  billingAddressId?: string;

  isBillingSameAsShipping?: boolean;

  shippingAddress?: OrderAddress | null;

  billingAddress?: OrderAddress | null;

  shipment?: Shipment | null;

  cancellation?: Cancellation | null;

  refund?: Refund | null;

  notes?: Record<string, string> | null;

  items?: OrderItem[];

  summary?: OrderSummary;

  metadata?: OrderMetadata;

  createdAt?: string;

  updatedAt?: string;
}
interface Props {
  order: Order;
  onCancel?: () => void;
  onRequestReturn?: () => void;
}

const formatCurrency = (value?: number) => {
  return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
};

const formatDate = (
  value?: string,
  includeTime = false
) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString(
    "en-IN",
    includeTime
      ? {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }
      : {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
  );
};

const formatStatus = (value?: string) => {
  if (!value) {
    return "Not available";
  }

  return value
    .split("_")
    .map(
      (item) =>
        item.charAt(0) +
        item.slice(1).toLowerCase()
    )
    .join(" ");
};

const hasObjectValues = (
  value?: object | null
) => {
  if (!value) {
    return false;
  }

  return Object.values(value).some((item) => {
    if (item === null || item === undefined) {
      return false;
    }

    if (
      typeof item === "string" &&
      item.trim() === ""
    ) {
      return false;
    }

    return true;
  });
};
export const OrderDetailsView = ({
  order,
  onCancel,
  onRequestReturn,
}: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isInitiating, setIsInitiating] = useState(false);
  const createPaymentMutation = useCreatePayment();
  const { openRazorpay, isVerifying } = useRazorpay();

  const rawPaymentMethod = (
    order.paymentMethod ||
    order.metadata?.paymentMethod ||
    ""
  ).toUpperCase();

  const isCodOrder =
    rawPaymentMethod === "COD" ||
    (!rawPaymentMethod &&
      order.paymentStatus === "PENDING" &&
      !order.checkoutSessionId);

  const isPaymentPending = order.paymentStatus === "PENDING";
  const isOrderActive =
    order.status !== "CANCELLED" && order.status !== "REFUNDED";

  const canMakePayment = isCodOrder && isPaymentPending && isOrderActive;

  const handleMakePayment = async () => {
    if (isInitiating || isVerifying || createPaymentMutation.isPending) return;

    try {
      setIsInitiating(true);
      const res = await createPaymentMutation.mutateAsync({
        orderId: order.id,
        provider: "RAZORPAY",
      });

      const payment = res;
      if (!payment?.providerOrderId) {
        throw new Error("Failed to initialize payment gateway");
      }

      await openRazorpay({
        paymentId: payment.id,
        orderId: order.id,
        providerOrderId: payment.providerOrderId,
        amount: payment.amount || order.totals?.grandTotal || 0,
        customerName:
          order.shippingAddress?.fullName || order.shippingAddress?.name,
        customerPhone:
          order.shippingAddress?.phoneNumber || order.shippingAddress?.phone,
        onSuccess: async () => {
          setIsInitiating(false);
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["order", order.id] }),
            queryClient.invalidateQueries({ queryKey: ["orders"] }),
          ]);
        },
        onDismiss: () => {
          setIsInitiating(false);
        },
        onFailed: (err) => {
          console.error("Payment failed", err);
          setIsInitiating(false);
        },
      });
    } catch (err) {
      console.error("Error making payment", err);
      setIsInitiating(false);
    }
  };

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

  const canCancel =
    order.status === "PENDING_PAYMENT" ||
    order.status === "CONFIRMED" ||
    order.status === "PROCESSING";

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

  const isDelivered =
    order.status === "DELIVERED";

  const shippingAddress =
    order.shippingAddress;

  const billingAddress =
    order.billingAddress;

  const totalItems =
    order.summary?.totalQuantity ??
    order.items?.reduce(
      (total, item) =>
        total +
        Number(
          item.variant?.quantity ?? 0
        ),
      0
    ) ??
    0;

  const copyToClipboard = (
    value?: string
  ) => {
    if (!value) {
      return;
    }

    navigator.clipboard
      ?.writeText(value)
      .catch(() => undefined);
  };

  const renderAddress = (
    address?: OrderAddress | null
  ) => {
    if (!address) {
      return (
        <p className="text-sm text-black/50">
          Address not available.
        </p>
      );
    }

    const fullName =
      address.fullName ??
      address.name;

    const phoneNumber =
      address.phoneNumber ??
      address.phone;

    const addressLine1 =
      address.addressLine1 ??
      address.line1;

    return (
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {fullName && (
            <p className="break-words font-bold text-black">
              {fullName}
            </p>
          )}

          {address.alias && (
            <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-700">
              {address.alias}
            </span>
          )}

          {address.type && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-black/60">
              {formatStatus(address.type)}
            </span>
          )}
        </div>

        <div className="space-y-1.5 break-words text-sm leading-relaxed text-black/65">
          {addressLine1 && (
            <p>{addressLine1}</p>
          )}

          {address.addressLine2 && (
            <p>{address.addressLine2}</p>
          )}

          {address.landmark && (
            <p>
              <span className="font-semibold text-black">
                Landmark:
              </span>{" "}
              {address.landmark}
            </p>
          )}

          {(address.city ||
            address.state ||
            address.postalCode) && (
            <p>
              {[
                address.city,
                address.state,
              ]
                .filter(Boolean)
                .join(", ")}
              {address.postalCode
                ? ` - ${address.postalCode}`
                : ""}
            </p>
          )}

          {address.country && (
            <p>{address.country}</p>
          )}

          {phoneNumber && (
            <p className="pt-1 font-medium text-black">
              Phone: {phoneNumber}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-5">
      {/* ========================= */}
{/* HEADER */}
{/* ========================= */}

<div
  className="
    relative
    overflow-hidden
    rounded-2xl
    border
    border-teal-100
    bg-gradient-to-br
    from-teal-50
    via-white
    to-cyan-50
    p-4
    shadow-sm
    sm:p-5
  "
>
  {/* Background Glow Effect */}
  <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-teal-100/40 blur-3xl pointer-events-none" />

  <div
    className="
      relative
      z-10
      flex
      flex-col
      gap-4
      lg:flex-row
      lg:items-center
      lg:justify-between
    "
  >

    {/* ========================= */}
    {/* LEFT: ORDER INFORMATION */}
    {/* ========================= */}

    <div className="min-w-0">
      {/* Order Number & Copy Button */}
      <div className="flex min-w-0 flex-wrap items-center gap-2">

        <h1
          className="
            break-all
            text-lg
            font-black
            tracking-tight
            text-black
            sm:text-2xl
          "
        >
          {order.orderNumber}
        </h1>

        {order.orderNumber && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => copyToClipboard(order.orderNumber)}
            className="
              h-8
              w-8
              shrink-0
              rounded-lg
              text-black/50
              hover:bg-teal-50
              hover:text-teal-700
            "
            aria-label="Copy order number"
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Placement Date */}
      <p className="mt-1 text-xs text-black/60 sm:text-sm">
        Placed on{" "}
        {formatDate(order.createdAt)}
      </p>

      {/* Status Indicators (Payment & Delivery) */}
      <div className="mt-3 flex flex-wrap gap-2">

        {/* Payment Status */}
        <span
  className={`
    inline-flex
    items-center
    justify-center
    whitespace-nowrap
    rounded-full
    border
    px-2.5
    py-1
    text-[10px]
    font-semibold
    leading-none
    sm:text-xs
    ${
      order.paymentStatus === "SUCCESS"
        ? "border-green-200 bg-green-50 text-green-700"
        : "border-gray-200 bg-white text-black/60"
    }
  `}
>
  <span className="inline-flex items-center leading-none">
    Payment:
  </span>

  <span
    className={`
      ml-1
      inline-flex
      items-center
      leading-none
      ${
        order.paymentStatus === "SUCCESS"
          ? "font-bold text-green-700"
          : "text-black"
      }
    `}
  >
    {formatStatus(order.paymentStatus)}
  </span>
</span>

        {/* Delivered Status */}
        {isDelivered && order.shipment?.deliveredAt && (
          <span
            className="
              rounded-full
              border
              border-green-100
              bg-green-50
              px-2.5
              py-1
              text-[10px]
              font-semibold
              text-green-700
              sm:text-xs
            "
          >
            Delivered{" "}
            {formatDate(order.shipment.deliveredAt)}
          </span>
        )}
         {/* Order Status Badge */}
        <div
          className="
            shrink-0
            lg:flex
            lg:h-10
            lg:items-center
          "
        >
          {order.status && (
            <OrderStatusBadge status={order.status} />
          )}
        </div>
      </div>
    </div>

    {/* ========================= */}
    {/* RIGHT: DESKTOP ACTIONS */}
    {/* ========================= */}

    <div
      className="
        relative
        z-50
        flex
        w-full
        flex-wrap
        items-center
        gap-2
        lg:w-auto
        lg:flex-col
        lg:items-end
        lg:justify-center
      "
    >

      {/* ========================= */}
      {/* MAKE PAYMENT + STATUS */}
      {/* ========================= */}

      <div
        className="
          contents
          lg:flex
          lg:items-center
          lg:justify-end
          lg:gap-2
        "
      >

        {/* Make Payment Button */}
        {canMakePayment && (
          <Button
            onClick={handleMakePayment}
            disabled={
              isInitiating ||
              isVerifying ||
              createPaymentMutation.isPending
            }
            className="
              rounded-xl
              bg-teal-600
              px-3
              py-2
              text-xs
              font-semibold
              text-white
              shadow-sm
              hover:bg-teal-700
              sm:px-4
              sm:text-sm

              lg:h-10
              lg:min-w-[165px]
              lg:px-4
              lg:text-sm
            "
          >
            {isInitiating ||
            isVerifying ||
            createPaymentMutation.isPending ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Processing...
              </span>
            ) : (
              "Make Payment"
            )}
          </Button>
        )}
        
       
      </div>

      {/* ========================= */}
      {/* REQUEST RETURN */}
      {/* ========================= */}

      {canRequestReturn && (
        <Button
          onClick={onRequestReturn}
          className="
            min-h-10
            flex-1
            rounded-xl
            bg-amber-600
            px-4
            text-sm
            text-white
            hover:bg-amber-700
            sm:flex-none

            lg:hidden
          "
        >
          Request Return
        </Button>
      )}

      {/* ========================= */}
      {/* RETURN REQUESTED */}
      {/* ========================= */}

      {hasReturnRequest && (
        <Button
          disabled
          className="
            min-h-10
            flex-1
            cursor-not-allowed
            rounded-xl
            bg-amber-100
            px-4
            text-sm
            text-amber-700
            hover:bg-amber-100
            sm:flex-none

            lg:hidden
          "
        >
          {order.returnRequest?.type === "REPLACEMENT"
            ? "Replacement Requested"
            : "Refund Requested"}
        </Button>
      )}

      {/* ========================= */}
      {/* CANCEL ORDER */}
      {/* ========================= */}

      {canCancel && onCancel && (
        <Button
          variant="outline"
          onClick={onCancel}
          className="
            rounded-xl
            border-red-200
            bg-red-50/60
            px-3
            py-2
            text-xs
            font-semibold
            text-red-600
            shadow-sm
            hover:bg-red-100
            hover:text-red-700
            sm:px-4
            sm:text-sm

            lg:h-10
            lg:min-w-[165px]
            lg:px-4
            lg:text-sm
          "
        >
          Cancel Order
        </Button>
      )}

    </div>
  </div>
</div>

      {/* ========================= */}
      {/* RETURN REQUEST */}
      {/* ========================= */}

      {order.returnRequest && (
        <Card className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm sm:p-5">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 sm:h-12 sm:w-12">
              <RotateCcw className="h-5 w-5 text-amber-600 sm:h-6 sm:w-6" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="break-words text-base font-bold text-black sm:text-lg">
                {order.returnRequest.type ===
                "REPLACEMENT"
                  ? "Replacement Requested"
                  : "Refund Requested"}
              </h3>

              <div className="mt-2 grid gap-1.5 text-sm text-black/65 sm:grid-cols-2">
                <p>
                  Status:{" "}
                  <span className="font-semibold text-black">
                    {formatStatus(
                      order.returnRequest.status
                    )}
                  </span>
                </p>

                {order.returnRequest.createdAt && (
                  <p>
                    Requested:{" "}
                    <span className="font-semibold text-black">
                      {formatDate(
                        order.returnRequest.createdAt,
                        true
                      )}
                    </span>
                  </p>
                )}
              </div>

              {order.returnRequest.reason && (
                <p className="mt-2 break-words text-sm text-black/65">
                  <span className="font-semibold text-black">
                    Reason:
                  </span>{" "}
                  {order.returnRequest.reason}
                </p>
              )}
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
                  Current order progress
                </p>
              </div>

              <div className="shrink-0 rounded-full bg-teal-600 px-2.5 py-1 text-[10px] font-semibold text-white sm:px-3 sm:text-xs">
                {formatStatus(order.status)}
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
                  (step, index) => {
                    const Icon = step.icon;

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
                          {active &&
                          index ===
                            currentStepIndex &&
                          order.status ===
                            "DELIVERED" ? (
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                          ) : (
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                          )}
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

            {(order.shipment?.shippedAt ||
              order.shipment?.deliveredAt) && (
              <div className="mt-5 grid gap-2 border-t border-gray-100 pt-4 sm:grid-cols-2">
                {order.shipment?.shippedAt && (
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-black/45">
                      Shipped At
                    </p>

                    <p className="mt-1 text-sm font-semibold text-black">
                      {formatDate(
                        order.shipment.shippedAt,
                        true
                      )}
                    </p>
                  </div>
                )}

                {order.shipment?.deliveredAt && (
                  <div className="rounded-xl bg-green-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-green-600">
                      Delivered At
                    </p>

                    <p className="mt-1 text-sm font-semibold text-black">
                      {formatDate(
                        order.shipment.deliveredAt,
                        true
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
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

              {order.cancellation?.cancelledAt && (
                <p className="mt-2 text-sm text-black/65">
                  Cancelled on{" "}
                  <span className="font-semibold text-black">
                    {formatDate(
                      order.cancellation.cancelledAt,
                      true
                    )}
                  </span>
                </p>
              )}

              {order.cancellation?.reason && (
                <p className="mt-1 break-words text-sm text-black/65">
                  Reason:{" "}
                  <span className="font-semibold text-black">
                    {order.cancellation.reason}
                  </span>
                </p>
              )}
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
            order.refund?.refundedAt
          }
        />
      )}

      {/* ========================= */}
      {/* SHIPMENT */}
      {/* ========================= */}

      {showShipment && (
        <ShipmentTrackingCard
          trackingId={
            order.shipment?.trackingId
          }
          courierName={
            order.shipment?.courierName
          }
          shippedAt={
            order.shipment?.shippedAt
          }
        />
      )}

      {/* ========================= */}
      {/* ITEMS + SUMMARY */}
      {/* ========================= */}

      <div
  className="
    grid
    gap-4
    lg:grid-cols-3
    lg:items-stretch
    lg:gap-5
    lg:h-[calc(100vh-220px)]
    lg:min-h-0
  "
>
        {/* ITEMS */}

      <Card
  className="
    flex
    min-h-0
    h-full
    flex-col
    rounded-2xl
    border
    border-teal-100
    bg-white
    p-4
    shadow-sm
    sm:p-5
    lg:col-span-2
  "
>
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-black sm:text-xl">
                Order Items
              </h3>

              <p className="mt-1 text-xs text-black/60 sm:text-sm">
                {order.summary?.totalProducts ??
                  order.items?.length ??
                  0}{" "}
                product
                {(order.summary?.totalProducts ??
                  order.items?.length ??
                  0) !== 1
                  ? "s"
                  : ""}{" "}
                • {totalItems} item
                {totalItems !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide space-y-3 sm:space-y-4">
  {order.items?.map(
              (item) => {
                const image =
                  item.variant?.images?.main;

                const quantity =
                  item.variant?.quantity ?? 0;

                const sellingPrice =
                  item.variant?.pricing
                    ?.sellingPrice;

                const mrp =
                  item.variant?.pricing?.mrp;

                const discount =
                  item.totals?.discount ?? 0;

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
                        h-[76px]
                        w-[76px]
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
                          "/Logo/jpl_logo.png"
                        }
                        alt={
                          item.productName ??
                          "Order product"
                        }
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 76px, 96px"
                      />
                    </div>

                    {/* INFO */}

                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 flex-col gap-1">
                        <h4 className="break-words text-sm font-bold leading-snug text-black sm:text-base">
                          {item.productName}
                        </h4>

                        {item.variant?.name && (
                          <p className="break-words text-xs text-black/60 sm:text-sm">
                            {item.variant.name}
                          </p>
                        )}

                        {item.variant?.sku && (
                          <p className="break-all text-[10px] font-medium text-black/45 sm:text-xs">
                            SKU:{" "}
                            {item.variant.sku}
                          </p>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="rounded-full bg-teal-600 px-2 py-1 text-[10px] font-semibold text-white sm:px-2.5 sm:text-[11px]">
                          Qty: {quantity}
                        </span>

                        {discount > 0 && (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700 sm:px-2.5 sm:text-[11px]">
                            Saved{" "}
                            {formatCurrency(
                              discount
                            )}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {mrp &&
                            sellingPrice &&
                            mrp > sellingPrice && (
                              <span className="text-xs text-black/40 line-through sm:text-sm">
                                {formatCurrency(mrp)}
                              </span>
                            )}

                          {sellingPrice && (
                            <span className="text-xs font-semibold text-black/60 sm:text-sm">
                              Unit:{" "}
                              {formatCurrency(
                                sellingPrice
                              )}
                            </span>
                          )}
                        </div>

                        <p className="shrink-0 whitespace-nowrap text-base font-black text-black sm:text-xl">
                          {formatCurrency(
                            item.totals?.subtotal
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
            )}

            {!order.items?.length && (
              <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-black/50">
                No items found for this order.
              </div>
            )}
          </div>
        </Card>

        {/* SUMMARY */}

        <div
  className="
    flex
    min-h-0
    h-full
    flex-col
    space-y-4
    sm:space-y-5
    lg:sticky
    lg:top-4
  "
>
        <Card
  className="
    h-full
    rounded-2xl
    border
    border-teal-100
    bg-white
    p-4
    shadow-sm
    sm:p-5
  "
>
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                <ReceiptText className="h-5 w-5 text-teal-600" />
              </div>

              <div>
                <h3 className="text-base font-bold text-black sm:text-lg">
                  Order Summary
                </h3>

                <p className="mt-1 text-xs text-black/60 sm:text-sm">
                  Complete payment breakdown
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3 text-black/70">
                <span>Subtotal</span>

                <span className="shrink-0 font-semibold">
                  {formatCurrency(
                    order.totals?.subtotal
                  )}
                </span>
              </div>

              {Number(
                order.summary?.productDiscount ??
                  0
              ) > 0 && (
                <div className="flex items-center justify-between gap-3 text-green-700">
                  <span>Product Discount</span>

                  <span className="shrink-0 font-semibold">
                    -
                    {formatCurrency(
                      order.summary
                        ?.productDiscount
                    )}
                  </span>
                </div>
              )}

              {Number(
                order.totals?.couponDiscount ??
                  order.summary
                    ?.couponDiscount ??
                  0
              ) > 0 && (
                <div className="flex items-center justify-between gap-3 text-green-700">
                  <div className="min-w-0">
                    <p>Coupon Discount</p>

                    {order.couponCode && (
                      <p className="mt-0.5 break-all text-[10px] font-medium text-green-600">
                        Code: {order.couponCode}
                      </p>
                    )}
                  </div>

                  <span className="shrink-0 font-semibold">
                    -
                    {formatCurrency(
                      order.totals
                        ?.couponDiscount ??
                        order.summary
                          ?.couponDiscount
                    )}
                  </span>
                </div>
              )}

              {Number(
                order.totals?.redeemedAmount ??
                  order.summary
                    ?.rewardDiscount ??
                  0
              ) > 0 && (
                <div className="flex items-center justify-between gap-3 text-green-700">
                  <span>Reward Discount</span>

                  <span className="shrink-0 font-semibold">
                    -
                    {formatCurrency(
                      order.totals
                        ?.redeemedAmount ??
                        order.summary
                          ?.rewardDiscount
                    )}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 text-black/70">
                <span>Shipping</span>

                <span className="shrink-0 font-semibold">
                  {order.summary?.isFreeShipping
                    ? "FREE"
                    : formatCurrency(
                        order.totals
                          ?.shippingCharge ??
                          order.summary
                            ?.shipping
                      )}
                </span>
              </div>

              {Number(
                order.totals?.overweightDeliveryCharge ??
                  (order as any).summary?.overweightDeliveryCharge ??
                  0
              ) > 0 && (
                <div className="flex items-center justify-between gap-3 text-black/70">
                  <span>Overweight Delivery Charge</span>

                  <span className="shrink-0 font-semibold text-amber-700">
                    +
                    {formatCurrency(
                      order.totals?.overweightDeliveryCharge ??
                        (order as any).summary?.overweightDeliveryCharge
                    )}
                  </span>
                </div>
              )}
              <Separator />

              {Number(
                order.totals?.totalSavings ??
                  order.summary
                    ?.totalSavings ??
                  0
              ) > 0 && (
                <div className="flex items-center justify-between gap-3 rounded-xl bg-green-50 p-3 text-green-700">
                  <span className="font-semibold">
                    Total Savings
                  </span>

                  <span className="shrink-0 font-bold">
                    {formatCurrency(
                      order.totals
                        ?.totalSavings ??
                        order.summary
                          ?.totalSavings
                    )}
                  </span>
                </div>
              )}

              <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl bg-teal-50 p-3">
                <span className="font-bold text-black">
                  Grand Total
                </span>

                <span className="shrink-0 text-lg font-black text-teal-600 sm:text-xl">
                  {formatCurrency(
                    order.totals?.grandTotal ??
                      order.summary
                        ?.grandTotal
                  )}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 shrink-0 text-black/50" />

                  <p className="text-xs font-medium text-black/60">
                    Payment Status
                  </p>
                </div>

                {order.paymentStatus === "SUCCESS" && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                    Paid Online
                  </span>
                )}
              </div>

              <div className="mt-1.5 flex items-center justify-between gap-2">
                <p
                  className={`text-sm font-bold ${
                    order.paymentStatus === "SUCCESS"
                      ? "text-green-700"
                      : "text-black"
                  }`}
                >
                  {formatStatus(order.paymentStatus)}
                </p>

                {canMakePayment && (
                  <Button
                    onClick={handleMakePayment}
                    disabled={
                      isInitiating ||
                      isVerifying ||
                      createPaymentMutation.isPending
                    }
                    className="h-8 rounded-lg bg-teal-600 px-3 text-xs font-semibold text-white shadow-sm hover:bg-teal-700"
                  >
                    {isInitiating ||
                    isVerifying ||
                    createPaymentMutation.isPending ? (
                      <span className="flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      "Make Payment"
                    )}
                  </Button>
                )}
              </div>
            </div>

            {(Number(
              order.totals?.redeemedCoins ?? 0
            ) > 0 ||
              Number(
                order.totals?.earnedCoins ?? 0
              ) > 0) && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-amber-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                    Redeemed Coins
                  </p>

                  <p className="mt-1 text-sm font-bold text-black">
                    {order.totals?.redeemedCoins ??
                      0}
                  </p>
                </div>

                <div className="rounded-xl bg-teal-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-teal-700">
                    Earned Coins
                  </p>

                  <p className="mt-1 text-sm font-bold text-black">
                    {order.totals?.earnedCoins ??
                      0}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ========================= */}
      {/* ADDRESSES */}
      {/* ========================= */}

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        <Card className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
              <MapPin className="h-5 w-5 text-teal-600" />
            </div>

            <div>
              <h3 className="text-base font-bold text-black sm:text-lg">
                Shipping Address
              </h3>

              <p className="mt-1 text-xs text-black/60 sm:text-sm">
                Delivery destination
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
            {renderAddress(shippingAddress)}
          </div>
        </Card>

        <Card className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50">
              <Home className="h-5 w-5 text-cyan-600" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-black sm:text-lg">
                  Billing Address
                </h3>

                {order.isBillingSameAsShipping && (
                  <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-700">
                    Same as shipping
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs text-black/60 sm:text-sm">
                Billing information
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
            {renderAddress(billingAddress)}
          </div>
        </Card>
      </div>

      {/* ========================= */}
      {/* ORDER INFORMATION */}
      {/* ========================= */}

      <Card className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
            <Clock3 className="h-5 w-5 text-black/60" />
          </div>

          <div>
            <h3 className="text-base font-bold text-black sm:text-lg">
              Order Information
            </h3>

            <p className="mt-1 text-xs text-black/60 sm:text-sm">
              Additional order details and references
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-xl border border-gray-100 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-black/45">
              Order ID
            </p>

            <div className="mt-1 flex items-start gap-1">
              <p className="min-w-0 flex-1 break-all text-xs font-semibold text-black sm:text-sm">
                {order.id}
              </p>

              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  copyToClipboard(order.id)
                }
                className="h-7 w-7 shrink-0"
                aria-label="Copy order ID"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-black/45">
              Order Status
            </p>

            <p className="mt-1 break-words text-sm font-semibold text-black">
              {formatStatus(order.status)}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-black/45">
              Payment Status
            </p>

            <p
              className={`mt-1 break-words text-sm font-semibold ${
                order.paymentStatus === "SUCCESS"
                  ? "text-green-700"
                  : "text-black"
              }`}
            >
              {formatStatus(
                order.paymentStatus
              )}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-black/45">
              Last Updated
            </p>

            <p className="mt-1 text-sm font-semibold text-black">
              {formatDate(
                order.updatedAt,
                true
              )}
            </p>
          </div>

          {order.gstNumber && (
            <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-teal-800">
                GST Number
              </p>

              <p className="mt-1 font-mono text-sm font-bold text-teal-950 break-all">
                {order.gstNumber}
              </p>
            </div>
          )}

          {order.couponCode && (
            <div className="rounded-xl border border-green-100 bg-green-50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-green-600">
                Coupon Applied
              </p>

              <p className="mt-1 break-all text-sm font-bold text-green-700">
                {order.couponCode}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* ========================= */}
      {/* CANCELLATION DETAILS */}
      {/* ========================= */}

      {hasObjectValues(
        order.cancellation
      ) &&
        !isCancelled && (
          <Card className="rounded-2xl border border-red-100 bg-red-50/30 p-4 shadow-sm sm:p-5">
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div className="min-w-0">
                {order.cancellation?.cancelledAt && (
                  <p className="mt-2 text-sm text-black/65">
                    Cancelled:{" "}
                    {formatDate(
                      order.cancellation.cancelledAt,
                      true
                    )}
                  </p>
                )}

                {order.cancellation?.reason && (
                  <p className="mt-1 break-words text-sm text-black/65">
                    Reason:{" "}
                    {order.cancellation.reason}
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

      {/* ========================= */}
      {/* REFUND DETAILS */}
      {/* ========================= */}

      {hasObjectValues(order.refund) &&
        !isRefunded && (
          <Card className="rounded-2xl border border-purple-100 bg-purple-50/30 p-4 shadow-sm sm:p-5">
            <div className="flex items-start gap-3">
              <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-purple-600" />

              <div className="min-w-0">
                <h3 className="font-bold text-black">
                  Refund Details
                </h3>

                <div className="mt-2 space-y-1 text-sm text-black/65">
                  {order.refund?.status && (
                    <p>
                      Status:{" "}
                      <span className="font-semibold text-black">
                        {formatStatus(
                          order.refund.status
                        )}
                      </span>
                    </p>
                  )}

                  {order.refund?.amount !==
                    undefined && (
                    <p>
                      Amount:{" "}
                      <span className="font-semibold text-black">
                        {formatCurrency(
                          order.refund.amount
                        )}
                      </span>
                    </p>
                  )}

                  {order.refund?.refundedAt && (
                    <p>
                      Refunded At:{" "}
                      <span className="font-semibold text-black">
                        {formatDate(
                          order.refund.refundedAt,
                          true
                        )}
                      </span>
                    </p>
                  )}

                  {order.refund?.reason && (
                    <p className="break-words">
                      Reason:{" "}
                      {order.refund.reason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

      {/* ========================= */}
      {/* NOTES */}
      {/* ========================= */}

      {hasObjectValues(order.notes) && (
        <Card className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <h3 className="text-base font-bold text-black sm:text-lg">
            Order Notes
          </h3>

          <div className="mt-4 space-y-3">
            {Object.entries(
              order.notes ?? {}
            ).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="rounded-xl bg-gray-50 p-3"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-black/45">
                    {formatStatus(key)}
                  </p>

                  <p className="mt-1 break-words text-sm text-black/70">
                    {String(value)}
                  </p>
                </div>
              )
            )}
          </div>
        </Card>
      )}
    </div>
  );
};