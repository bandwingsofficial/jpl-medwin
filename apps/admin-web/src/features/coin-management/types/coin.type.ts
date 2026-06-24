export type CoinTransactionType =
  | "EARNED"
  | "REDEEMED"
  | "EXPIRED"
  | "REFUNDED";

export type CoinTransactionStatus =
  | "SUCCESS"
  | "FAILED"
  | "PENDING";

export type RewardTierStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface CoinConfig {
  id: string;

  earnRateAmount: number;

  earnRateCoins: number;

  coinValue: number;

  minimumOrderAmount: number;

  maxRedemptionPercentage: number;

  expiryMonths: number;

  isActive: boolean;

  createdAt: string;
}

export interface CreateCoinConfigPayload {
  earnRateAmount: number;

  earnRateCoins: number;

  coinValue: number;

  minimumOrderAmount: number;

  maxRedemptionPercentage: number;

  expiryMonths: number;

  isActive: boolean;
}

export interface RewardTier {
  id: string;

  name: string;

  description: string;

  coinMultiplier: number;

  minimumLifetimeSpend: number;

  status: RewardTierStatus;

  createdAt: string;
}

export interface CreateRewardTierPayload {
  name: string;

  description: string;

  coinMultiplier: number;

  minimumLifetimeSpend: number;

  status: RewardTierStatus;
}

export interface RewardCampaign {
  id: string;

  title: string;

  description: string;

  bonusMultiplier: number;

  startsAt: string;

  endsAt: string;

  isActive: boolean;

  createdAt: string;
}

export interface CreateRewardCampaignPayload {
  title: string;

  description: string;

  bonusMultiplier: number;

  startsAt: string;

  endsAt: string;

  isActive: boolean;
}

export interface CoinWallet {
  id: string;

  userId: string;

  balance: number;

  lifetimeEarned: number;

  lifetimeRedeemed: number;

  lifetimeExpired: number;

  lifetimeRefunded: number;

  createdAt: string;

  updatedAt: string;
}

export interface WalletBalance {
  walletId: string;

  userId: string;

  balance: number;

  lifetimeEarned: number;

  lifetimeRedeemed: number;

  lifetimeExpired: number;

  lifetimeRefunded: number;

  updatedAt: string;
}

export interface CreditCoinsPayload {
  userId: string;

  coins: number;

  type: CoinTransactionType;

  sourceType:
    | "ORDER"
    | "REDEMPTION"
    | "REFERRAL"
    | "CAMPAIGN"
    | "ADMIN"
    | "REFUND"
    | "SYSTEM";

  description: string;
}

export interface RefundCoinsPayload {
  userId: string;

  orderId: string;

  coins: number;

  reason: string;
}

export interface CoinTransaction {
  id: string;

  walletId: string;

  userId: string;
  orderId?: string;
  type: CoinTransactionType;

  status: CoinTransactionStatus;

  coins: number;

  balanceBefore: number;

  balanceAfter: number;

  description: string;

  createdAt: string;
}

export interface CoinAnalytics {
  wallets: {
    totalWallets: number;

    totalBalance: number;

    averageWalletBalance: number;

    totalLifetimeEarned: number;

    totalLifetimeRedeemed: number;

    totalLifetimeExpired: number;
  };

  transactions: {
    totalTransactions: number;

    earnedTransactions: number;

    redeemedTransactions: number;

    expiredTransactions: number;

    refundedTransactions: number;
  };

  coins: {
    totalEarnedCoins: number;

    totalRedeemedCoins: number;

    totalExpiredCoins: number;

    totalRefundedCoins: number;
  };
}

export interface ExpireCoinsResponse {
  totalProcessed: number;

  results: {
    transactionId: string;

    walletId: string;

    expiredCoins: number;
  }[];
}

export interface RefundCoinsResponse {
  refunded: boolean;

  orderId: string;

  refundedCoins: number;

  wallet: {
    id: string;

    userId: string;

    balance: number;

    lifetimeEarned: number;

    updatedAt: string;
  };

  transaction: {
    id: string;

    type: CoinTransactionType;

    status: CoinTransactionStatus;

    coins: number;

    balanceBefore: number;

    balanceAfter: number;

    description: string;

    createdAt: string;
  };
}