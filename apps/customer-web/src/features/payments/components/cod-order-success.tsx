"use client";

import Link from "next/link";

import {
  CheckCircle2,
  PackageCheck,
  ArrowRight,
  X,
  Banknote,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/shared/components/ui/dialog";

interface CodOrderSuccessProps {
  orderId: string;

  open: boolean;

  onClose: () => void;
}

export const CodOrderSuccess = ({
  orderId,
  open,
  onClose,
}: CodOrderSuccessProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="
          max-w-md
          overflow-hidden
          p-0
        "
      >
        <DialogHeader className="sr-only">
          Order Placed Successfully
        </DialogHeader>

        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="
            absolute
            right-4
            top-4
            z-10
            rounded-lg
            p-2
            text-slate-400
            transition-colors
            hover:bg-slate-100
            hover:text-slate-700
          "
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-7 sm:p-8">
          <div
            className="
              flex
              flex-col
              items-center
              text-center
            "
          >
            {/* SUCCESS ICON */}
            <div
              className="
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-emerald-50
                text-emerald-600
                ring-1
                ring-emerald-100
              "
            >
              <CheckCircle2 className="h-8 w-8" />
            </div>

            {/* TITLE */}
            <h2
              className="
                text-2xl
                font-bold
                tracking-tight
                text-slate-900
              "
            >
              Order Placed Successfully!
            </h2>

            {/* DESCRIPTION */}
            <p
              className="
                mt-3
                max-w-sm
                text-sm
                leading-6
                text-slate-500
              "
            >
              Thank you for your order. Your order has been
              placed successfully and will be processed shortly.
            </p>

            {/* COD INFO */}
            <div
              className="
                mt-5
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                border
                border-amber-100
                bg-amber-50
                px-4
                py-3
                text-left
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-amber-100
                  text-amber-700
                "
              >
                <Banknote className="h-5 w-5" />
              </div>

              <div>
                <p
                  className="
                    text-sm
                    font-semibold
                    text-amber-900
                  "
                >
                  Cash on Delivery
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-amber-700
                  "
                >
                  Pay when your order is delivered.
                </p>
              </div>
            </div>

            {/* ORDER ID */}
            {orderId && (
              <div
                className="
                  mt-5
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-3
                "
              >
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Order ID
                </p>

                <p
                  className="
                    mt-1
                    break-all
                    font-mono
                    text-xs
                    font-semibold
                    text-slate-700
                  "
                >
                  {orderId}
                </p>
              </div>
            )}

            {/* ACTIONS */}
            <div
              className="
                mt-7
                flex
                w-full
                flex-col
                gap-2.5
              "
            >
              {orderId && (
                <Link
                  href={`/account/orders/${orderId}`}
                  className="
                    inline-flex
                    h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-teal-600
                    px-5
                    text-sm
                    font-semibold
                    text-white
                    transition-colors
                    hover:bg-teal-700
                  "
                >
                  <PackageCheck className="h-4 w-4" />

                  Track Order
                </Link>
              )}

              <Link
                href="/"
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-5
                  text-sm
                  font-semibold
                  text-slate-700
                  transition-colors
                  hover:bg-slate-50
                "
              >
                Continue Shopping

                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};