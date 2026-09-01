"use client";

import { useMemo, useState } from "react";
import {
  Eye,
  Loader2,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
} from "lucide-react";
import { CheckoutSessionSummary } from "../types/checkout.type";
import CheckoutStatusBadge from "./checkout-status-badge";

interface Props {
  checkouts: CheckoutSessionSummary[];
  onView: (checkout: CheckoutSessionSummary) => void;
  loadingId?: string | null;
}

export default function CheckoutTable({
  checkouts,
  onView,
  loadingId = null,
}: Props) {
  // =========================================
  // PAGINATION
  // =========================================
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(checkouts.length / ITEMS_PER_PAGE)
  );

  const paginatedCheckouts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return checkouts.slice(start, end);
  }, [checkouts, currentPage]);

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  // =========================================
  // EMPTY
  // =========================================
  if (!checkouts?.length) {
    return (
      <div
        className="
          rounded-xl
          border
          border-gray-200
          bg-white
          py-12
          text-center
          text-sm
          text-gray-500
          shadow-sm
        "
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <ShoppingBag size={24} />
        </div>
        <p className="font-semibold text-gray-700">No abandoned checkouts found</p>
        <p className="mt-1 text-xs text-gray-400">
          Checkouts that have not been converted into orders will appear here.
        </p>
      </div>
    );
  }

  // =========================================
  // UI
  // =========================================
  return (
    <div className="space-y-3">
      {/* TABLE CONTAINER */}
      <div
        className="
          overflow-x-auto
          rounded-xl
          border
          border-gray-200
          bg-white
          max-h-[75vh]
          shadow-sm
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
              grid-cols-[1.2fr_1.4fr_0.9fr_0.9fr_1.1fr_0.9fr_0.6fr]
              items-center
              border-b
              border-gray-200
              bg-gray-50/90
              backdrop-blur-sm
              px-4
              py-3
              text-[12px]
              font-semibold
              text-gray-500
              md:grid
            "
          >
            <div>Checkout Reference</div>
            <div>Customer</div>
            <div>Total Qty</div>
            <div>Total Amount</div>
            <div>Date & Time</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>

          {/* CHECKOUTS LIST */}
          <div className="divide-y divide-gray-100">
            {paginatedCheckouts.map((checkout) => {
              const loading = loadingId === checkout.id;
              const grandTotal = Number(checkout?.totals?.grandTotal ?? 0);
              const totalQuantity = checkout.totalQuantity ?? 0;
              const totalProducts = checkout.totalProducts ?? 0;

              return (
                <div
                  key={checkout.id}
                  className="
                    grid
                    grid-cols-[1.2fr_1.4fr_0.9fr_0.9fr_1.1fr_0.9fr_0.6fr]
                    items-center
                    gap-2
                    px-4
                    py-3.5
                    transition
                    hover:bg-gray-50/60
                  "
                >
                  {/* CHECKOUT REFERENCE */}
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-teal-50
                        text-teal-600
                        border
                        border-teal-100
                      "
                    >
                      <ShoppingBag size={15} />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-xs
                          font-semibold
                          text-gray-900
                          font-mono
                        "
                        title={checkout.id}
                      >
                        {checkout.id.substring(0, 12)}...
                      </p>
                      {checkout.couponCode && (
                        <span className="inline-block mt-0.5 rounded bg-emerald-50 px-1.5 py-0.2 text-[10px] font-medium text-emerald-700 border border-emerald-200">
                          Coupon: {checkout.couponCode}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CUSTOMER */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-xs font-semibold text-gray-800">
                        {checkout.customer?.name || "Customer"}
                      </p>
                    </div>
                    <p className="truncate text-[11px] text-gray-500 font-medium">
                      {checkout.customer?.phone || "No phone"}
                    </p>
                    {checkout.customer?.email && (
                      <p className="truncate text-[10px] text-gray-400">
                        {checkout.customer.email}
                      </p>
                    )}
                  </div>

                  {/* TOTAL QUANTITY */}
                  <div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-800">
                      {totalQuantity}
                    </span>
                    <p className="text-[10px] text-gray-400">
                      ({totalProducts} {totalProducts === 1 ? "product" : "products"})
                    </p>
                  </div>

                  {/* TOTAL AMOUNT */}
                  <div>
                    <p className="whitespace-nowrap text-xs font-bold text-gray-900">
                      ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    {checkout.totals.shippingCharge > 0 && (
                      <p className="text-[10px] text-gray-400">
                        incl. ₹{checkout.totals.shippingCharge} shipping
                      </p>
                    )}
                  </div>

                  {/* DATE & TIME */}
                  <div>
                    <p className="whitespace-nowrap text-xs font-medium text-gray-600">
                      {formatDate(checkout.createdAt)}
                    </p>
                  </div>

                  {/* STATUS */}
                  <div className="flex items-center">
                    <CheckoutStatusBadge
                      status={checkout.status}
                      isExpired={checkout.isExpired}
                    />
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                    {loading && (
                      <Loader2
                        className="animate-spin text-gray-400"
                        size={14}
                      />
                    )}

                    {/* VIEW BUTTON */}
                    <button
                      disabled={loading}
                      onClick={() => onView(checkout)}
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-md
                        border
                        border-teal-200
                        bg-teal-50
                        px-2.5
                        py-1.5
                        text-xs
                        font-medium
                        text-teal-700
                        transition
                        hover:bg-teal-100
                        hover:border-teal-300
                        disabled:opacity-40
                      "
                      title="View Details"
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </button>
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
          shadow-sm
        "
      >
        <p className="text-xs text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">
            {(currentPage - 1) * ITEMS_PER_PAGE + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-gray-700">
            {Math.min(currentPage * ITEMS_PER_PAGE, checkouts.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700">{checkouts.length}</span>{" "}
          abandoned checkouts
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
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
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
