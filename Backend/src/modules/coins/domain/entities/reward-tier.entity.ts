import { RewardTierStatus } from '../enums/reward-tier-status.enum';

import { InvalidCoinTransactionException } from '../exceptions/invalid-coin-transaction.exception';

export class RewardTier {
  constructor(
    public readonly id: string,
    public name: string,
    public status: RewardTierStatus = RewardTierStatus.ACTIVE,
    public coinMultiplier: number,
    public minimumLifetimeSpend: number,
    public description?: string,
    public badgeImage?: string,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {
    this.validate();
  }

  isActive(): boolean {
    return this.status === RewardTierStatus.ACTIVE;
  }

  isInactive(): boolean {
    return !this.isActive();
  }

  calculateRewardCoins(baseCoins: number): number {
    if (!Number.isInteger(baseCoins) || baseCoins <= 0) {
      return 0;
    }

    return Math.floor(baseCoins * this.coinMultiplier);
  }

  isEligible(params: { lifetimeSpend: number }): boolean {
    const { lifetimeSpend } = params;

    return lifetimeSpend >= this.minimumLifetimeSpend;
  }

  activate() {
    this.status = RewardTierStatus.ACTIVE;

    this.touch();
  }

  deactivate() {
    this.status = RewardTierStatus.INACTIVE;

    this.touch();
  }

  updateDetails(params: {
    name?: string;
    description?: string;
    status?: RewardTierStatus;
    coinMultiplier?: number;
    minimumLifetimeSpend?: number;
    badgeImage?: string;
  }) {
    if (params.name !== undefined) {
      this.name = params.name.trim();
    }

    if (params.description !== undefined) {
      this.description = params.description?.trim();
    }

    if (params.status !== undefined) {
      this.status = params.status;
    }

    if (params.coinMultiplier !== undefined) {
      this.coinMultiplier = Number(params.coinMultiplier.toFixed(2));
    }

    if (params.minimumLifetimeSpend !== undefined) {
      this.minimumLifetimeSpend = Number(params.minimumLifetimeSpend.toFixed(2));
    }

    if (params.badgeImage !== undefined) {
      this.badgeImage = params.badgeImage?.trim();
    }

    this.validate();

    this.touch();
  }

  validate() {
    if (!this.name?.trim()) {
      throw new InvalidCoinTransactionException({
        message: 'Reward tier name is required',
      });
    }

    if (!Number.isFinite(this.coinMultiplier) || this.coinMultiplier <= 0) {
      throw new InvalidCoinTransactionException({
        message: 'Coin multiplier must be greater than zero',
      });
    }

    if (!Number.isFinite(this.minimumLifetimeSpend) || this.minimumLifetimeSpend < 0) {
      throw new InvalidCoinTransactionException({
        message: 'Minimum lifetime spend cannot be negative',
      });
    }

    if (this.description !== undefined && !this.description.trim()) {
      throw new InvalidCoinTransactionException({
        message: 'Description cannot be empty',
      });
    }

    if (this.badgeImage !== undefined && !this.badgeImage.trim()) {
      throw new InvalidCoinTransactionException({
        message: 'Badge image cannot be empty',
      });
    }
  }

  private touch() {
    this.updatedAt = new Date();
  }
}
