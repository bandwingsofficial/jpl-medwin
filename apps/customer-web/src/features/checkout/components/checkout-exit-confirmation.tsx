"use client";

import { AlertTriangle, X } from "lucide-react";

interface CheckoutExitConfirmationProps {
  open: boolean;
  onContinue: () => void;
  onExit: () => void;
}

export function CheckoutExitConfirmation({
  open,
  onContinue,
  onExit,
}: CheckoutExitConfirmationProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-exit-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>

            <button
              type="button"
              onClick={onContinue}
              aria-label="Close"
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5">
            <h2
              id="checkout-exit-title"
              className="text-xl font-bold tracking-tight text-slate-900"
            >
              Leave checkout?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your checkout progress may not be saved if you leave this page.
              Are you sure you want to exit?
            </p>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onContinue}
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Continue Checkout
            </button>

            <button
              type="button"
              onClick={onExit}
              className="h-11 rounded-xl bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              Exit Anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}