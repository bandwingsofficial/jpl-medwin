export enum CoinRedemptionStatus {
  PENDING = 'PENDING',
  APPLIED = 'APPLIED',
  REVERSED = 'REVERSED',
  FAILED = 'FAILED',
}

export const COIN_REDEMPTION_STATUS_VALUES = Object.values(CoinRedemptionStatus);

export type CoinRedemptionStatusValue = (typeof COIN_REDEMPTION_STATUS_VALUES)[number];

export const isCoinRedemptionStatus = (value: string): value is CoinRedemptionStatus => {
  return COIN_REDEMPTION_STATUS_VALUES.includes(value as CoinRedemptionStatus);
};
