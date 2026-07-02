"use client";

import { useState } from "react";

import {
  Eye,
  Loader2,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import { EmptyState } from "@/shared/components/ui/empty-state";

import { useCustomerOrders } from "../hooks/use-customer-orders";

import {
  useOrderDetails,
} from "@/features/order-management/hooks/use-orders";

import OrderDetailsDrawer from "@/features/order-management/components/order-details-drawer";

interface Props {
  customerId: string;
}

export function CustomerOrderTable({
  customerId,
}: Props) {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [
    selectedOrderId,
    setSelectedOrderId,
  ] = useState("");

  const [
    drawerOpen,
    setDrawerOpen,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | CUSTOMER ORDERS
  |--------------------------------------------------------------------------
  */

  const {
    data,
    isLoading,
  } = useCustomerOrders(
    customerId
  );

  /*
  |--------------------------------------------------------------------------
  | ORDER DETAILS
  |--------------------------------------------------------------------------
  */

  const {
    data: selectedOrder,
    isLoading:
      orderDetailsLoading,
  } = useOrderDetails(
    selectedOrderId
  );

  /*
  |--------------------------------------------------------------------------
  | SAFE ORDERS
  |--------------------------------------------------------------------------
  */

  const orders =
    data?.orders ?? [];

  /*
  |--------------------------------------------------------------------------
  | VIEW ORDER
  |--------------------------------------------------------------------------
  */

  const handleView = (
    orderId: string
  ) => {
    setSelectedOrderId(
      orderId
    );

    setDrawerOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (isLoading) {
    return (
      <div className="flex h-44 items-center justify-center rounded-xl border bg-white">
        <Loader2
          className="animate-spin text-teal-600"
          size={32}
        />
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | EMPTY
  |--------------------------------------------------------------------------
  */

  if (orders.length === 0) {
    return (
      <EmptyState title="No orders found for this customer" />
    );
  }

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">

        {/* HEADER */}

        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Customer Orders
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Total Orders : {orders.length}
          </p>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="min-w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Order Number
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Date
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Grand Total
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Order Status
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Payment
                </th>

                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">
                
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-slate-50"
                >
                  {/* ORDER NUMBER */}

                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">
                      {order.orderNumber}
                    </p>
                  </td>

                  {/* DATE */}

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {new Date(
                      order.createdAt,
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </td>

                  {/* TOTAL */}

                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-800">
                      ₹
                      {Number(
                        order.totals
                          ?.grandTotal ?? 0,
                      ).toFixed(2)}
                    </span>
                  </td>

                  {/* ORDER STATUS */}

                  <td className="px-5 py-4">
                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold

                        ${
                          order.status ===
                          "DELIVERED"
                            ? "bg-green-100 text-green-700"

                            : order.status ===
                              "PROCESSING"
                            ? "bg-blue-100 text-blue-700"

                            : order.status ===
                              "CONFIRMED"
                            ? "bg-cyan-100 text-cyan-700"

                            : order.status ===
                              "SHIPPED"
                            ? "bg-indigo-100 text-indigo-700"

                            : order.status ===
                              "PENDING_PAYMENT"
                            ? "bg-yellow-100 text-yellow-700"

                            : order.status ===
                              "REFUNDED"
                            ? "bg-purple-100 text-purple-700"

                            : order.status ===
                              "RETURNED"
                            ? "bg-orange-100 text-orange-700"

                            : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {order.status.replaceAll(
                        "_",
                        " ",
                      )}
                    </span>
                  </td>

                  {/* PAYMENT STATUS */}

                  <td className="px-5 py-4">
                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold

                        ${
                          (order.paymentStatus as string) ===
                          "SUCCESS"
                            ? "bg-green-100 text-green-700"

                            : (order.paymentStatus as string) ===
                              "CAPTURED"
                            ? "bg-emerald-100 text-emerald-700"

                            : (order.paymentStatus as string) ===
                              "AUTHORIZED"
                            ? "bg-blue-100 text-blue-700"

                            : (order.paymentStatus as string) ===
                              "PENDING"
                            ? "bg-yellow-100 text-yellow-700"

                            : (order.paymentStatus as string) ===
                              "FAILED"
                            ? "bg-red-100 text-red-700"

                            : (order.paymentStatus as string) ===
                              "REFUNDED"
                            ? "bg-purple-100 text-purple-700"

                            : "bg-gray-100 text-gray-700"
                        }
                      `}
                    >
                      {order.paymentStatus.replaceAll(
                        "_",
                        " ",
                      )}
                    </span>
                  </td>

                  {/* ACTION */}

                  <td className="px-5 py-4 text-center">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() =>
                        handleView(order.id)
                      }
                      className="gap-2"
                    >
                      <Eye size={15} />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <OrderDetailsDrawer
  open={drawerOpen}
  order={selectedOrder}
  loading={orderDetailsLoading}
  onClose={() => {
    setDrawerOpen(false);
    setSelectedOrderId("");
  }}
/>
    </>
  );
}