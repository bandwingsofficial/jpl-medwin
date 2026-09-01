export enum CoinTransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export const COIN_TRANSACTION_STATUS_VALUES = Object.values(CoinTransactionStatus);

export type CoinTransactionStatusValue = (typeof COIN_TRANSACTION_STATUS_VALUES)[number];

export const isCoinTransactionStatus = (value: string): value is CoinTransactionStatus => {
  return COIN_TRANSACTION_STATUS_VALUES.includes(value as CoinTransactionStatus);
};
