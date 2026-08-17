"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import {
  ChevronLeft,
  Loader2,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import { RequestReturnDialog } from "../components/request-return-dialog";

import { useRequestReturn } from "../hooks/use-request-return";

import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";

import { OrderDetailsView } from "../components/order-details-view";

import { CancelOrderDialog } from "../components/cancel-order-dialog";

import { useOrderDetails } from "../hooks/use-order-details";

import { useCancelOrder } from "../hooks/use-cancel-order";

interface OrderDetailPageProps {
  orderId: string;
}

export const OrderDetailPage = ({
  orderId,
}: OrderDetailPageProps) => {
  const router = useRouter();

  const [cancelOpen, setCancelOpen] =
    useState(false);
const [returnOpen, setReturnOpen] =
  useState(false);

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useOrderDetails(orderId);

  const {
    mutateAsync: cancelOrder,
    isPending: cancelLoading,
  } = useCancelOrder();

  const {
  mutateAsync: requestReturn,
  isPending: returnLoading,
} = useRequestReturn();

  /*
  |--------------------------------------------------------------------------
  | HANDLE CANCEL ORDER
  |--------------------------------------------------------------------------
  */

  const handleCancelOrder =
    async (reason: string) => {
      try {
        await cancelOrder({
          orderId,
          reason,
        });

        await refetch();

        setCancelOpen(false);
      } catch (error) {
        console.error(
          "CANCEL ORDER ERROR",
          error
        );
      }
    };

   const handleRequestReturn =
  async (
    type: string,
    reason: string,
    description: string
  ) => {
    try {
      await requestReturn({
        orderId,

        type: type as
          | "REFUND"
          | "REPLACEMENT",

        reason: reason as
          | "DAMAGED_PRODUCT"
          | "WRONG_ITEM"
          | "QUALITY_ISSUE"
          | "OTHER",

        description,
      });

      await refetch();

      setReturnOpen(false);
    } catch {
      // Error already handled by React Query onError
    }
  };
  /*
  |--------------------------------------------------------------------------
  | LOADING STATE
  |--------------------------------------------------------------------------
  */

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-600">
          <Loader2 className="h-10 w-10 animate-spin text-white" />
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-black">
            Loading Order Details
          </h2>

          <p className="mt-2 text-sm text-black/60">
            Fetching your latest order information...
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR STATE
  |--------------------------------------------------------------------------
  */

  if (error || !order) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-red-50/40 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <ShieldCheck className="h-10 w-10 text-red-500" />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-black">
            Order Not Found
          </h2>

          <p className="mt-3 text-sm leading-6 text-black/60">
            We couldn't retrieve the details for this order.
            Please try again later or contact support.
          </p>
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
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">

  {/* ========================= */}
  {/* BREADCRUMBS */}
  {/* ========================= */}

  <div className="mb-4 flex items-center gap-2 text-sm">
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

    <Link
      href="/account/orders"
      className="
        font-medium
        text-slate-500
        transition-colors
        hover:text-teal-600
      "
    >
      My Orders
    </Link>

    <ChevronRight
      className="h-4 w-4 text-slate-300"
      strokeWidth={2}
    />

    <span className="font-semibold text-teal-600">
      Order Details
    </span>
  </div>

        {/* ========================= */}
        {/* MAIN ORDER VIEW */}
        {/* ========================= */}

        <OrderDetailsView
  order={order}
  onCancel={() =>
    setCancelOpen(true)
  }
  onRequestReturn={() =>
    setReturnOpen(true)
  }
/>

        {/* ========================= */}
        {/* SUPPORT SECTION */}
        {/* ========================= */}

        <div
          className="
            mt-10 overflow-hidden
            rounded-3xl
            border border-teal-100
            bg-gradient-to-r from-teal-50 via-white to-cyan-50
            p-6 shadow-sm
          "
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100">
                <Headphones className="h-7 w-7 text-teal-600" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-black">
                  Need help with this order?
                </h4>

                <p className="mt-2 text-sm leading-6 text-black/60">
                  If you have issues with delivery,
                  cancellation, refund, or payment,
                  our support team is here to help you.
                </p>
              </div>
            </div>

            <Button className="rounded-xl bg-teal-600 hover:bg-teal-700">
              Contact Support
            </Button>
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* CANCEL ORDER DIALOG */}
      {/* ========================= */}

      <CancelOrderDialog
        open={cancelOpen}
        onClose={() =>
          setCancelOpen(false)
        }
        onConfirm={
          handleCancelOrder
        }
        loading={cancelLoading}
      />
      <RequestReturnDialog
  open={returnOpen}
  onClose={() =>
    setReturnOpen(false)
  }
  onConfirm={
    handleRequestReturn
  }
  loading={returnLoading}
/>
    </>
  );
};