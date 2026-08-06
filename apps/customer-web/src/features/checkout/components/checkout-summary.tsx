"use client";

import { useState } from "react";

import { RedeemCard } from "@/features/coins/components/redeem-card";

import { useRouter } from "next/navigation";

import {
  ShieldCheck,
  Loader2,
  Lock,
  CheckCircle2,
} from "lucide-react";

import { CheckoutSession } from "@/features/checkout/types/checkout.type";

import { useCreateOrder } from "@/features/orders/hooks/use-create-order";

import { SavedAddress } from "@/features/address/types/address.type";

import { showError } from "@/shared/store/toast.store";

interface CheckoutSummaryProps {
  checkout?: CheckoutSession | null;

  selectedAddress?: SavedAddress | null;

  selectedBillingAddress?: SavedAddress | null;

  isBillingSameAsShipping: boolean;

  customerNote?: string;
}

export function CheckoutSummary({
  checkout,
  selectedAddress,
  selectedBillingAddress,
  isBillingSameAsShipping,
  customerNote,
}: CheckoutSummaryProps) {
  /*
   |--------------------------------------------------------------------------
   | ROUTER
   |--------------------------------------------------------------------------
   */

  const router = useRouter();

  /*
   |--------------------------------------------------------------------------
   | MUTATIONS
   |--------------------------------------------------------------------------
   */

  const createOrderMutation =
    useCreateOrder();

  /*
   |--------------------------------------------------------------------------
   | LOCAL STATE
   |--------------------------------------------------------------------------
   */

  const [
    isRedirecting,
    setIsRedirecting,
  ] = useState(false);

  /*
   |--------------------------------------------------------------------------
   | DATA
   |--------------------------------------------------------------------------
   */

  const summary =
    checkout?.summary;

  const subtotal =
    summary?.subtotal || 0;

  const totalSavings =
    summary?.totalSavings || 0;

  const shipping =
    summary?.shipping || 0;

  const tax =
    summary?.tax || 0;

  /*
   |--------------------------------------------------------------------------
   | BACKEND SOURCE OF TRUTH
   |--------------------------------------------------------------------------
   */

  const grandTotal =
    summary?.grandTotal || 0;

  /*
   |--------------------------------------------------------------------------
   | REWARD DATA
   |--------------------------------------------------------------------------
   */

  const rewardDiscount =
    summary?.rewardDiscount || 0;

  /*
   |--------------------------------------------------------------------------
   | CHECKOUT STATUS
   |--------------------------------------------------------------------------
   */

  const isCheckoutActive =
    checkout?.status ===
    "ACTIVE";

  const isCheckoutCompleted =
    checkout?.status ===
    "COMPLETED";

  const isCheckoutExpired =
    checkout?.status ===
    "EXPIRED";

  /*
   |--------------------------------------------------------------------------
   | FORMAT ADDRESS
   |--------------------------------------------------------------------------
   */

 
  /*
   |--------------------------------------------------------------------------
   | HANDLERS
   |--------------------------------------------------------------------------
   */

  const handleProceedToPayment =
    async () => {
      /*
       |--------------------------------------------------------------------------
       | PREVENT MULTIPLE CLICKS
       |--------------------------------------------------------------------------
       */

      if (
        isRedirecting ||
        createOrderMutation.isPending
      ) {
        return;
      }

      try {
        /*
         |--------------------------------------------------------------------------
         | VALIDATIONS
         |--------------------------------------------------------------------------
         */

        if (!checkout?.id) {
          console.error(
            "Checkout session missing"
          );

          showError(
            "Checkout session missing. Please refresh the page."
          );

          return;
        }

        /*
         |--------------------------------------------------------------------------
         | CHECKOUT STATUS VALIDATION
         |--------------------------------------------------------------------------
         */

        if (
          isCheckoutCompleted
        ) {
          showError(
            "Checkout already completed."
          );

          return;
        }

        if (
          isCheckoutExpired
        ) {
          showError(
            "Checkout session expired. Please restart checkout."
          );

          return;
        }

        if (
          !isCheckoutActive
        ) {
          showError(
            "Invalid checkout session."
          );

          return;
        }

        /*
         |--------------------------------------------------------------------------
         | ADDRESS VALIDATION
         |--------------------------------------------------------------------------
         */

       if (!selectedAddress?.id) {
  showError(
    "Please select a shipping address"
  );

  return;
}

        setIsRedirecting(true);

        /*
         |--------------------------------------------------------------------------
         | CREATE ORDER
         |--------------------------------------------------------------------------
         */

        const response =
  await createOrderMutation.mutateAsync({
  checkoutSessionId: checkout.id,

  shippingAddressId: selectedAddress.id,

  billingAddressId: isBillingSameAsShipping
    ? selectedAddress.id
    : selectedBillingAddress!.id,

  isBillingSameAsShipping,

  customerNote,
});
        /*
         |--------------------------------------------------------------------------
         | EXTRACT ORDER
         |--------------------------------------------------------------------------
         */

        const order =
          response as any;

        const orderId =
          order?.id ||
          order?.orderId;

        if (!orderId) {
          console.error(
            "INVALID ORDER RESPONSE:",
            response
          );

          throw new Error(
            "Order creation failed"
          );
        }

        /*
         |--------------------------------------------------------------------------
         | REDIRECT TO PAYMENT PAGE
         |--------------------------------------------------------------------------
         */

        router.push(
          `/checkout/payment?orderId=${orderId}`
        );
      } catch (error: any) {
        console.error(
          "Order Creation Error:",
          error
        );

        const errorMessage =
          error?.response?.data
            ?.message ||
          error?.message ||
          "Failed to proceed to payment";

        showError(errorMessage);
      } finally {
        setIsRedirecting(false);
      }
    };

  return (
    <div
      className="
        sticky
        top-6
        rounded-xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
      "
    >
      {/* HEADER */}

      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">
          Order Summary
        </h2>

        <p className="text-xs text-slate-500">
          Review your final totals
        </p>
      </div>

      {/* ====================================================== */}
      {/* CHECKOUT STATUS */}
      {/* ====================================================== */}

      {isCheckoutActive && (
        <div
          className="
            mb-4
            flex
            items-start
            gap-2
            rounded-lg
            border
            border-yellow-200
            bg-yellow-50
            p-3
          "
        >
          <Lock
            size={18}
            className="text-yellow-600"
          />

          <div>
            <p
              className="
                text-xs
                font-semibold
                text-yellow-800
              "
            >
              Checkout Locked
            </p>

            <p
              className="
                text-[11px]
                text-yellow-700
              "
            >
              Cart editing is disabled during checkout.
            </p>
          </div>
        </div>
      )}

      {isCheckoutCompleted && (
        <div
          className="
            mb-4
            flex
            items-start
            gap-2
            rounded-lg
            border
            border-green-200
            bg-green-50
            p-3
          "
        >
          <CheckCircle2
            size={18}
            className="text-green-600"
          />

          <div>
            <p
              className="
                text-xs
                font-semibold
                text-green-800
              "
            >
              Checkout Completed
            </p>

            <p
              className="
                text-[11px]
                text-green-700
              "
            >
              Your order has already been processed.
            </p>
          </div>
        </div>
      )}

      {/* PRICE DETAILS */}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">
            Subtotal
          </span>

          <span className="text-sm font-semibold text-slate-900">
            ₹{subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">
            Discount
          </span>

          <span className="text-sm font-semibold text-emerald-600">
            - ₹
            {totalSavings.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">
            Shipping
          </span>

          <span className="text-sm font-semibold text-slate-900">
            {shipping === 0 ? (
              <span className="text-emerald-600">
                FREE
              </span>
            ) : (
              `₹${shipping.toLocaleString()}`
            )}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">
            Estimated Tax
          </span>

          <span className="text-sm font-semibold text-slate-900">
            ₹{tax.toLocaleString()}
          </span>
        </div>
      </div>

      {/* REDEEM CARD */}

{checkout?.id && (
  <RedeemCard
    checkoutSessionId={
      checkout.id
    }
    onValidated={() => {
      /*
       |--------------------------------------------------------------------------
       | BACKEND IS SOURCE OF TRUTH
       |--------------------------------------------------------------------------
       |
       | Rewards are now validated and calculated
       | entirely by backend apply-rewards API.
       |
       | Checkout session refetch updates totals.
       |
       */
    }}
  />
)}

      {/* DIVIDER */}

      <div className="my-4 border-t border-dashed border-slate-200" />

      {/* REWARD DISCOUNT */}

      {rewardDiscount > 0 && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">
              Reward Coins
            </span>

            <span className="text-sm font-semibold text-emerald-600">
              - ₹
              {rewardDiscount.toLocaleString()}
            </span>
          </div>

          <div className="my-4 border-t border-dashed border-slate-200" />
        </>
      )}

      {/* TOTAL */}

      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900">
            Total Amount
          </p>

          <p className="text-[10px] uppercase tracking-wider text-slate-400">
            Inclusive of taxes
          </p>
        </div>

        <div className="text-2xl font-black text-slate-900">
          ₹{grandTotal.toLocaleString()}
        </div>
      </div>

      {/* SAVINGS */}

      {totalSavings > 0 && (
        <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-center">
          <p className="text-xs font-bold text-emerald-700">
            You're saving ₹
            {totalSavings.toLocaleString()}{" "}
            on this order
          </p>
        </div>
      )}

      {/* PAYMENT BUTTON */}

      <button
        type="button"
        onClick={
          handleProceedToPayment
        }
        disabled={
          grandTotal <= 0 ||
          isRedirecting ||
          createOrderMutation.isPending ||
          !isCheckoutActive
        }
        className="
          mt-5
          flex
          h-12
          w-full
          items-center
          justify-center
          rounded-lg
          bg-teal-600
          text-sm
          font-bold
          text-white
          transition-all
          hover:bg-teal-700
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        {isRedirecting ||
        createOrderMutation.isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          "Proceed to Payment"
        )}
      </button>

      {/* SECURITY */}

      <div
        className="
          mt-4
          flex
          items-center
          gap-2.5
          rounded-lg
          border
          border-slate-100
          bg-slate-50/50
          p-3
        "
      >
        <ShieldCheck
          size={18}
          className="text-emerald-600"
        />

        <div>
          <p className="text-[11px] font-bold text-slate-900">
            Secure Checkout
          </p>

          <p className="text-[10px] text-slate-500">
            SSL Encrypted & Verified
          </p>
        </div>
      </div>
    </div>
  );
}