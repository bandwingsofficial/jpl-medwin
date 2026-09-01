"use client";

import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useOrders } from "../hooks/use-orders";
import { OrderListItem } from "../components/order-list-item";
import { Button } from "@/shared/components/ui/button";

import { OrderListItem as Order } from "../types/order-list.type";

export const OrderListPage = () => {
  const router = useRouter();

  const {
    data: orders = [],
    isLoading,
    isFetching,
    error,
  } = useOrders();

  /*
  |--------------------------------------------------------------------------
  | ORDER COUNTS
  |--------------------------------------------------------------------------
  */

  const totalOrders = orders?.length || 0;

  const deliveredOrders =
    orders?.filter((order) => order.status === "DELIVERED")?.length || 0;

  const processingOrders =
    orders?.filter(
      (order) =>
        order.status === "PROCESSING" ||
        order.status === "SHIPPED"
    )?.length || 0;

  /*
  |--------------------------------------------------------------------------
  | LOADING STATE
  |--------------------------------------------------------------------------
  */

  if (isLoading || isFetching) {
    return (
      <div className="w-full min-w-0 space-y-2">
        {/* ========================= */}
        {/* BREADCRUMBS */}
        {/* ========================= */}

        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-1.5
              font-medium
              text-slate-500
              transition-colors
              hover:text-teal-600
            "
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          <ChevronRight
            className="h-4 w-4 text-slate-300"
            strokeWidth={2}
          />

          <span className="font-semibold text-teal-600">
            My Orders
          </span>
        </div>

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <div className="flex items-center justify-between">
          <div>
            <div className="h-7 w-40 animate-pulse rounded-lg bg-gray-200" />
            <div className="mt-2 h-4 w-28 animate-pulse rounded bg-gray-100" />
          </div>
        </div>

        {/* ========================= */}
        {/* CARDS */}
        {/* ========================= */}

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="
                animate-pulse
                rounded-2xl
                border border-gray-100
                bg-white
                p-4
                shadow-sm
              "
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gray-200" />

                <div className="flex-1">
                  <div className="h-4 w-40 rounded bg-gray-200" />
                  <div className="mt-2 h-3 w-28 rounded bg-gray-100" />
                </div>

                <div className="h-8 w-24 rounded-full bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR STATE
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <div
        className="
          flex w-full min-w-0 flex-col items-center justify-center
          rounded-3xl
          border border-red-100
          bg-red-50/40
          px-6 py-16
          text-center
        "
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <ShoppingBag size={38} className="text-red-500" />
        </div>

        <h3 className="mt-5 text-2xl font-bold text-black">
          Failed to Load Orders
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-black/60">
          Something went wrong while fetching your orders. Please try again.
        </p>

        <Button
          className="mt-6 rounded-xl bg-red-600 hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | EMPTY STATE
  |--------------------------------------------------------------------------
  */

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="w-full min-w-0 space-y-5">
        {/* ========================= */}
        {/* BREADCRUMBS */}
        {/* ========================= */}

        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-1.5
              font-medium
              text-slate-500
              transition-colors
              hover:text-teal-600
            "
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          <ChevronRight
            className="h-4 w-4 text-slate-300"
            strokeWidth={2}
          />

          <span className="font-semibold text-teal-600">
            My Orders
          </span>
        </div>

        {/* ========================= */}
        {/* EMPTY ORDERS CONTENT */}
        {/* NO INNER BOX */}
        {/* ========================= */}

        <div
          className="
            flex w-full flex-col
            items-center
            justify-center
            px-6
            py-16
            text-center
          "
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-100">
            <ShoppingBag
              size={38}
              className="text-teal-600"
            />
          </div>

          <h3 className="mt-5 text-2xl font-bold text-black">
            No Orders Yet
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-black/60">
            Looks like you haven't placed any orders yet.
            Start shopping to see your orders here.
          </p>

          <Button
            className="mt-6 rounded-xl bg-teal-600 hover:bg-teal-700"
            onClick={() => router.push("/products")}
          >
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | MAIN PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <div className="w-full min-w-0 space-y-5">
      {/* ========================= */}
      {/* BREADCRUMBS */}
      {/* ========================= */}

      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/"
          className="
            inline-flex
            items-center
            gap-1.5
            font-medium
            text-slate-500
            transition-colors
            hover:text-teal-600
          "
        >
          <Home className="h-4 w-4" />
          Home
        </Link>

        <ChevronRight
          className="h-4 w-4 text-slate-300"
          strokeWidth={2}
        />

        <span className="font-semibold text-teal-600">
          My Orders
        </span>
      </div>

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="text-center sm:text-left">
          <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            My Orders
          </h1>

          <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
            Track and manage all your orders
          </p>
        </div>

        <Button
          onClick={() => router.push("/products")}
          className="h-10 w-full rounded-xl bg-teal-600 text-sm hover:bg-teal-700 sm:w-auto"
        >
          Continue Shopping
        </Button>
      </div>

      {/* ========================= */}
      {/* STATS */}
      {/* ========================= */}

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {/* TOTAL */}

        <div className="rounded-xl border border-blue-100 bg-white p-2 shadow-sm sm:rounded-2xl sm:p-4">
          <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:gap-3 sm:text-left">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 sm:h-11 sm:w-11 sm:rounded-xl">
              <Package className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium text-gray-400 sm:text-sm">
                Total Orders
              </p>

              <h3 className="mt-0.5 text-sm font-black text-slate-900 sm:mt-0 sm:text-xl">
                {totalOrders}
              </h3>
            </div>
          </div>
        </div>

        {/* PROCESSING */}

        <div className="rounded-xl border border-purple-100 bg-white p-2 shadow-sm sm:rounded-2xl sm:p-4">
          <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:gap-3 sm:text-left">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 sm:h-11 sm:w-11 sm:rounded-xl">
              <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium text-gray-400 sm:text-sm">
                Active Orders
              </p>

              <h3 className="mt-0.5 text-sm font-black text-slate-900 sm:mt-0 sm:text-xl">
                {processingOrders}
              </h3>
            </div>
          </div>
        </div>

        {/* DELIVERED */}

        <div className="rounded-xl border border-green-100 bg-white p-2 shadow-sm sm:rounded-2xl sm:p-4">
          <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:gap-3 sm:text-left">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600 sm:h-11 sm:w-11 sm:rounded-xl">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium text-gray-400 sm:text-sm">
                Delivered
              </p>

              <h3 className="mt-0.5 text-sm font-black text-slate-900 sm:mt-0 sm:text-xl">
                {deliveredOrders}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* ORDER LIST */}
      {/* ========================= */}

      <div className="w-full min-w-0 space-y-3 sm:space-y-4">
        {orders.map((order) => (
          <OrderListItem
            key={order.id}
            order={order}
          />
        ))}
      </div>
    </div>
  );
};