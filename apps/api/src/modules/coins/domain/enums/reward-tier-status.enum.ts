export enum RewardTierStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export const REWARD_TIER_STATUS_VALUES = Object.values(RewardTierStatus);

export type RewardTierStatusValue = (typeof REWARD_TIER_STATUS_VALUES)[number];

export const isRewardTierStatus = (value: string): value is RewardTierStatus => {
  return REWARD_TIER_STATUS_VALUES.includes(value as RewardTierStatus);
};
