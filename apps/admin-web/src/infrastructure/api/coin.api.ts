import { apiClient } from "@/infrastructure/api/axios-client";

import {
  CoinAnalytics,
  CoinConfig,
  CoinTransaction,
  CoinWallet,
  CreateCoinConfigPayload,
  CreateRewardCampaignPayload,
  CreateRewardTierPayload,
  CreditCoinsPayload,
  RewardCampaign,
  RewardTier,
} from "@/features/coin-management/types/coin.type";

const BASE_URL =
  "/admin/coins";

export const coinApi = {
  // ======================================================
  // CONFIG
  // ======================================================

  async getConfig(): Promise<CoinConfig> {
    const res =
      await apiClient.get(
        `${BASE_URL}/config`
      );

    return res.data.data;
  },

  async createConfig(
    payload: CreateCoinConfigPayload
  ): Promise<CoinConfig> {
    const res =
      await apiClient.post(
        `${BASE_URL}/config`,
        payload
      );

    return res.data.data;
  },

  // ======================================================
  // ANALYTICS
  // ======================================================

  async getAnalytics(): Promise<CoinAnalytics> {
    const res =
      await apiClient.get(
        `${BASE_URL}/analytics`
      );

    return res.data.data;
  },

  // ======================================================
  // TIERS
  // ======================================================

  async getRewardTiers(): Promise<
    RewardTier[]
  > {
    const res =
      await apiClient.get(
        `${BASE_URL}/tiers`
      );

    return res.data.data;
  },

  async createRewardTier(
    payload: CreateRewardTierPayload
  ): Promise<RewardTier> {
    const res =
      await apiClient.post(
        `${BASE_URL}/tiers`,
        payload
      );

    return res.data.data;
  },

  // ======================================================
  // CAMPAIGNS
  // ======================================================

  async getCampaigns(): Promise<
    RewardCampaign[]
  > {
    const res =
      await apiClient.get(
        `${BASE_URL}/campaigns`
      );

    return res.data.data;
  },

  async createCampaign(
    payload: CreateRewardCampaignPayload
  ): Promise<RewardCampaign> {
    const res =
      await apiClient.post(
        `${BASE_URL}/campaigns`,
        payload
      );

    return res.data.data;
  },

  // ======================================================
  // WALLET
  // ======================================================

  async getWallet(
    userId: string
  ): Promise<CoinWallet> {
    const res =
      await apiClient.get(
        `${BASE_URL}/wallets/${userId}`
      );

    return res.data.data;
  },

  async getWalletBalance(
    userId: string
  ) {
    const res =
      await apiClient.get(
        `${BASE_URL}/wallets/${userId}/balance`
      );

    return res.data.data;
  },

  // ======================================================
  // CREDIT COINS
  // ======================================================

  async creditCoins(
    payload: CreditCoinsPayload
  ) {
    const res =
      await apiClient.post(
        `${BASE_URL}/wallets/credit`,
        payload
      );

    return res.data.data;
  },

  // ======================================================
  // REFUND COINS
  // ======================================================

  async refundCoins(payload: {
  userId: string;
  orderId: string;
  coins: number;
  reason: string;
}) {
  const res =
    await apiClient.post(
      `${BASE_URL}/wallets/refund`,
      payload
    );

  return res.data.data;
},

  // ======================================================
// EXPIRE COINS
// ======================================================

async expireCoins() {
  const res =
    await apiClient.post(
      `${BASE_URL}/wallets/expire`
    );

  return res.data.data;
},
  // ======================================================
  // DEBIT COINS
  // ======================================================

  async debitCoins(payload: {
    userId: string;

    coins: number;

    type: string;

    sourceType: string;

    description: string;
  }) {
    const res =
      await apiClient.post(
        `${BASE_URL}/wallets/debit`,
        payload
      );

    return res.data.data;
  },

  // ======================================================
  // TRANSACTIONS
  // ======================================================

  async getTransactions(
    userId?: string
  ): Promise<
    CoinTransaction[]
  > {
    const res =
      await apiClient.get(
        `${BASE_URL}/transactions`,
        {
          params: {
            userId,
          },
        }
      );

    return res.data.data;
  },
};