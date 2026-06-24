export interface Wallet {
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

export interface WalletResponse {
  success: boolean;

  message: string;

  data: Wallet;
}

export type CoinTransactionType =
  | "EARNED"
  | "REDEEMED"
  | "EXPIRED"
  | "REFUNDED";

export interface WalletTransaction {
  id: string;

  walletId: string;

  userId: string;

  type: CoinTransactionType;

  status: string;

  coins: number;

  balanceBefore: number;

  balanceAfter: number;

  orderId?: string;

  description: string;

  createdAt: string;

  expiredAt?: string;

  expiresAt?: string;

  metadata?: Record<string, unknown>;
}

export interface WalletTransactionsResponse {
  success: boolean;

  message: string;

  data: WalletTransaction[];
}

export interface RedemptionValidationPayload {
  coins: number;

  orderAmount: number;
}

export interface RedemptionValidationResponse {
  success: boolean;

  message: string;

  data: {
    valid: boolean;

    wallet: {
      walletId: string;

      userId: string;

      balance: number;
    };

    redemption: {
      requestedCoins: number;

      redeemedAmount: number;

      maxRedeemableCoins: number;
    };

    payable: {
      originalAmount: number;

      finalPayableAmount: number;
    };

    config: {
      coinValue: number;

      maxRedemptionPercentage: number;

      minimumOrderAmount: number;
    };
  };
}

export interface RedeemCoinsPayload {
  orderId: string;

  coins: number;

  orderAmount: number;
}

export interface RedeemCoinsResponse {
  success: boolean;

  message: string;

  data: {
    redemption: {
      id: string;

      orderId: string;

      redeemedCoins: number;

      redeemedAmount: number;

      createdAt: string;
    };

    wallet: {
      id: string;

      userId: string;

      balance: number;

      lifetimeRedeemed: number;

      updatedAt: string;
    };

    payable: {
      originalAmount: number;

      redeemedAmount: number;

      finalPayableAmount: number;
    };
  };
}