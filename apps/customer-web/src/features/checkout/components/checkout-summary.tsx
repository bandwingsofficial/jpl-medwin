"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { RedeemCard } from "@/features/coins/components/redeem-card";

import { useRouter } from "next/navigation";

import {
  ShieldCheck,
  Loader2,
  Lock,
  CheckCircle2,
  CreditCard,
} from "lucide-react";

import { CheckoutSession } from "@/features/checkout/types/checkout.type";

import { useCreateOrder } from "@/features/orders/hooks/use-create-order";

import { useCreatePayment } from "@/features/payments/hooks/useCreatePayment";
import { useRazorpay } from "@/features/payments/hooks/useRazorpay";

import { SavedAddress } from "@/features/address/types/address.type";

import { showError } from "@/shared/store/toast.store";
import { CodOrderSuccess } from
  "@/features/payments/components/cod-order-success";

import { PaymentMethodModal } from
  "@/features/checkout/components/payment-method-modal";

interface CheckoutSummaryProps {
  checkout?: CheckoutSession | null;

  selectedAddress?: SavedAddress | null;

  selectedBillingAddress?: SavedAddress | null;

  isBillingSameAsShipping: boolean;

  customerNote?: string;

  paymentMethod: "RAZORPAY" | "UPI" | "COD";

  gstNumber?: string;
}

