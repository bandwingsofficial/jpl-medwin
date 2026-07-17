export enum RewardSourceType {
  ORDER = 'ORDER',
  REDEMPTION = 'REDEMPTION',
  REFERRAL = 'REFERRAL',
  CAMPAIGN = 'CAMPAIGN',
  ADMIN = 'ADMIN',
  REFUND = 'REFUND',
  SYSTEM = 'SYSTEM',
}

export const REWARD_SOURCE_TYPE_VALUES = Object.values(RewardSourceType);

export type RewardSourceTypeValue = (typeof REWARD_SOURCE_TYPE_VALUES)[number];

export const isRewardSourceType = (value: string): value is RewardSourceType => {
  return REWARD_SOURCE_TYPE_VALUES.includes(value as RewardSourceType);
};
