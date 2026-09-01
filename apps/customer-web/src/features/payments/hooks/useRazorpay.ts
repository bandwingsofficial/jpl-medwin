"use client";

import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

import { useVerifyPayment } from "./useVerifyPayment";

import { loadRazorpay } from "../utils/razorpay";

interface OpenRazorpayOptions {
  paymentId: string;

  checkoutSessionId?: string;

  orderId?: string;

  providerOrderId: string;

  amount: number;

  customerName?: string;

  customerEmail?: string;

  customerPhone?: string;

  onDismiss?: () => void;

  onFailed?: (error?: any) => void;

  onSuccess?: (orderId: string) => void;
}

export const useRazorpay = () => {
  /*
   |--------------------------------------------------------------------------
   | ROUTER
   |--------------------------------------------------------------------------
   */

  const router = useRouter();

  /*
   |--------------------------------------------------------------------------
   | QUERY CLIENT
   |--------------------------------------------------------------------------
   */

  const queryClient = useQueryClient();

  /*
   |--------------------------------------------------------------------------
   | MUTATIONS
   |--------------------------------------------------------------------------
   */

  const verifyPaymentMutation = useVerifyPayment();

  /*
   |--------------------------------------------------------------------------
   | OPEN RAZORPAY
   |--------------------------------------------------------------------------
   */

  const openRazorpay = async ({
    paymentId,
    checkoutSessionId,
    orderId,
    providerOrderId,
    amount,
    customerName,
    customerEmail,
    customerPhone,
    onDismiss,
    onFailed,
    onSuccess,
  }: OpenRazorpayOptions) => {
    try {
      /*
       |--------------------------------------------------------------------------
       | LOAD SDK
       |--------------------------------------------------------------------------
       */

      const loaded = await loadRazorpay();

      if (!loaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      /*
       |--------------------------------------------------------------------------
       | VALIDATE PROVIDER ORDER ID
       |--------------------------------------------------------------------------
       */

      if (!providerOrderId) {
        console.error("INVALID PROVIDER ORDER ID:", providerOrderId);

        throw new Error("Invalid Razorpay order id from backend");
      }

      /*
       |--------------------------------------------------------------------------
       | GET RAZORPAY KEY
       |--------------------------------------------------------------------------
       */

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        throw new Error("Missing Razorpay key");
      }

      /*
       |--------------------------------------------------------------------------
       | RAZORPAY OPTIONS
       |--------------------------------------------------------------------------
       */

      const options = {
        key: razorpayKey,

        amount: Math.round(amount * 100),

        currency: "INR",

        name: "JPL Medwin",

        description: "Order Payment",

        image: "/logo.png",

        order_id: providerOrderId,

        prefill: {
          name: customerName || "",

          email: customerEmail || "",

          contact: customerPhone || "",
        },

        notes: {
          checkoutSessionId: checkoutSessionId || "",

          paymentId,

          orderId: orderId || "",
        },

        theme: {
          color: "#111827",
        },

        method: {
          upi: true,
        },

        retry: {
          enabled: true,

          max_count: 3,
        },

        timeout: 900,

        modal: {
          escape: false,

          ondismiss: () => {
            if (onDismiss) {
              onDismiss();
            } else {
              router.replace(
                orderId
                  ? `/checkout/cancelled?orderId=${orderId}`
                  : "/checkout/cancelled"
              );
            }
          },
        },

        /*
         |--------------------------------------------------------------------------
         | PAYMENT SUCCESS HANDLER
         |--------------------------------------------------------------------------
         */

        handler: async (response: any) => {
          try {
            /*
             |--------------------------------------------------------------------------
             | VALIDATE RESPONSE
             |--------------------------------------------------------------------------
             */

            if (!response?.razorpay_payment_id) {
              throw new Error("Missing razorpay payment id");
            }

            if (!response?.razorpay_signature) {
              throw new Error("Missing razorpay signature");
            }

            /*
             |--------------------------------------------------------------------------
             | VERIFY PAYMENT (SERVER VERIFIES SIGNATURE AND CREATES ORDER)
             |--------------------------------------------------------------------------
             */

            const verifyResult = await verifyPaymentMutation.mutateAsync({
              paymentId,

              providerPaymentId: response.razorpay_payment_id,

              providerSignature: response.razorpay_signature,
            });

            const confirmedOrderId =
              verifyResult?.orderId ||
              verifyResult?.data?.orderId ||
              orderId ||
              "";

            /*
             |--------------------------------------------------------------------------
             | CLEANUP SESSION STORAGE
             |--------------------------------------------------------------------------
             */

            sessionStorage.removeItem("checkout-session-id");

            /*
             |--------------------------------------------------------------------------
             | INVALIDATE QUERIES
             |--------------------------------------------------------------------------
             */

            queryClient.removeQueries({
              queryKey: ["cart"],
            });

            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: ["orders"],
              }),

              queryClient.invalidateQueries({
                queryKey: ["order"],
              }),

              queryClient.invalidateQueries({
                queryKey: ["cart"],
              }),

              queryClient.invalidateQueries({
                queryKey: ["checkout-session"],
              }),

              queryClient.invalidateQueries({
                queryKey: ["wallet"],
              }),

              queryClient.invalidateQueries({
                queryKey: ["wallet-transactions"],
              }),
            ]);

            /*
             |--------------------------------------------------------------------------
             | SUCCESS REDIRECT
             |--------------------------------------------------------------------------
             */

            if (onSuccess) {
              onSuccess(confirmedOrderId);
            } else {
              router.replace(
                confirmedOrderId
                  ? `/checkout/success?orderId=${confirmedOrderId}`
                  : "/checkout/success"
              );
            }
          } catch (error) {
            console.error("PAYMENT VERIFY ERROR", error);

            if (onFailed) {
              onFailed(error);
            } else {
              router.replace(
                orderId
                  ? `/checkout/failed?orderId=${orderId}`
                  : "/checkout/failed"
              );
            }
          }
        },
      };

      /*
       |--------------------------------------------------------------------------
       | CREATE INSTANCE
       |--------------------------------------------------------------------------
       */

      const razorpay = new window.Razorpay(options);

      /*
       |--------------------------------------------------------------------------
       | PAYMENT FAILED
       |--------------------------------------------------------------------------
       */

      razorpay.on("payment.failed", function (response: any) {
        console.error("RAZORPAY PAYMENT FAILED", response);

        if (onFailed) {
          onFailed(response);
        } else {
          router.replace(
            orderId
              ? `/checkout/failed?orderId=${orderId}`
              : "/checkout/failed"
          );
        }
      });

      /*
       |--------------------------------------------------------------------------
       | OPEN POPUP
       |--------------------------------------------------------------------------
       */

      razorpay.open();
    } catch (error) {
      console.error("OPEN RAZORPAY ERROR", error);

      if (onFailed) {
        onFailed(error);
      } else {
        router.replace(
          orderId
            ? `/checkout/failed?orderId=${orderId}`
            : "/checkout/failed"
        );
      }
    }
  };

  return {
    openRazorpay,

    isVerifying: verifyPaymentMutation.isPending,
  };
};