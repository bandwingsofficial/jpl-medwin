"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, CreditCard, ShoppingBag } from "lucide-react";

export default function PaymentCancelledPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";

  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-3xl items-center justify-center px-4 py-10 select-none">
      {/* 👉 UI ENHANCEMENT: Restructured card body template metrics into premium shadow cards */}
      <div className="w-full rounded-3xl bg-white p-8 md:p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
        
        {/* WARNING BADGE STATUS GLYPH */}
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100/60 shadow-inner animate-bounce duration-1000">
          <AlertTriangle className="h-7 w-7" />
        </div>

        {/* TYPOGRAPHY HIERARCHY HEADER */}
        <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
          Payment Cancelled
        </h1>

        <p className="mt-2.5 text-sm font-medium text-gray-400 max-w-md leading-relaxed">
          The transaction process was interrupted because the payment terminal interface window was closed before completion. No funds have been deducted.
        </p>

        {/* DYNAMIC REFERENCE ID STRIP HEADER */}
        {orderId && (
          <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-2 font-mono text-xs font-bold text-gray-500 tracking-wide">
            ORDER REFERENCE ID: <span className="text-gray-800 ml-1 font-black">{orderId}</span>
          </div>
        )}

        {/* INTERACTIVE NAVIGATION BUTTONS MATRIX ROW */}
        <div className="mt-8 flex flex-col w-full sm:w-auto gap-3 sm:flex-row sm:justify-center">
          {/* RETRY PAYMENT ACTION ROUTE */}
          <Link
            href={`/checkout/payment?orderId=${orderId}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 h-11 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-blue-700 active:scale-98"
          >
            <CreditCard className="h-4 w-4" />
            <span>Retry Payment</span>
          </Link>

          {/* VIEW CURRENT ORDER LOG FILES */}
          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 h-11 text-xs font-bold uppercase tracking-wider text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 active:scale-98"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>View Orders</span>
          </Link>
        </div>

      </div>
    </div>
  );
}