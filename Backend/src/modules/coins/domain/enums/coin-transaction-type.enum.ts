export enum CoinTransactionType {
  EARNED = 'EARNED',
  BONUS = 'BONUS',
  REDEEMED = 'REDEEMED',
  REDEEM_REVERSED = 'REDEEM_REVERSED',
  REFUNDED = 'REFUNDED',
  ORDER_REWARD_REVERSED = 'ORDER_REWARD_REVERSED',
  EXPIRED = 'EXPIRED',
  ADMIN_CREDIT = 'ADMIN_CREDIT',
  ADMIN_DEBIT = 'ADMIN_DEBIT',
  ADJUSTED = 'ADJUSTED',
}

export const COIN_TRANSACTION_TYPE_VALUES = Object.values(CoinTransactionType);

export type CoinTransactionTypeValue = (typeof COIN_TRANSACTION_TYPE_VALUES)[number];

export const isCoinTransactionType = (value: string): value is CoinTransactionType => {
  return COIN_TRANSACTION_TYPE_VALUES.includes(value as CoinTransactionType);
};
