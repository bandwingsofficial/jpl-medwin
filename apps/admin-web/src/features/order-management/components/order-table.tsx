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

      <div
        className="
          space-y-3
        "
      >

        {/* TABLE */}

        <div
          className="
            overflow-x-auto
            overflow-y-auto
            rounded-xl
            border
            bg-white
            max-h-[75vh]
          "
        >

          <div
            className="
              min-w-[1200px]
            "
          >

            {/* TABLE HEADER */}

            <div
              className="
                sticky
                top-0
                z-10
                hidden
                grid-cols-[1.2fr_1fr_0.7fr_0.7fr_0.6fr_0.8fr_0.9fr]
                items-center
                border-b
                bg-gray-50
                px-3
                py-3
                text-[12px]
                font-semibold
                text-gray-600
                md:grid
              "
            >

              <div>
                Order
              </div>

              <div>
                Customer
              </div>

              <div>
                Status
              </div>

              <div>
                Payment
              </div>

              <div>
                Total
              </div>

              <div>
                Date
              </div>

              <div className="text-right">
                Actions
              </div>

            </div>

            {/* ORDERS */}

            <div className="space-y-2 p-2">

              {paginatedOrders.map(
                (order) => {

                  const loading =
                    loadingId ===
                    order.id;

                  const total =
                    Number(
                      order?.grandTotal ||
                        order?.subtotal ||
                        order?.summary
                          ?.grandTotal ||
                        0
                    );

                  const canProcess =
                    order.status ===
                    "CONFIRMED";

                  const canShip =
                    order.status ===
                    "PROCESSING";

                  const canDeliver =
                    order.status ===
                    "SHIPPED";

                  const canRefund = false;

                  return (

                    <div
                      key={order.id}
                      className="
                        rounded-lg
                        border
                        bg-white
                        px-3
                        py-2
                        transition
                        hover:border-gray-300
                        min-w-[900px]
                      "
                    >

                      <div
                        className="
                          grid
                          grid-cols-[1.2fr_1fr_0.7fr_0.7fr_0.6fr_0.8fr_0.9fr]
                          items-center
                          gap-2
                        "
                      >

                        {/* ORDER */}

                        <div
                          className="
                            flex
                            min-w-0
                            items-center
                            gap-2
                          "
                        >

                          <div
                            className="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-md
                              bg-blue-50
                              text-blue-600
                            "
                          >

                            <Package
                              size={16}
                            />

                          </div>

                          <div className="min-w-0">

                            <p
                              className="
                                truncate
                                text-sm
                                font-medium
                                text-gray-900
                              "
                              title={
                                order.orderNumber
                              }
                            >
                              {
                                order.orderNumber
                              }
                            </p>

                          </div>

                        </div>

                        {/* CUSTOMER */}

                        <div className="min-w-0">

                          <p
                            className="
                              truncate
                              text-sm
                              font-medium
                              text-gray-800
                            "
                          >
                            {order
                              ?.shippingAddress
                              ?.name ||
                              "Customer"}
                          </p>

                          <p
                            className="
                              truncate
                              text-[11px]
                              text-gray-500
                            "
                          >
                            {order
                              ?.shippingAddress
                              ?.phone ||
                              "No phone"}
                          </p>

                        </div>

                        {/* STATUS */}

                        <div className="flex items-center">

                          <OrderStatusBadge
                            status={
                              order.status
                            }
                          />

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
                              font-semibold
                              whitespace-nowrap

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
                            {
                              order.paymentStatus
                            }
                          </span>

                        </div>

                        {/* TOTAL */}

                        <div>

                          <p
                            className="
                              whitespace-nowrap
                              text-sm
                              font-semibold
                              text-gray-900
                            "
                          >
                            ₹
                            {total.toLocaleString(
                              "en-IN"
                            )}
                          </p>

                        </div>

                        {/* DATE */}

                        <div>

                          <p
                            className="
                              whitespace-nowrap
                              text-sm
                              text-gray-700
                            "
                          >
                            {new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>

                        </div>

                        {/* ACTIONS */}

                        <div
                          className="
                            flex
                            items-center
                            justify-end
                            gap-1.5
                            whitespace-nowrap
                          "
                        >

                          {/* LOADER */}

                          {loading && (

                            <Loader2
                              className="
                                animate-spin
                                text-gray-400
                              "
                              size={14}
                            />

                          )}

                          {/* VIEW */}

                          <button
                            disabled={
                              loading
                            }
                            onClick={() =>
                              onView(
                                order
                              )
                            }
                            className="
                              flex
                              h-8
                              w-8
                              items-center
                              justify-center
                              rounded-md
                              border
                              text-gray-500
                              transition
                              hover:border-blue-200
                              hover:bg-blue-50
                              hover:text-blue-600
                              disabled:opacity-40
                            "
                          >

                            <Eye
                              size={15}
                            />

                          </button>

                          {/* PROCESS */}

                          {canProcess && (

                            <button
                              disabled={
                                loading
                              }
                              onClick={() =>
                                handleProcess(
                                  order.id
                                )
                              }
                              className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-md
                                bg-indigo-600
                                px-2.5
                                py-1.5
                                text-[11px]
                                font-medium
                                text-white
                                whitespace-nowrap
                                hover:bg-indigo-700
                                disabled:opacity-40
                              "
                            >

                              <Settings2
                                size={12}
                              />

                              Process

                            </button>

                          )}

                          {/* SHIP */}

                          {canShip && (

                            <button
                              disabled={
                                loading
                              }
                              onClick={() =>
                                handleShip(
                                  order.id
                                )
                              }
                              className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-md
                                bg-purple-600
                                px-2.5
                                py-1.5
                                text-[11px]
                                font-medium
                                text-white
                                whitespace-nowrap
                                hover:bg-purple-700
                                disabled:opacity-40
                              "
                            >

                              <Truck
                                size={12}
                              />

                              Ship

                            </button>

                          )}

                          {/* DELIVER */}

                          {canDeliver && (

                            <button
                              disabled={
                                loading
                              }
                              onClick={() =>
                                handleDeliver(
                                  order.id
                                )
                              }
                              className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-md
                                bg-green-600
                                px-2.5
                                py-1.5
                                text-[11px]
                                font-medium
                                text-white
                                whitespace-nowrap
                                hover:bg-green-700
                                disabled:opacity-40
                              "
                            >

                              <CheckCircle2
                                size={12}
                              />

                              Deliver

                            </button>

                          )}

                          {/* REFUND */}

                          {canRefund && (

                            <button
                              disabled={
                                loading
                              }
                              onClick={() =>
                                handleRefund(
                                  order.id
                                )
                              }
                              className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-md
                                border
                                border-red-200
                                bg-red-50
                                px-2.5
                                py-1.5
                                text-[11px]
                                font-medium
                                text-red-600
                                whitespace-nowrap
                                hover:bg-red-100
                                disabled:opacity-40
                              "
                            >

                              <RotateCcw
                                size={12}
                              />

                              Refund

                            </button>

                          )}

                        </div>

                      </div>

                    </div>
                  );
              }
            )}

            </div>

          </div>

        </div>

        {/* PAGINATION */}

        <div
          className="
            flex
            items-center
            justify-between
            rounded-lg
            border
            bg-white
            px-4
            py-3
          "
        >

          <p
            className="
              text-sm
              text-gray-600
            "
          >
            Showing{" "}
            <span className="font-semibold">
              {(currentPage - 1) *
                ITEMS_PER_PAGE +
                1}
            </span>
            {" "}to{" "}
            <span className="font-semibold">
              {Math.min(
                currentPage *
                  ITEMS_PER_PAGE,
                orders.length
              )}
            </span>
            {" "}of{" "}
            <span className="font-semibold">
              {orders.length}
            </span>
            {" "}orders
          </p>

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <button
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.max(
                      prev - 1,
                      1
                    )
                )
              }
              disabled={
                currentPage === 1
              }
              className="
                inline-flex
                items-center
                gap-1
                rounded-md
                border
                px-3
                py-1.5
                text-sm
                font-medium
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >

              <ChevronLeft
                size={16}
              />

              Previous

            </button>

            <div
              className="
                rounded-md
                border
                px-3
                py-1.5
                text-sm
                font-medium
              "
            >
              {currentPage} /{" "}
              {totalPages}
            </div>

            <button
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.min(
                      prev + 1,
                      totalPages
                    )
                )
              }
              disabled={
                currentPage ===
                totalPages
              }
              className="
                inline-flex
                items-center
                gap-1
                rounded-md
                border
                px-3
                py-1.5
                text-sm
                font-medium
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >

              Next

              <ChevronRight
                size={16}
              />

            </button>

          </div>

        </div>

      </div>
    );
}