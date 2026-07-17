import { InvalidCoinTransactionException } from '../exceptions/invalid-coin-transaction.exception';

export class RewardCampaign {
  constructor(
    public readonly id: string,
    public title: string,
    public bonusMultiplier: number,
    public startsAt: Date,
    public endsAt: Date,
    public isActive: boolean = true,
    public description?: string,
    public metadata?: Record<string, unknown>,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {
    this.validate();
  }

  isCurrentlyActive(): boolean {
    if (!this.isActive) {
      return false;
    }

    const now = new Date();

    return now >= this.startsAt && now <= this.endsAt;
  }

  isExpired(): boolean {
    return new Date() > this.endsAt;
  }

  isUpcoming(): boolean {
    return new Date() < this.startsAt;
  }

  calculateBonusCoins(baseCoins: number): number {
    if (!this.isCurrentlyActive()) {
      return baseCoins;
    }

    if (!Number.isInteger(baseCoins) || baseCoins <= 0) {
      return 0;
    }

    return Math.floor(baseCoins * this.bonusMultiplier);
  }

  activate() {
    this.isActive = true;

    this.touch();
  }

  deactivate() {
    this.isActive = false;

    this.touch();
  }

  updateDetails(params: {
    title?: string;
    description?: string;
    bonusMultiplier?: number;
    startsAt?: Date;
    endsAt?: Date;
    isActive?: boolean;
    metadata?: Record<string, unknown>;
  }) {
    if (params.title !== undefined) {
      this.title = params.title.trim();
    }

    if (params.description !== undefined) {
      this.description = params.description?.trim();
    }

    if (params.bonusMultiplier !== undefined) {
      this.bonusMultiplier = Number(params.bonusMultiplier.toFixed(2));
    }

    if (params.startsAt !== undefined) {
      this.startsAt = params.startsAt;
    }

    if (params.endsAt !== undefined) {
      this.endsAt = params.endsAt;
    }

    if (params.isActive !== undefined) {
      this.isActive = params.isActive;
    }

    if (params.metadata !== undefined) {
      this.metadata = params.metadata;
    }

    this.validate();

    this.touch();
  }

  validate() {
    if (!this.title?.trim()) {
      throw new InvalidCoinTransactionException({
        message: 'Reward campaign title is required',
      });
    }

    if (!Number.isFinite(this.bonusMultiplier) || this.bonusMultiplier <= 0) {
      throw new InvalidCoinTransactionException({
        message: 'Bonus multiplier must be greater than zero',
      });
    }

    if (!(this.startsAt instanceof Date) || isNaN(this.startsAt.getTime())) {
      throw new InvalidCoinTransactionException({
        message: 'Invalid campaign start date',
      });
    }

    if (!(this.endsAt instanceof Date) || isNaN(this.endsAt.getTime())) {
      throw new InvalidCoinTransactionException({
        message: 'Invalid campaign end date',
      });
    }

    if (this.startsAt >= this.endsAt) {
      throw new InvalidCoinTransactionException({
        message: 'Campaign start date must be before end date',
      });
    }

    if (this.description !== undefined && !this.description.trim()) {
      throw new InvalidCoinTransactionException({
        message: 'Description cannot be empty',
      });
    }
  }

  private touch() {
    this.updatedAt = new Date();
  }
}
