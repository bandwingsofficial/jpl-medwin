"use client";

import { useEffect } from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { PaymentLoader } from "@/features/payments/components/PaymentLoader";

import {
  Dialog,
  DialogContent,
} from "@/shared/components/ui/dialog";

import { RazorpayButton } from "@/features/payments/components/RazorpayButton";

import { useCreatePayment } from "@/features/payments/hooks/useCreatePayment";

import { useRazorpay } from "@/features/payments/hooks/useRazorpay";
import { showError } from "@/shared/store/toast.store";

export default function PaymentPage() {
  /*
   |--------------------------------------------------------------------------
   | ROUTER
   |--------------------------------------------------------------------------
   */
  const router = useRouter();

  const searchParams =
    useSearchParams();
  
  /*
 |--------------------------------------------------------------------------
 | ORDER ID
 |--------------------------------------------------------------------------
 */

const orderId =
  searchParams.get("orderId");

const redeemedCoins =
  Number(
    searchParams.get("coins")
  ) || 0;
  /*
   |--------------------------------------------------------------------------
   | MUTATIONS
   |--------------------------------------------------------------------------
   */
  const createPaymentMutation =
    useCreatePayment();

  const {
    openRazorpay,
    isVerifying,
  } = useRazorpay();

  /*
   |--------------------------------------------------------------------------
   | VALIDATE ORDER
   |--------------------------------------------------------------------------
   */
  useEffect(() => {
    if (!orderId) {
      console.error(
        "ORDER ID MISSING"
      );

      router.replace("/cart");
    }
  }, [orderId, router]);

  /*
   |--------------------------------------------------------------------------
   | HANDLE PAYMENT
   |--------------------------------------------------------------------------
   */
  const handlePayment =
    async () => {
      try {
        /*
         |--------------------------------------------------------------------------
         | VALIDATE ORDER
         |--------------------------------------------------------------------------
         */
        if (!orderId) {
          console.error(
            "Order ID missing"
          );

          showError(
            "Order ID missing"
          );

          return;
        }

        /*
         |--------------------------------------------------------------------------
         | CREATE PAYMENT
         |--------------------------------------------------------------------------
         */
        const response =
  await createPaymentMutation.mutateAsync(
    {
      orderId,

      provider:
        "RAZORPAY",

      redeemedCoins,
    }
  );
        /*
         |--------------------------------------------------------------------------
         | FIXED PAYMENT DATA EXTRACTION
         |--------------------------------------------------------------------------
         */
        const payment =
  response;

/*
 |--------------------------------------------------------------------------
 | EXTRACT PROVIDER ORDER ID
 |--------------------------------------------------------------------------
 */

const providerOrderId =
  payment.providerResponse?.id ||
  payment.providerOrderId;
/*
 |--------------------------------------------------------------------------
 | VALIDATE PAYMENT
 |--------------------------------------------------------------------------
 */

if (
  !payment ||
  !payment.id ||
  !providerOrderId
) {
  console.error(
    "INVALID PAYMENT OBJECT:",
    payment
  );

  throw new Error(
    "Invalid payment response"
  );
}
        /*
         |--------------------------------------------------------------------------
         | OPEN RAZORPAY
         |--------------------------------------------------------------------------
         */
        await openRazorpay({
          paymentId:
            payment.id,

          orderId:
            payment.orderId ||
            orderId,

          providerOrderId:
            payment.providerOrderId,

          amount:
            payment.amount,
        });
      } catch (error: any) {
        console.error(
          "Payment initialization failed:",
          error
        );

        showError(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Payment initialization failed"
        );
      }
    };

  /*
   |--------------------------------------------------------------------------
   | EMPTY STATE
   |--------------------------------------------------------------------------
   */
  if (!orderId) {
    return null;
  }

  /*
   |--------------------------------------------------------------------------
   | RENDER
   |--------------------------------------------------------------------------
   */
  return (
  <Dialog
    open={true}
    onOpenChange={() =>
      router.push("/checkout")
    }
  >
    <DialogContent className="max-w-xl p-0 overflow-hidden">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Complete Payment
          </h1>

          <p className="mt-2 text-xs font-medium uppercase tracking-widest text-slate-500">
            Secure Checkout • Razorpay
          </p>
        </div>

        {/* LOADING */}
        {(createPaymentMutation.isPending ||
          isVerifying) && (
          <div className="py-10">
            <PaymentLoader />
          </div>
        )}

        {/* READY */}
        {!createPaymentMutation.isPending &&
          !isVerifying && (
            <div className="space-y-6">
              {/* ORDER INFO */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500">
                    Order Reference
                  </span>

                  <span className="font-mono text-sm font-bold text-slate-900">
                    #
                    {orderId
                      .slice(-8)
                      .toUpperCase()}
                  </span>
                </div>
              </div>

              {redeemedCoins > 0 && (
                <div
                  className="
                    rounded-xl
                    border
                    border-emerald-200
                    bg-emerald-50
                    p-4
                  "
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="
                        text-sm
                        font-medium
                        text-emerald-700
                      "
                    >
                      Coins Applied
                    </span>

                    <span
                      className="
                        text-sm
                        font-bold
                        text-emerald-700
                      "
                    >
                      {redeemedCoins} Coins
                    </span>
                  </div>
                </div>
              )}

              {/* PAYMENT BUTTON */}
              <div className="pt-2">
                <RazorpayButton
                  onClick={
                    handlePayment
                  }
                />
              </div>

              {/* FOOTER */}
              <p className="text-center text-[10px] text-slate-400">
                By clicking above,
                you agree to our
                terms of service.
                Your connection is
                encrypted.
              </p>
            </div>
          )}
      </div>
    </DialogContent>
  </Dialog>
);
}