export function CheckoutSummary({
  checkout,
  selectedAddress,
  selectedBillingAddress,
  isBillingSameAsShipping,
  customerNote,
  paymentMethod,
  gstNumber,
}: CheckoutSummaryProps) {
  /*
   |--------------------------------------------------------------------------
   | ROUTER
   |--------------------------------------------------------------------------
   */

  const router = useRouter();
  const queryClient = useQueryClient();

  const [
    codSuccessOpen,
    setCodSuccessOpen,
  ] = useState(false);

  const [
    codOrderId,
    setCodOrderId,
  ] = useState("");

  /*
   |--------------------------------------------------------------------------
   | PAYMENT METHOD MODAL
   |--------------------------------------------------------------------------
   */

  const [
    paymentMethodModalOpen,
    setPaymentMethodModalOpen,
  ] = useState(false);

  /*
   |--------------------------------------------------------------------------
   | MUTATIONS
   |--------------------------------------------------------------------------
   */

  const createOrderMutation =
    useCreateOrder();

  const createPaymentMutation =
    useCreatePayment();

  const { openRazorpay, isVerifying } =
    useRazorpay();

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

  const overweightDeliveryCharge =
    summary?.overweightDeliveryCharge ||
    checkout?.totals?.overweightDeliveryCharge ||
    0;

  const tax =
    summary?.tax || 0;

  /*
   |--------------------------------------------------------------------------
   | BACKEND SOURCE OF TRUTH
   |--------------------------------------------------------------------------
   */

  const grandTotal =
    summary?.grandTotal || 0;

  const COD_MAX_AMOUNT = 10_000;

  const isCodAllowed =
    grandTotal < COD_MAX_AMOUNT;

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
   | PAYMENT PROCESSING
   |--------------------------------------------------------------------------
   |
   | This function contains the existing COD and online payment flows.
   |
   */

  const handlePaymentMethodSelect = async (
    selectedPaymentMethod: "RAZORPAY" | "UPI" | "COD"
  ) => {
    console.log("🔥 PAYMENT METHOD SELECTED:", selectedPaymentMethod);
    console.log("[handlePaymentMethodSelect] Triggered with method:", selectedPaymentMethod, "checkoutId:", checkout?.id, "shippingAddressId:", selectedAddress?.id);

    /*
     |--------------------------------------------------------------------------
     | PREVENT MULTIPLE CLICKS
     |--------------------------------------------------------------------------
     */

    if (
      isRedirecting ||
      createOrderMutation.isPending ||
      createPaymentMutation.isPending ||
      isVerifying
    ) {
      console.warn("[handlePaymentMethodSelect] Blocked by pending/redirecting state:", {
        isRedirecting,
        isOrderPending: createOrderMutation.isPending,
        isPaymentPending: createPaymentMutation.isPending,
        isVerifying,
      });
      return;
    }

    /*
     |--------------------------------------------------------------------------
     | CLOSE PAYMENT METHOD MODAL IF OPEN
     |--------------------------------------------------------------------------
     */

    setPaymentMethodModalOpen(false);

    try {
      /*
       |--------------------------------------------------------------------------
       | COD LIMIT VALIDATION
       |--------------------------------------------------------------------------
       */

      if (
        selectedPaymentMethod === "COD" &&
        !isCodAllowed
      ) {
        showError(
          "Cash on Delivery is available only for orders below ₹10,000. Please choose an online payment method."
        );

        return;
      }

      const shippingAddressId = selectedAddress?.id;
      const billingAddressId = isBillingSameAsShipping
        ? selectedAddress?.id
        : selectedBillingAddress?.id || selectedAddress?.id;

      if (!shippingAddressId) {
        showError("Please select a shipping address");
        return;
      }

      const formattedGstNumber =
        gstNumber && gstNumber.trim()
          ? gstNumber.trim().toUpperCase()
          : undefined;

      /*
       |--------------------------------------------------------------------------
       | 1. CASH ON DELIVERY (COD) FLOW - Creates order immediately
       |--------------------------------------------------------------------------
       */

      if (
        selectedPaymentMethod === "COD"
      ) {
        setIsRedirecting(true);
        console.log("🔥 ABOUT TO CREATE COD ORDER", {
          checkoutSessionId: checkout?.id,
          shippingAddressId,
          billingAddressId,
          paymentMethod: selectedPaymentMethod,
        });

        const response =
          await createOrderMutation.mutateAsync({
            checkoutSessionId:
              checkout!.id,

            shippingAddressId,

            billingAddressId:
              billingAddressId!,

            isBillingSameAsShipping,

            customerNote,

            gstNumber:
              formattedGstNumber,

            paymentMethod:
              selectedPaymentMethod,
          });
        console.log("🔥 ORDER API RETURNED:", response);

        const order =
          response as any;

        const orderId =
          order?.id ||
          order?.orderId ||
          order?.data?.id ||
          order?.data?.orderId;

        if (!orderId) {
          console.error(
            "INVALID ORDER RESPONSE:",
            response
          );

          throw new Error(
            "Order creation failed"
          );
        }

        // Clear checkout session storage
        try {
          sessionStorage.removeItem(
            "checkout-session-id"
          );
        } catch {
          // ignore storage errors
        }

        // Invalidate queries in background
        queryClient.removeQueries({
          queryKey: ["cart"],
        });

        void Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["cart"],
          }),

          queryClient.invalidateQueries({
            queryKey: ["checkout-session"],
          }),

          queryClient.invalidateQueries({
            queryKey: ["orders"],
          }),

          queryClient.invalidateQueries({
            queryKey: ["wallet"],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "wallet-transactions",
            ],
          }),
        ]);

        router.replace(
          `/checkout/success?orderId=${orderId}&paymentMethod=COD`
        );
        return;
      }

      /*
       |--------------------------------------------------------------------------
       | 2. ONLINE PAYMENT FLOW (RAZORPAY / UPI)
       |
       | DO NOT CREATE ORDER HERE!
       | We only create a payment attempt with checkoutSessionId.
       | The Order is created atomically AFTER payment is verified.
       |--------------------------------------------------------------------------
       */

      setIsRedirecting(true);

      const paymentResponse =
        await createPaymentMutation.mutateAsync({
          checkoutSessionId:
            checkout!.id,

          provider: "RAZORPAY",

          shippingAddressId,

          billingAddressId:
            billingAddressId!,

          isBillingSameAsShipping,

          customerNote,

          gstNumber:
            formattedGstNumber,
        });

      const payment = paymentResponse as any;
      const paymentId = payment?.id || payment?.data?.id;
      const providerOrderId = payment?.providerOrderId || payment?.data?.providerOrderId;
      const paymentAmount = payment?.amount ?? payment?.data?.amount ?? grandTotal;

      if (
        !paymentId ||
        !providerOrderId
      ) {
        throw new Error(
          "Failed to initialize payment gateway"
        );
      }

      await openRazorpay({
        paymentId,

        checkoutSessionId:
          checkout!.id,

        providerOrderId,

        amount:
          paymentAmount,

        customerName:
          selectedAddress?.fullName || "",

        customerPhone:
          selectedAddress?.phoneNumber || "",

        onDismiss: () => {
          setIsRedirecting(false);
        },

        onFailed: () => {
          setIsRedirecting(false);

          showError(
            "Payment was not completed. You can try again."
          );
        },

        onSuccess: (
          confirmedOrderId
        ) => {
          setIsRedirecting(false);

          if (!confirmedOrderId) {
            showError(
              "Payment was not completed. You can try again."
            );
            return;
          }

          router.replace(
            `/checkout/success?orderId=${confirmedOrderId}`
          );
        },
      });
    } catch (error: any) {
      console.error(
        "Checkout / Payment Error:",
        error
      );

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to proceed to payment";

      showError(errorMessage);
    } finally {
      setIsRedirecting(false);
    }
  };

  /*
   |--------------------------------------------------------------------------
   | PROCEED TO PAYMENT
   |--------------------------------------------------------------------------
   */

  const handleProceedToPayment = () => {
    /*
     |--------------------------------------------------------------------------
     | PREVENT MULTIPLE CLICKS
     |--------------------------------------------------------------------------
     */

    if (
      isRedirecting ||
      createOrderMutation.isPending ||
      createPaymentMutation.isPending ||
      isVerifying
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

      if (isCheckoutCompleted) {
        showError(
          "Checkout already completed."
        );

        return;
      }

      if (isCheckoutExpired) {
        showError(
          "Checkout session expired. Please restart checkout."
        );

        return;
      }

      if (!isCheckoutActive) {
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

      if (!isBillingSameAsShipping && !selectedBillingAddress?.id) {
        showError(
          "Please select a billing address"
        );

        return;
      }

      /*
       |--------------------------------------------------------------------------
       | GST VALIDATION
       |--------------------------------------------------------------------------
       */

      if (
        gstNumber &&
        gstNumber.trim()
      ) {
        const cleanGst =
          gstNumber
            .trim()
            .toUpperCase();

        const gstinRegex =
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

        if (
          !gstinRegex.test(
            cleanGst
          )
        ) {
          showError(
            "Please enter a valid GST number."
          );

          return;
        }
      }

      /*
 |-------------------------------------------------------------------------- 
 | OPEN PAYMENT METHOD MODAL
 |-------------------------------------------------------------------------- 
 */

setPaymentMethodModalOpen(true);
    } catch (error: any) {
      console.error(
        "Checkout / Payment Error:",
        error
      );

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to proceed to payment";

      showError(errorMessage);
    }
  };

  return (
    <>
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

          {overweightDeliveryCharge > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Overweight Delivery Charge
              </span>

              <span className="text-sm font-semibold text-amber-700">
                +₹
                {overweightDeliveryCharge.toLocaleString()}
              </span>
            </div>
          )}
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
            createPaymentMutation.isPending ||
            isVerifying ||
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
          createOrderMutation.isPending ||
          createPaymentMutation.isPending ||
          isVerifying ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : paymentMethod === "COD" ? (
            "Place Order (Cash on Delivery)"
          ) : (
            `Pay ₹${grandTotal.toLocaleString()}`
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

      {/* PAYMENT METHOD MODAL */}

      <PaymentMethodModal
        open={
          paymentMethodModalOpen
        }
        grandTotal={grandTotal}
        isCodAllowed={
          isCodAllowed
        }
        selectedMethod={
          paymentMethod
        }
        onClose={() => {
          if (
            isRedirecting ||
            createOrderMutation.isPending ||
            createPaymentMutation.isPending ||
            isVerifying
          ) {
            return;
          }

          setPaymentMethodModalOpen(
            false
          );
        }}
       onSelect={(method) => {
  handlePaymentMethodSelect(method);
}}
      />

      {/* COD SUCCESS */}

      <CodOrderSuccess
        orderId={codOrderId}
        open={codSuccessOpen}
        onClose={() => {
          setCodSuccessOpen(false);
          router.push("/");
        }}
      />
    </>
  );
}