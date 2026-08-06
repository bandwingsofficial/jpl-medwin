"use client";

import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

import { useVerifyPayment } from "./useVerifyPayment";

import { loadRazorpay } from "../utils/razorpay";

import { useCompleteCheckout } from "@/features/checkout/hooks/use-complete-checkout";

interface OpenRazorpayOptions {
  paymentId: string;

  orderId: string;

  providerOrderId: string;

  amount: number;

  customerName?: string;

  customerEmail?: string;

  customerPhone?: string;
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

  const queryClient =
    useQueryClient();

  /*
   |--------------------------------------------------------------------------
   | MUTATIONS
   |--------------------------------------------------------------------------
   */

  const verifyPaymentMutation =
    useVerifyPayment();

  const completeCheckoutMutation =
    useCompleteCheckout();

  /*
   |--------------------------------------------------------------------------
   | OPEN RAZORPAY
   |--------------------------------------------------------------------------
   */

  const openRazorpay = async ({
    paymentId,
    orderId,
    providerOrderId,
    amount,
    customerName,
    customerEmail,
    customerPhone,
  }: OpenRazorpayOptions) => {
    try {
      /*
       |--------------------------------------------------------------------------
       | LOAD SDK
       |--------------------------------------------------------------------------
       */

      const loaded =
        await loadRazorpay();

      if (!loaded) {
        throw new Error(
          "Failed to load Razorpay SDK"
        );
      }

      /*
       |--------------------------------------------------------------------------
       | VALIDATE PROVIDER ORDER ID
       |--------------------------------------------------------------------------
       */

      if (!providerOrderId) {
        console.error(
          "INVALID PROVIDER ORDER ID:",
          providerOrderId
        );

        throw new Error(
          "Invalid Razorpay order id from backend"
        );
      }

      /*
       |--------------------------------------------------------------------------
       | GET RAZORPAY KEY
       |--------------------------------------------------------------------------
       */

      const razorpayKey =
        process.env
          .NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        throw new Error(
          "Missing Razorpay key"
        );
      }

      /*
       |--------------------------------------------------------------------------
       | RAZORPAY OPTIONS
       |--------------------------------------------------------------------------
       */

      const options = {
        key: razorpayKey,

        amount: Math.round(
          amount * 100
        ),

        currency: "INR",

        name: "JPL Medwin",

        description:
          "Order Payment",

        image: "/logo.png",

        order_id: providerOrderId,

        prefill: {
          name:
            customerName || "",

          email:
            customerEmail || "",

          contact:
            customerPhone || "",
        },

        notes: {
          orderId,

          paymentId,
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
                       router.replace(
              `/checkout/cancelled?orderId=${orderId}`
            );
          },
        },

        /*
         |--------------------------------------------------------------------------
         | PAYMENT SUCCESS HANDLER
         |--------------------------------------------------------------------------
         */

        handler: async (
          response: any
        ) => {
          try {
           
            /*
             |--------------------------------------------------------------------------
             | VALIDATE RESPONSE
             |--------------------------------------------------------------------------
             */

            if (
              !response?.razorpay_payment_id
            ) {
              throw new Error(
                "Missing razorpay payment id"
              );
            }

            if (
              !response?.razorpay_signature
            ) {
              throw new Error(
                "Missing razorpay signature"
              );
            }

            /*
             |--------------------------------------------------------------------------
             | VERIFY PAYMENT
             |--------------------------------------------------------------------------
             */

            await verifyPaymentMutation.mutateAsync(
              {
                paymentId,

                providerPaymentId:
                  response.razorpay_payment_id,

                providerSignature:
                  response.razorpay_signature,
              }
            );

            /*
 |--------------------------------------------------------------------------
 | GET CHECKOUT SESSION
 |--------------------------------------------------------------------------
 */

const checkoutSessionId =
  sessionStorage.getItem(
    "checkout-session-id"
  );

/*
 |--------------------------------------------------------------------------
 | COMPLETE CHECKOUT ONLY WHEN SESSION EXISTS
 |--------------------------------------------------------------------------
 |
 | Normal Checkout:
 | Cart -> Checkout -> Payment
 |
 | Retry Payment:
 | Orders -> Make Payment -> Payment
 |
 | Retry payment has no checkout session.
 |--------------------------------------------------------------------------
 */

if (checkoutSessionId) {
  await completeCheckoutMutation.mutateAsync(
    checkoutSessionId
  );

  /*
   |--------------------------------------------------------------------------
   | REMOVE CHECKOUT SESSION
   |--------------------------------------------------------------------------
   */
  sessionStorage.removeItem(
    "checkout-session-id"
  );
}
            /*
             |--------------------------------------------------------------------------
             | REMOVE OLD CART CACHE
             |--------------------------------------------------------------------------
             */

            queryClient.removeQueries({
              queryKey: ["cart"],
            });

            /*
             |--------------------------------------------------------------------------
             | INVALIDATE QUERIES
             |--------------------------------------------------------------------------
             */

            await Promise.all([
              queryClient.invalidateQueries(
                {
                  queryKey: [
                    "orders",
                  ],
                }
              ),

              queryClient.invalidateQueries(
                {
                  queryKey: [
                    "cart",
                  ],
                }
              ),

              queryClient.invalidateQueries(
                {
                  queryKey: [
                    "checkout-session",
                  ],
                }
              ),

              queryClient.invalidateQueries(
                {
                  queryKey: [
                    "wallet",
                  ],
                }
              ),

              queryClient.invalidateQueries(
                {
                  queryKey: [
                    "wallet-transactions",
                  ],
                }
              ),
            ]);

            /*
             |--------------------------------------------------------------------------
             | SUCCESS REDIRECT
             |--------------------------------------------------------------------------
             */

            router.replace(
              `/checkout/success?orderId=${orderId}`
            );
          } catch (error) {
            console.error(
              "PAYMENT VERIFY ERROR",
              error
            );

            /*
             |--------------------------------------------------------------------------
             | FAILURE REDIRECT
             |--------------------------------------------------------------------------
             */

            router.replace(
              `/checkout/failed?orderId=${orderId}`
            );
          }
        },
      };
      /*
       |--------------------------------------------------------------------------
       | CREATE INSTANCE
       |--------------------------------------------------------------------------
       */

      const razorpay =
        new window.Razorpay(
          options
        );

      /*
       |--------------------------------------------------------------------------
       | PAYMENT FAILED
       |--------------------------------------------------------------------------
       */

      razorpay.on(
        "payment.failed",
        function (response: any) {
          console.error(
            "RAZORPAY PAYMENT FAILED",
            response
          );

          router.replace(
            `/checkout/failed?orderId=${orderId}`
          );
        }
      );

      /*
       |--------------------------------------------------------------------------
       | OPEN POPUP
       |--------------------------------------------------------------------------
       */

      razorpay.open();
    } catch (error) {
      console.error(
        "OPEN RAZORPAY ERROR",
        error
      );

      router.replace(
        `/checkout/failed?orderId=${orderId}`
      );
    }
  };

  return {
    openRazorpay,

    isVerifying:
      verifyPaymentMutation.isPending,
  };
};