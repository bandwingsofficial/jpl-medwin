"use client";

import Image from "next/image";

import {
  X,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  Wallet,
  Package,
  Loader2,
} from "lucide-react";

import { Order } from "../types/order.type";

import OrderStatusBadge from "./order-status-badge";

interface Props {
  open: boolean;

  order?: Order | null;

  loading?: boolean;

  onClose: () => void;
}

export default function OrderDetailsDrawer({
  open,
  order,
  loading,
  onClose,
}: Props) {
  /*
  |--------------------------------------------------------------------------
  | CLOSED
  |--------------------------------------------------------------------------
  */

  if (!open) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div
        className="
          fixed inset-0
          z-[9999]
          flex justify-end
        "
      >
        {/* OVERLAY */}

        <div
          className="
            absolute inset-0
            bg-black/40
          "
          onClick={onClose}
        />

        {/* DRAWER */}

        <div
          className="
            relative
            z-[10000]
            flex h-full w-full max-w-3xl
            items-center
            justify-center
            bg-white
          "
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={34}
              className="animate-spin text-blue-600"
            />

            <p className="text-sm text-gray-500">
              Loading order details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | NO ORDER
  |--------------------------------------------------------------------------
  */

  if (!order) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | SAFE ITEMS
  |--------------------------------------------------------------------------
  */

  const items =
    Array.isArray(order.items)
      ? order.items
      : [];

  return (
    <div
      className="
        fixed inset-0
        z-[9999]
        flex justify-end
      "
    >
      {/* OVERLAY */}

      <div
        className="
          absolute inset-0
          bg-black/40
          backdrop-blur-[2px]
        "
        onClick={onClose}
      />

      {/* DRAWER */}

      <div
        className="
          relative
          z-[10000]
          flex h-full w-full max-w-3xl
          flex-col
          overflow-hidden
          border-l
          border-gray-200
          bg-[#f8fafc]
          shadow-2xl
        "
      >
        {/* HEADER */}

        <div
          className="
            sticky top-0
            z-30
            flex items-center justify-between
            border-b
            border-gray-200
            bg-white
            px-4 py-4
          "
        >
          <div>
            <h2
              className="
                text-lg
                font-bold
                text-gray-900
              "
            >
              Order Details
            </h2>

            <p className="mt-0.5 text-sm text-gray-500">
              {order.orderNumber}
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              flex h-9 w-9
              items-center
              justify-center
              rounded-lg
              border
              border-gray-200
              bg-white
              text-gray-500
              transition-all
              hover:bg-gray-100
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-4 py-4
          "
        >
          {order.timeline && (
  <div className="rounded-xl border bg-white p-4 my-2 shadow-sm">
    <h3 className="mb-4 text-sm font-semibold text-gray-900">
      Timeline
    </h3>

    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">
          Created
        </span>

        <span>
          {new Date(
            order.timeline.createdAt!
          ).toLocaleString("en-IN")}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-500">
          Updated
        </span>

        <span>
          {new Date(
            order.timeline.updatedAt!
          ).toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  </div>
)}
          <div className="space-y-4">
            {/* STATUS GRID */}

            <div className="grid gap-3 md:grid-cols-3">
              {/* STATUS */}

              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Order Status
                </p>

                <OrderStatusBadge
                  status={order.status}
                />
              </div>

              {/* PAYMENT */}

              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Payment Status
                </p>

                <div
                  className={`
                    inline-flex
                    rounded-md
                    px-2.5
                    py-1
                    text-xs
                    font-semibold

                    ${
                      order.paymentStatus ===
                      "SUCCESS"
                        ? "bg-green-100 text-green-700"

                        : order.paymentStatus ===
                          "REFUNDED"
                        ? "bg-emerald-100 text-emerald-700"

                        : order.paymentStatus ===
                          "FAILED"
                        ? "bg-red-100 text-red-700"

                        : "bg-yellow-100 text-yellow-700"
                    }
                  `}
                >
                  {order.paymentStatus}
                </div>
              </div>

              {/* DATE */}

              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Order Date
                </p>

                <p className="text-sm font-semibold text-gray-800">
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
            </div>

            {/* CUSTOMER */}

            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <Phone
                  size={16}
                  className="text-blue-600"
                />

                <h3 className="text-sm font-semibold text-gray-900">
                  Customer Details
                </h3>
              </div>

              <div className="space-y-1 text-sm">
  <p className="font-semibold text-gray-900">
    {order.shippingAddress?.name ||
      order.shippingAddress?.fullName ||
      "Customer"}
  </p>

  <p className="text-gray-600">
    {order.shippingAddress?.phone ||
      order.shippingAddress?.phoneNumber ||
      "No phone"}
  </p>
</div>
            </div>

            {/* SHIPPING */}

            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <MapPin
                  size={16}
                  className="text-red-500"
                />

                <h3 className="text-sm font-semibold text-gray-900">
                  Shipping Address
                </h3>
              </div>

              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  {
                    order.shippingAddress
                      ?.line1
                  }
                </p>

                <p>
                  {
                    order.shippingAddress
                      ?.city
                  }
                  ,{" "}
                  {
                    order.shippingAddress
                      ?.state
                  }
                </p>

                <p>
                  {
                    order.shippingAddress
                      ?.postalCode
                  }
                </p>

                <p>
                  {
                    order.shippingAddress
                      ?.country
                  }
                </p>
              </div>
            </div>
            {/* BILLING ADDRESS */}

<div className="rounded-xl border bg-white p-4 shadow-sm">
  <div className="mb-3 flex items-center gap-2">
    <MapPin
      size={16}
      className="text-indigo-600"
    />

    <h3 className="text-sm font-semibold text-gray-900">
      Billing Address
    </h3>
  </div>

  <div className="space-y-1 text-sm text-gray-700">
    <p className="font-semibold">
      {order.billingAddress?.fullName ||
        order.billingAddress?.name}
    </p>

    <p>
      {order.billingAddress?.phoneNumber ||
        order.billingAddress?.phone}
    </p>

    <p>
      {order.billingAddress?.line1}
    </p>

    <p>
      {order.billingAddress?.city},{" "}
      {order.billingAddress?.state}
    </p>

    <p>
      {order.billingAddress?.postalCode}
    </p>

    <p>
      {order.billingAddress?.country}
    </p>
  </div>
</div>
{order.notes?.customerNote && (
  <div className="rounded-xl border bg-white p-4 shadow-sm">
    <h3 className="mb-2 text-sm font-semibold text-gray-900">
      Customer Note
    </h3>

    <p className="text-sm text-gray-700">
      {order.notes.customerNote}
    </p>
  </div>
)}

            {/* ITEMS */}

            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Package
                  size={16}
                  className="text-purple-600"
                />

                <h3 className="text-sm font-semibold text-gray-900">
                  Order Items
                </h3>
              </div>

              {items.length === 0 ? (
                <div className="rounded-xl border border-dashed p-5 text-center text-sm text-gray-500">
                  No items found
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(
                    (item) => (
                      <div
                        key={item.id}
                        className="
                          flex gap-3
                          rounded-xl
                          border
                          bg-white
                          p-3
                        "
                      >
                        {/* IMAGE */}

                        <div
                          className="
                            relative
                            h-16
                            w-16
                            overflow-hidden
                            rounded-lg
                            bg-gray-100
                          "
                        >
                          <Image
                            src={
                              item
                                ?.variant
                                ?.images
                                ?.main ||
                              "/placeholder.png"
                            }
                            alt={
                              item.productName ||
                              "Product Image"
                            }
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* INFO */}

                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {
                              item.productName
                            }
                          </h4>

                          <p className="mt-1 text-xs text-gray-500">
                            SKU:{" "}
                            {item
                              ?.variant
                              ?.sku ||
                              "-"}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
  <span className="rounded-md bg-blue-100 px-2 py-1 text-blue-700">
    Qty:{" "}
    {
      item.quantity ||
      item.variant?.quantity ||
      1
    }
  </span>

  <span className="rounded-md bg-green-100 px-2 py-1 text-green-700">
    ₹
    {Number(
      item.totalPrice ||
      item.totals?.subtotal ||
      (
        Number(
          item.variant?.pricing
            ?.sellingPrice || 0
        ) *
        Number(
          item.quantity ||
          item.variant?.quantity ||
          1
        )
      ) ||
      0
    ).toFixed(2)}
  </span>
</div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* PAYMENT SUMMARY */}

            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard
                  size={16}
                  className="text-blue-600"
                />

                <h3 className="text-sm font-semibold text-gray-900">
                  Payment Summary
                </h3>
              </div>

              <div className="space-y-3 text-sm">
  <div className="flex items-center justify-between">
    <span className="text-gray-500">
      Subtotal
    </span>

    <span className="font-medium">
      ₹
      {Number(
        order.totals?.subtotal ||
        items.reduce(
          (acc, item) =>
            acc +
            Number(
              item.totalPrice ||
              item.totals?.subtotal ||
              (
                Number(
                  item.variant?.pricing
                    ?.sellingPrice || 0
                ) *
                Number(
                  item.quantity ||
                  item.variant?.quantity ||
                  1
                )
              )
            ),
          0
        ) ||
        0
      ).toFixed(2)}
    </span>
  </div>

  <div className="flex items-center justify-between">
    <span className="text-gray-500">
      Tax
    </span>

    <span className="font-medium">
      ₹
      {Number(
        order.totals?.tax || 0
      ).toFixed(2)}
    </span>
  </div>

  <div className="flex items-center justify-between">
    <span className="text-gray-500">
      Shipping
    </span>

    <span className="font-medium">
      ₹
      {Number(
        order.totals?.shippingCharge || 0
      ).toFixed(2)}
    </span>
  </div>

  <div className="border-t pt-3">
    <div className="flex items-center justify-between">
      <span className="font-semibold text-gray-900">
        Grand Total
      </span>

      <span className="text-lg font-bold text-gray-900">
        ₹
        {Number(
          order.totals?.grandTotal ||
          (
            items.reduce(
              (acc, item) =>
                acc +
                Number(
                  item.totalPrice ||
                  item.totals?.subtotal ||
                  (
                    Number(
                      item.variant?.pricing
                        ?.sellingPrice || 0
                    ) *
                    Number(
                      item.quantity ||
                      item.variant?.quantity ||
                      1
                    )
                  )
                ),
              0
            ) +
            Number(order.tax || 0) +
            Number(
              order.shippingCharge || 0
            )
          ) ||
          0
        ).toFixed(2)}
      </span>
    </div>
  </div>
</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}