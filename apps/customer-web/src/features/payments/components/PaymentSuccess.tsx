"use client";

import Link from "next/link";

import {
  CheckCircle2,
  PackageCheck,
  ArrowRight,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/shared/components/ui/dialog";

interface Props {
  orderId: string;

  isCod?: boolean;

  open: boolean;

  onClose: () => void;
}

export const PaymentSuccess = ({
  orderId,
  isCod = false,
  open,
  onClose,
}: Props) => {
  const title = isCod
    ? "Order Placed Successfully"
    : "Payment Successful";

  const description = isCod
    ? "Thank you for your purchase! Your order has been placed successfully. You can pay when your order is delivered."
    : "Thank you for your purchase! Your payment was successful and your order is being processed.";

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
    <DialogContent
  className="
    w-[calc(100%-2rem)]
    max-w-md
    p-8
  "
>
        <DialogHeader>
          <button
            type="button"
            onClick={onClose}
            className="
              absolute
              right-4
              top-4
              rounded-md
              p-1
              hover:bg-gray-100
            "
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            text-center
          "
        >
          {/* SUCCESS ICON */}
          <div
            className="
              mb-5
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              border
              border-emerald-100
              bg-emerald-50
              text-emerald-600
              shadow-inner
            "
          >
            <CheckCircle2 className="h-7 w-7" />
          </div>

          {/* TITLE */}
          <h2
            className="
              text-2xl
              font-black
              tracking-tight
              text-gray-900
            "
          >
            {title}
          </h2>

          {/* DESCRIPTION */}
          <p
            className="
              mt-2.5
              text-sm
              leading-relaxed
              text-gray-500
            "
          >
            {description}
          </p>

          {/* COD BADGE */}
          {isCod && (
            <div
              className="
                mt-4
                rounded-full
                bg-amber-50
                px-4
                py-2
                text-xs
                font-semibold
                text-amber-700
                ring-1
                ring-amber-200
              "
            >
              Cash on Delivery
            </div>
          )}

          {/* ORDER ID */}
          {orderId && (
            <div
              className="
                mt-5
                rounded-xl
                border
                border-gray-100
                bg-gray-50
                px-4
                py-2
                font-mono
                text-xs
                font-bold
                text-gray-500
              "
            >
              ORDER ID:

              <span
                className="
                  ml-2
                  text-gray-900
                "
              >
                {orderId}
              </span>
            </div>
          )}

          {/* ACTIONS */}
          <div
            className="
              mt-8
              flex
              w-full
              flex-col
              gap-3
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
                  px-6
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
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
                border-gray-200
                bg-white
                px-6
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-gray-700
                transition-colors
                hover:bg-gray-50
              "
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