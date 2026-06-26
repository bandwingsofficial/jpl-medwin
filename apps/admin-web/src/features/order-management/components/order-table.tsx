"use client";

import { useMemo, useState } from "react";

import {
  Eye,
  Loader2,
  Package,
  RotateCcw,
  Truck,
  CheckCircle2,
  Settings2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Order } from "../types/order.type";

import {
  useDeliverOrder,
  useRefundOrder,
  useShipOrder,
  useProcessOrder,
} from "../hooks/use-orders";

import OrderStatusBadge from "./order-status-badge";

import {
  showError,
  showSuccess,
  showWarning,
  showInfo,
} from "@/shared/store/toast.store";

interface Props {
  orders: Order[];

  onView: (
    order: Order
  ) => void;
}

export default function OrderTable({
  orders,
  onView,
}: Props) {

  const [
    loadingId,
    setLoadingId,
  ] = useState<string | null>(
    null
  );

  // =========================================
  // PAGINATION
  // =========================================

  const ITEMS_PER_PAGE = 10;

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const totalPages =
    Math.ceil(
      orders.length /
        ITEMS_PER_PAGE
    );

  const paginatedOrders =
    useMemo(() => {

      const start =
        (currentPage - 1) *
        ITEMS_PER_PAGE;

      const end =
        start +
        ITEMS_PER_PAGE;

      return orders.slice(
        start,
        end
      );

    }, [
      orders,
      currentPage,
    ]);

  const refundMutation =
    useRefundOrder();

  const deliverMutation =
    useDeliverOrder();

  const shipMutation =
    useShipOrder();

  const processMutation =
    useProcessOrder();

  // =========================================
  // PROCESS
  // =========================================

  const handleProcess =
    async (
      id: string
    ) => {

      try {

        if (
          loadingId
        ) {
          return;
        }

        setLoadingId(
          id
        );

        showInfo(
          "Processing order..."
        );

        await processMutation.mutateAsync(
          id
        );

        showSuccess(
          "Order processed successfully"
        );

      } catch (error: any) {

        console.error(
          error
        );

        showError(
          error?.message ||
            "Failed to process order"
        );

      } finally {

        setLoadingId(
          null
        );
      }
    };

  // =========================================
  // SHIP
  // =========================================

  const handleShip =
    async (
      id: string
    ) => {

      try {

        if (
          loadingId
        ) {
          return;
        }

        setLoadingId(
          id
        );

        showInfo(
          "Shipping order..."
        );

        await shipMutation.mutateAsync({
          id,

          trackingId:
            "TRK-" +
            Date.now(),

          courierName:
            "BlueDart",
        });

        showSuccess(
          "Order shipped successfully"
        );

      } catch (error: any) {

        console.error(
          error
        );

        showError(
          error?.message ||
            "Failed to ship order"
        );

      } finally {

        setLoadingId(
          null
        );
      }
    };

  // =========================================
  // DELIVER
  // =========================================

  const handleDeliver =
    async (
      id: string
    ) => {

      try {

        if (
          loadingId
        ) {
          return;
        }

        setLoadingId(
          id
        );

        showInfo(
          "Delivering order..."
        );

        await deliverMutation.mutateAsync(
          id
        );

        showSuccess(
          "Order delivered successfully"
        );

      } catch (error: any) {

        console.error(
          error
        );

        showError(
          error?.message ||
            "Failed to deliver order"
        );

      } finally {

        setLoadingId(
          null
        );
      }
    };

  // =========================================
  // REFUND
  // =========================================

  const handleRefund =
    async (
      id: string
    ) => {

      try {

        if (
          loadingId
        ) {
          return;
        }

        setLoadingId(
          id
        );

        showWarning(
          "Refund initiated..."
        );

        await refundMutation.mutateAsync(
          id
        );

        showSuccess(
          "Refund completed successfully"
        );

      } catch (error: any) {

        console.error(
          error
        );

        showError(
          error?.message ||
            "Refund failed"
        );

      } finally {

        setLoadingId(
          null
        );
      }
    };

  // =========================================
  // EMPTY
  // =========================================

  if (!orders?.length) {

    return (
      <div
        className="
          rounded-lg
          border
          bg-white
          py-10
          text-center
          text-sm
          text-gray-500
        "
      >
        No orders found
      </div>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (
    <div className="space-y-3">

      {/* TABLE CONTROLLER */}
      <div
        className="
          overflow-x-auto
          rounded-xl
          border
          border-gray-200
          bg-white
          max-h-[75vh]
        "
      >
        <div className="min-w-[1000px]">

          {/* TABLE HEADER */}
          <div
            className="
              sticky
              top-0
              z-10
              hidden
              grid-cols-[1fr_1.5fr_1fr_1fr_1fr_1fr_1.2fr]
              items-center
              border-b
              border-gray-200
              bg-gray-50/75
              backdrop-blur-sm
              px-4
              py-3
              text-[12px]
              font-semibold
              text-gray-500
              md:grid
            "
          >
            <div>Order</div>
            <div>Customer</div>
            <div>Status</div>
            <div>Payment</div>
            <div>Total</div>
            <div>City</div>
            <div className="text-right">Actions</div>
          </div>

          {/* ORDERS LIST */}
          <div className="divide-y divide-gray-100">
            {paginatedOrders.map((order) => {
              const loading = loadingId === order.id;

              const total = Number(
                order?.totals?.grandTotal ??
                order?.grandTotal ??
                order?.summary?.grandTotal ??
                0
              );

              const canProcess = order.status === "CONFIRMED";
              const canShip = order.status === "PROCESSING";
              const canDeliver = order.status === "SHIPPED";
              const canRefund = false;

              return (
                <div
                  key={order.id}
                  className="
                    grid
                    grid-cols-[1fr_1.5fr_1fr_1fr_1fr_1fr_1.2fr]
                    items-center
                    gap-2
                    px-4
                    py-3
                    transition
                    hover:bg-gray-50/50
                  "
                >
                  {/* ORDER */}
                  <div className="flex min-w-0 items-center gap-2">
                    <div
                      className="
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-md
                        bg-blue-50
                        text-blue-600
                      "
                    >
                      <Package size={14} />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-xs
                          font-medium
                          text-gray-900
                        "
                        title={order.orderNumber}
                      >
                        {order.orderNumber}
                      </p>
                    </div>
                  </div>

                  {/* CUSTOMER */}
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-gray-800">
                      {order.shippingAddress?.fullName ??
                        order.shippingAddress?.name ??
                        "Customer"}
                    </p>
                    <p className="truncate text-[10px] text-gray-400 font-normal">
                      {order.shippingAddress?.phoneNumber ??
                        order.shippingAddress?.phone ??
                        "No phone"}
                    </p>
                  </div>

                  {/* STATUS */}
                  <div className="flex items-center">
                    <OrderStatusBadge status={order.status} />
                  </div>

                  {/* PAYMENT */}
                  <div>
                    <span
                      className={`
                        inline-flex
                        items-center
                        rounded-full
                        px-2
                        py-0.5
                        text-[10px]
                        font-medium
                        whitespace-nowrap
                        ${
                          order.paymentStatus === "SUCCESS"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : order.paymentStatus === "REFUNDED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : order.paymentStatus === "FAILED"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        }
                      `}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  {/* TOTAL */}
                  <div>
                    <p className="whitespace-nowrap text-xs font-semibold text-gray-900">
                      ₹{total.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* CITY */}
                  <div>
                    <p className="whitespace-nowrap text-xs font-medium text-gray-600">
                      {order.shippingAddress?.city ?? "-"}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                    {loading && (
                      <Loader2
                        className="animate-spin text-gray-400"
                        size={14}
                      />
                    )}

                    {/* VIEW */}
                    <button
                      disabled={loading}
                      onClick={() => onView(order)}
                      className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-md
                        border
                        border-gray-200
                        text-gray-500
                        transition
                        hover:border-blue-200
                        hover:bg-blue-50
                        hover:text-blue-600
                        disabled:opacity-40
                      "
                    >
                      <Eye size={14} />
                    </button>

                    {/* PROCESS */}
                    {canProcess && (
                      <button
                        disabled={loading}
                        onClick={() => handleProcess(order.id)}
                        className="
                          inline-flex
                          items-center
                          gap-1
                          rounded-md
                          bg-indigo-600
                          px-2
                          py-1
                          text-[11px]
                          font-medium
                          text-white
                          whitespace-nowrap
                          hover:bg-indigo-700
                          disabled:opacity-40
                          h-7
                        "
                      >
                        <Settings2 size={12} />
                        Process
                      </button>
                    )}

                    {/* SHIP */}
                    {canShip && (
                      <button
                        disabled={loading}
                        onClick={() => handleShip(order.id)}
                        className="
                          inline-flex
                          items-center
                          gap-1
                          rounded-md
                          bg-purple-600
                          px-2
                          py-1
                          text-[11px]
                          font-medium
                          text-white
                          whitespace-nowrap
                          hover:bg-purple-700
                          disabled:opacity-40
                          h-7
                        "
                      >
                        <Truck size={12} />
                        Ship
                      </button>
                    )}

                    {/* DELIVER */}
                    {canDeliver && (
                      <button
                        disabled={loading}
                        onClick={() => handleDeliver(order.id)}
                        className="
                          inline-flex
                          items-center
                          gap-1
                          rounded-md
                          bg-green-600
                          px-2
                          py-1
                          text-[11px]
                          font-medium
                          text-white
                          whitespace-nowrap
                          hover:bg-green-700
                          disabled:opacity-40
                          h-7
                        "
                      >
                        <CheckCircle2 size={12} />
                        Deliver
                      </button>
                    )}

                    {/* REFUND */}
                    {canRefund && (
                      <button
                        disabled={loading}
                        onClick={() => handleRefund(order.id)}
                        className="
                          inline-flex
                          items-center
                          gap-1
                          rounded-md
                          border
                          border-red-200
                          bg-red-50
                          px-2
                          py-1
                          text-[11px]
                          font-medium
                          text-red-600
                          whitespace-nowrap
                          hover:bg-red-100
                          disabled:opacity-40
                          h-7
                        "
                      >
                        <RotateCcw size={12} />
                        Refund
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PAGINATION */}
      <div
        className="
          flex
          items-center
          justify-between
          rounded-xl
          border
          border-gray-200
          bg-white
          px-4
          py-2.5
        "
      >
        <p className="text-xs text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">
            {(currentPage - 1) * ITEMS_PER_PAGE + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-gray-700">
            {Math.min(currentPage * ITEMS_PER_PAGE, orders.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700">{orders.length}</span>{" "}
          orders
        </p>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="
              inline-flex
              items-center
              gap-1
              rounded-md
              border
              border-gray-200
              px-2.5
              py-1
              text-xs
              font-medium
              text-gray-600
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-40
              h-7
            "
          >
            <ChevronLeft size={14} />
            Previous
          </button>

          <div
            className="
              rounded-md
              border
              border-gray-200
              px-2.5
              py-1
              text-xs
              font-medium
              text-gray-700
              h-7
              flex
              items-center
            "
          >
            {currentPage} / {totalPages}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="
              inline-flex
              items-center
              gap-1
              rounded-md
              border
              border-gray-200
              px-2.5
              py-1
              text-xs
              font-medium
              text-gray-600
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-40
              h-7
            "
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}