"use client";

import axios from "axios";

import { apiClient } from "@/infrastructure/api/axios-client";

import { API_ENDPOINTS } from "@/infrastructure/api/endpoints";

import {
  CheckoutSessionResponse,
  CompleteCheckoutSessionResponse,
  CreateCheckoutSessionResponse,
  ExpireCheckoutSessionResponse,
} from "@/features/checkout/types/checkout.type";

const CHECKOUT_SESSION_STORAGE_KEY =
  "checkout-session-id";

export const checkoutApi = {
  /*
   |--------------------------------------------------------------------------
   | CREATE CHECKOUT SESSION
   |--------------------------------------------------------------------------
   */
  async createSession(): Promise<CreateCheckoutSessionResponse> {
    try {
      /*
       |--------------------------------------------------------------------------
       | RESTORE EXISTING SESSION FROM STORAGE
       |--------------------------------------------------------------------------
       */
      const existingSessionId =
        typeof window !== "undefined"
          ? sessionStorage.getItem(
              CHECKOUT_SESSION_STORAGE_KEY
            )
          : null;

      /*
       |--------------------------------------------------------------------------
       | VALIDATE EXISTING SESSION
       |--------------------------------------------------------------------------
       */
      if (existingSessionId) {
       

        try {
          const existingSession =
            await this.getSession(
              existingSessionId
            );

          /*
           |--------------------------------------------------------------------------
           | SESSION MUST BE ACTIVE
           |--------------------------------------------------------------------------
           */
          const isSessionActive =
            existingSession?.status ===
            "ACTIVE";

          /*
           |--------------------------------------------------------------------------
           | SESSION MUST HAVE VALID CART
           |--------------------------------------------------------------------------
           */
          const isCartLocked =
            existingSession?.cart
              ?.status ===
            "LOCKED";

          /*
           |--------------------------------------------------------------------------
           | VALID SESSION → REUSE
           |--------------------------------------------------------------------------
           */
          if (
            isSessionActive &&
            isCartLocked
          ) {
        
            return {
              checkoutSessionId:
                existingSessionId,

              status:
                existingSession.status,

              expiresAt:
                existingSession.expiresAt,

              reused: true,
            } as CreateCheckoutSessionResponse;
          }

          /*
           |--------------------------------------------------------------------------
           | INVALID SESSION
           |--------------------------------------------------------------------------
           */
          console.warn(
            "SESSION INVALID AFTER CART UNLOCK"
          );

          /*
           |--------------------------------------------------------------------------
           | EXPIRE INVALID SESSION
           |--------------------------------------------------------------------------
           */
          try {
            await this.expireSession(
              existingSessionId
            );

          } catch (expireError) {
            console.warn(
              "FAILED TO EXPIRE SESSION",
              expireError
            );
          }

          /*
           |--------------------------------------------------------------------------
           | CLEAR STORAGE
           |--------------------------------------------------------------------------
           */
          sessionStorage.removeItem(
            CHECKOUT_SESSION_STORAGE_KEY
          );
        } catch (error) {
          console.warn(
            "FAILED TO VALIDATE SESSION. CLEARING STORAGE.",
            error
          );

          sessionStorage.removeItem(
            CHECKOUT_SESSION_STORAGE_KEY
          );
        }
      }

      /*
       |--------------------------------------------------------------------------
       | CREATE / REUSE SESSION FROM BACKEND
       |--------------------------------------------------------------------------
       */

      const response =
        await apiClient.post(
          API_ENDPOINTS.CHECKOUT.CREATE_SESSION
        );
const data =
  response.data;
     
      /*
       |--------------------------------------------------------------------------
       | INVALID RESPONSE
       |--------------------------------------------------------------------------
       */
      if (
        !data?.checkoutSessionId
      ) {
        throw new Error(
          "Failed to create checkout session."
        );
      }

      /*
       |--------------------------------------------------------------------------
       | SAVE SESSION
       |--------------------------------------------------------------------------
       */
      sessionStorage.setItem(
        CHECKOUT_SESSION_STORAGE_KEY,
        data.checkoutSessionId
      );
      /*
       |--------------------------------------------------------------------------
       | RETURN SESSION METADATA
       |--------------------------------------------------------------------------
       */
      return {
        checkoutSessionId:
          data.checkoutSessionId,

        status: data.status,

        expiresAt:
          data.expiresAt,

        reused:
          data?.reused ?? false,
      } as CreateCheckoutSessionResponse;
    } catch (error) {
      console.error(
        "CREATE SESSION ERROR:",
        error
      );

      /*
       |--------------------------------------------------------------------------
       | OPTIONAL FALLBACK (OLD BACKEND SUPPORT)
       |--------------------------------------------------------------------------
       */
      if (
        axios.isAxiosError(error)
      ) {
        const status =
          error.response?.status;

        const responseBody =
          error.response?.data;

        /*
         |--------------------------------------------------------------------------
         | CART LOCKED
         |--------------------------------------------------------------------------
         */
        if (
          status === 409 &&
          responseBody?.errorCode ===
            "CART.LOCKED"
        ) {
          const existingSessionData =
            responseBody?.data ||
            responseBody?.details;

          if (
            existingSessionData?.checkoutSessionId
          ) {
            console.warn(
              "RESTORING LOCKED SESSION:",
              existingSessionData.checkoutSessionId
            );

            sessionStorage.setItem(
              CHECKOUT_SESSION_STORAGE_KEY,
              existingSessionData.checkoutSessionId
            );

            return {
              checkoutSessionId:
                existingSessionData.checkoutSessionId,

              reused: true,
            } as CreateCheckoutSessionResponse;
          }
        }
      }

      throw error;
    }
  },

  /*
   |--------------------------------------------------------------------------
   | GET CHECKOUT SESSION
   |--------------------------------------------------------------------------
   */
 async getSession(
  sessionId: string
): Promise<CheckoutSessionResponse> {

  const response =
    await apiClient.get(
      API_ENDPOINTS.CHECKOUT.GET_SESSION(
        sessionId
      )
    );


  return response.data;
},
  /*
   |--------------------------------------------------------------------------
   | APPLY REWARDS
   |--------------------------------------------------------------------------
   */
  async applyRewards(
    sessionId: string,
    coins: number
  ) {
    const response =
      await apiClient.post(
        `/checkout-sessions/${sessionId}/apply-rewards`,
        {
          coins,
        }
      );

    return response.data.data;
  },

  /*
   |--------------------------------------------------------------------------
   | REMOVE REWARDS
   |--------------------------------------------------------------------------
   */
  async removeRewards(
    sessionId: string
  ) {
   const response =
      await apiClient.delete(
        `/checkout-sessions/${sessionId}/apply-rewards`
      );

    return response.data.data;
  },

  /*
   |--------------------------------------------------------------------------
   | EXPIRE CHECKOUT SESSION
   |--------------------------------------------------------------------------
   */
  async expireSession(
    sessionId: string
  ): Promise<ExpireCheckoutSessionResponse> {
  

    const response =
      await apiClient.post(
        API_ENDPOINTS.CHECKOUT.EXPIRE_SESSION(
          sessionId
        )
      );

    sessionStorage.removeItem(
      CHECKOUT_SESSION_STORAGE_KEY
    );

    return response.data.data;
  },

  /*
   |--------------------------------------------------------------------------
   | COMPLETE CHECKOUT SESSION
   |--------------------------------------------------------------------------
   */
  async completeSession(
    sessionId: string
  ): Promise<CompleteCheckoutSessionResponse> {
   
    const response =
      await apiClient.post(
        API_ENDPOINTS.CHECKOUT.COMPLETE_SESSION(
          sessionId
        )
      );

    sessionStorage.removeItem(
      CHECKOUT_SESSION_STORAGE_KEY
    );

   
    return response.data.data;
  },
};