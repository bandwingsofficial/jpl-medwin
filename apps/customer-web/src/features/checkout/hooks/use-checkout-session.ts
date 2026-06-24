"use client";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";

import { checkoutApi } from "@/features/checkout/api/checkout.api";

const CHECKOUT_SESSION_STORAGE_KEY =
  "checkout-session-id";

export const useCheckoutSession = (
  sessionId?: string | null
) => {
  return useQuery({
    queryKey: [
      "checkout-session",
      sessionId,
    ],

    queryFn: async () => {
      /*
       |--------------------------------------------------------------------------
       | NO SESSION
       |--------------------------------------------------------------------------
       */
      if (!sessionId) {
        return null;
      }

      try {
        const response =
          await checkoutApi.getSession(
            sessionId
          );

        return response;
      } catch (error) {
        console.warn(
  "GET SESSION ERROR:",
  error
);

        /*
         |--------------------------------------------------------------------------
         | INVALID SESSION
         |--------------------------------------------------------------------------
         */
        if (
          axios.isAxiosError(error)
        ) {
          const status =
            error.response?.status;

          const errorMessage =
            error.response?.data
              ?.message || "";

          const errorCode =
            error.response?.data
              ?.errorCode;

          const isInvalidSession =
            status === 400 ||
            errorCode ===
              "CHECKOUT_SESSION.INVALID" ||
            errorMessage
              .toLowerCase()
              .includes(
                "invalid checkout session"
              );

          /*
           |--------------------------------------------------------------------------
           | CLEAR INVALID SESSION
           |--------------------------------------------------------------------------
           */
          if (isInvalidSession) {
            console.warn(
              "INVALID CHECKOUT SESSION DETECTED"
            );

            try {
              sessionStorage.removeItem(
                CHECKOUT_SESSION_STORAGE_KEY
              );
            } catch (
              storageError
            ) {
              console.error(
                "FAILED TO CLEAR SESSION STORAGE",
                storageError
              );
            }

            /*
             |--------------------------------------------------------------------------
             | RETURN NULL INSTEAD OF THROWING
             |--------------------------------------------------------------------------
             */
            return null;
          }
        }

        /*
         |--------------------------------------------------------------------------
         | THROW OTHER ERRORS
         |--------------------------------------------------------------------------
         */
        throw error;
      }
    },

    /*
     |--------------------------------------------------------------------------
     | ENABLE ONLY WHEN SESSION EXISTS
     |--------------------------------------------------------------------------
     */
    enabled:
      typeof sessionId ===
        "string" &&
      sessionId.length > 0,

    /*
     |--------------------------------------------------------------------------
     | CACHE
     |--------------------------------------------------------------------------
     */
    staleTime:
      1000 * 60 * 2,

    gcTime:
      1000 * 60 * 10,

    /*
     |--------------------------------------------------------------------------
     | RETRY
     |--------------------------------------------------------------------------
     */
    retry: false,

    /*
     |--------------------------------------------------------------------------
     | REFETCH
     |--------------------------------------------------------------------------
     */
    refetchOnWindowFocus:
      false,

    refetchOnReconnect:
      false,

    refetchOnMount: false,
  });
};