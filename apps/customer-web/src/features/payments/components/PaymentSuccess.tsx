"use client";

import Link from "next/link";
import { CheckCircle2, PackageCheck, ArrowRight, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/shared/components/ui/dialog";

interface Props {
  orderId: string;
  open: boolean;
  onClose: () => void;
}

export const PaymentSuccess = ({
  orderId,
  open,
  onClose,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-8">
        <DialogHeader>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md p-1 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-inner">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <h2 className="text-2xl font-black tracking-tight text-gray-900">
            Payment Successful
          </h2>

          <p className="mt-2.5 text-sm text-gray-500 leading-relaxed">
            Thank you for your purchase! Your order has been registered and is
            being processed.
          </p>

          {orderId && (
            <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 font-mono text-xs font-bold text-gray-500">
              ORDER ID:
              <span className="ml-2 text-gray-900">
                {orderId}
              </span>
            </div>
          )}

          <div className="mt-8 flex w-full flex-col gap-3">
            <Link
              href={`/account/orders/${orderId}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-teal-700"
            >
              <PackageCheck className="h-4 w-4" />
              Track Order
            </Link>

            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};