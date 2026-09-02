"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  CreditCard,
  Banknote,
  X,
  ChevronRight,
  ShieldCheck,
  Lock,
} from "lucide-react";

interface PaymentMethodModalProps {
  open: boolean;
  grandTotal: number;
  isCodAllowed: boolean;
  selectedMethod?: "RAZORPAY" | "UPI" | "COD";
  onClose: () => void;
  onSelect: (method: "RAZORPAY" | "UPI" | "COD") => void;
}

export function PaymentMethodModal({
  open,
  grandTotal,
  isCodAllowed,
  selectedMethod,
  onClose,
  onSelect,
}: PaymentMethodModalProps) {
  const [mounted, setMounted] = useState(false);

  /*
   |--------------------------------------------------------------------------
   | CLIENT MOUNT
   |--------------------------------------------------------------------------
   |
   | Required because document.body does not exist during SSR.
   |
   */

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  /*
   |--------------------------------------------------------------------------
   | ESCAPE KEY
   |--------------------------------------------------------------------------
   */

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open, onClose]);

  /*
   |--------------------------------------------------------------------------
   | BODY SCROLL LOCK
   |--------------------------------------------------------------------------
   */

  useEffect(() => {
    if (!open || !mounted) {
      return;
    }

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [open, mounted]);

  /*
   |--------------------------------------------------------------------------
   | DO NOT RENDER
   |--------------------------------------------------------------------------
   */

  if (!open || !mounted) {
    return null;
  }

  /*
   |--------------------------------------------------------------------------
   | MODAL
   |--------------------------------------------------------------------------
   */

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[99999]
        flex
        min-h-screen
        items-center
        justify-center
        overflow-y-auto
        bg-slate-950/55
        p-3
        backdrop-blur-sm
        sm:p-5
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-method-title"
        className="
          relative
          my-auto
          w-full
          max-w-md
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-2xl
        "
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {/* ====================================================== */}
        {/* HEADER */}
        {/* ====================================================== */}

        <div
          className="
            flex
            items-start
            justify-between
            border-b
            border-slate-100
            px-4
            py-4
            sm:px-5
            sm:py-5
          "
        >
          <div className="min-w-0 pr-3">
            <h2
              id="payment-method-title"
              className="
                text-base
                font-bold
                text-slate-900
                sm:text-lg
              "
            >
              Select Payment Method
            </h2>

            <p
              className="
                mt-1
                text-xs
                leading-relaxed
                text-slate-500
                sm:text-sm
              "
            >
              Choose how you'd like to pay for your
              order.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment method modal"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              text-slate-500
              transition-colors
              hover:bg-slate-100
              hover:text-slate-900
              focus:outline-none
              focus:ring-2
              focus:ring-teal-500
              focus:ring-offset-2
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ====================================================== */}
        {/* ORDER TOTAL */}
        {/* ====================================================== */}

        <div
          className="
            mx-4
            mt-4
            flex
            items-center
            justify-between
            rounded-xl
            border
            border-slate-100
            bg-slate-50
            px-4
            py-3
            sm:mx-5
          "
        >
          <span
            className="
              text-xs
              font-medium
              text-slate-500
              sm:text-sm
            "
          >
            Order Total
          </span>

          <span
            className="
              text-base
              font-black
              text-slate-900
              sm:text-lg
            "
          >
            ₹{grandTotal.toLocaleString()}
          </span>
        </div>

        {/* ====================================================== */}
        {/* PAYMENT OPTIONS */}
        {/* ====================================================== */}

        <div className="space-y-3 p-4 sm:p-5">

          {/* -------------------------------------------------- */}
          {/* ONLINE PAYMENT */}
          {/* -------------------------------------------------- */}

          {(() => {
            const isOnlineSelected =
              selectedMethod === "RAZORPAY" || selectedMethod === "UPI";
            const isCodSelected = selectedMethod === "COD";

            return (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onSelect("RAZORPAY");
                  }}
                  className={`
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    border
                    p-3
                    text-left
                    transition-all
                    hover:border-teal-400
                    hover:bg-teal-50/40
                    hover:shadow-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-teal-500
                    focus:ring-offset-2
                    sm:gap-4
                    sm:p-4
                    ${
                      isOnlineSelected
                        ? "border-teal-600 bg-teal-50/30 ring-1 ring-teal-600"
                        : "border-slate-200 bg-white"
                    }
                  `}
                >
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-teal-50
                      text-teal-600
                      sm:h-12
                      sm:w-12
                    "
                  >
                    <CreditCard
                      className="
                        h-5
                        w-5
                        sm:h-6
                        sm:w-6
                      "
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                      "
                    >
                      <p
                        className="
                          text-sm
                          font-bold
                          text-slate-900
                          sm:text-base
                        "
                      >
                        Online Payment
                      </p>

                      <span
                        className="
                          rounded-full
                          bg-teal-50
                          px-2
                          py-0.5
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-wide
                          text-teal-700
                          sm:text-[10px]
                        "
                      >
                        Recommended
                      </span>

                      {isOnlineSelected && (
                        <span
                          className="
                            rounded-full
                            bg-emerald-50
                            px-2
                            py-0.5
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-wide
                            text-emerald-700
                            sm:text-[10px]
                          "
                        >
                          Selected
                        </span>
                      )}
                    </div>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-slate-500
                        sm:text-sm
                      "
                    >
                      UPI, Cards, Net Banking
                    </p>
                  </div>

                  <ChevronRight
                    className="
                      h-5
                      w-5
                      shrink-0
                      text-slate-400
                      transition-transform
                      group-hover:translate-x-0.5
                      group-hover:text-teal-600
                    "
                  />
                </button>

                {/* -------------------------------------------------- */}
                {/* CASH ON DELIVERY */}
                {/* -------------------------------------------------- */}

                <button
                  type="button"
                  disabled={!isCodAllowed}
                  aria-disabled={!isCodAllowed}
                  onClick={() => {
                    if (!isCodAllowed) {
                      return;
                    }

                    onSelect("COD");
                  }}
                  className={`
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    border
                    p-3
                    text-left
                    transition-all
                    focus:outline-none
                    sm:gap-4
                    sm:p-4
                    ${
                      isCodAllowed
                        ? isCodSelected
                          ? "border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-600 hover:border-emerald-400"
                          : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40 hover:shadow-sm focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        : "cursor-not-allowed border-slate-200 bg-slate-50 opacity-70"
                    }
                  `}
                >
                  <div
                    className={`
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      sm:h-12
                      sm:w-12
                      ${
                        isCodAllowed
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-400"
                      }
                    `}
                  >
                    {isCodAllowed ? (
                      <Banknote
                        className="
                          h-5
                          w-5
                          sm:h-6
                          sm:w-6
                        "
                      />
                    ) : (
                      <Lock
                        className="
                          h-5
                          w-5
                          sm:h-6
                          sm:w-6
                        "
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className="
                          text-sm
                          font-bold
                          text-slate-900
                          sm:text-base
                        "
                      >
                        Cash on Delivery
                      </p>

                      {isCodSelected && isCodAllowed && (
                        <span
                          className="
                            rounded-full
                            bg-emerald-50
                            px-2
                            py-0.5
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-wide
                            text-emerald-700
                            sm:text-[10px]
                          "
                        >
                          Selected
                        </span>
                      )}
                    </div>

                    {isCodAllowed ? (
                      <p
                        className="
                          mt-0.5
                          text-xs
                          text-slate-500
                          sm:text-sm
                        "
                      >
                        Pay when your order is delivered
                      </p>
                    ) : (
                      <p
                        className="
                          mt-0.5
                          text-xs
                          font-medium
                          leading-relaxed
                          text-amber-700
                          sm:text-sm
                        "
                      >
                        Available only for orders below ₹10,000
                      </p>
                    )}
                  </div>

                  {isCodAllowed && (
                    <ChevronRight
                      className="
                        h-5
                        w-5
                        shrink-0
                        text-slate-400
                        transition-transform
                        group-hover:translate-x-0.5
                        group-hover:text-emerald-600
                      "
                    />
                  )}
                </button>
              </>
            );
          })()}
        </div>

        {/* ====================================================== */}
        {/* SECURITY */}
        {/* ====================================================== */}

        <div
          className="
            mx-4
            mb-4
            flex
            items-center
            gap-2.5
            rounded-lg
            border
            border-slate-100
            bg-slate-50
            p-3
            sm:mx-5
            sm:mb-5
          "
        >
          <ShieldCheck
            className="
              h-4
              w-4
              shrink-0
              text-emerald-600
            "
          />

          <p
            className="
              text-[10px]
              leading-relaxed
              text-slate-500
              sm:text-xs
            "
          >
            Secure payment selection. Your payment
            information is protected.
          </p>
        </div>

        {/* ====================================================== */}
        {/* CANCEL */}
        {/* ====================================================== */}

        <div
          className="
            border-t
            border-slate-100
            px-4
            py-3
            sm:px-5
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              w-full
              rounded-lg
              px-4
              py-2.5
              text-sm
              font-semibold
              text-slate-600
              transition-colors
              hover:bg-slate-100
              hover:text-slate-900
              focus:outline-none
              focus:ring-2
              focus:ring-slate-400
              focus:ring-offset-2
            "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}