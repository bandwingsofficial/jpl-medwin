import { apiClient } from "@/infrastructure/api/axios-client";

import {
  RedemptionValidationPayload,
  RedemptionValidationResponse,
  WalletResponse,
  WalletTransactionsResponse,
} from "@/features/coins/types/coins.type";

// ========================================
// GET WALLET
// ========================================

export async function getWallet(): Promise<WalletResponse> {
  const response =
    await apiClient.get("/wallet");

  return response.data;
}

// ========================================
// GET TRANSACTIONS
// ========================================

export async function getWalletTransactions(): Promise<WalletTransactionsResponse> {
  const response =
    await apiClient.get(
      "/wallet/transactions"
    );

  return response.data;
}

// ========================================
// VALIDATE REDEMPTION
// ========================================

export async function validateRedemption(
  payload: RedemptionValidationPayload
): Promise<RedemptionValidationResponse> {
  const response =
    await apiClient.post(
      "/rewards/validate-redemption",
      payload
    );

  return response.data;
}

// ========================================
// APPLY REWARDS TO CHECKOUT
// ========================================

export async function applyRewardsToCheckout(
  checkoutSessionId: string,
  coins: number
) {
  const response =
    await apiClient.post(
      `/checkout-sessions/${checkoutSessionId}/apply-rewards`,
      {
        coins,
      }
    );

  /*
   |--------------------------------------------------------------------------
   | RETURN FINAL DATA ONLY
   |--------------------------------------------------------------------------
   */

  return response.data.data;
}
// ========================================
// REMOVE REWARDS FROM CHECKOUT
// ========================================

export async function removeRewardsFromCheckout(
  checkoutSessionId: string
) {
  const response =
    await apiClient.delete(
      `/checkout-sessions/${checkoutSessionId}/apply-rewards`
    );

  return response.data;
}