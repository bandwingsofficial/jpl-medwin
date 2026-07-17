import { CoinRedemptionStatus } from '../enums/coin-redemption-status.enum';

import { InvalidRedemptionException } from '../exceptions/invalid-redemption.exception';

export class CoinRedemption {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly walletId: string,
    public readonly orderId: string,
    public status: CoinRedemptionStatus = CoinRedemptionStatus.PENDING,
    public redeemedCoins: number,
    public redeemedAmount: number,
    public reversedAt?: Date,
    public reversalReason?: string,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {
    this.validate();
  }

  hasValidCoins(): boolean {
    return Number.isInteger(this.redeemedCoins) && this.redeemedCoins > 0;
  }

  hasValidAmount(): boolean {
    return Number.isFinite(this.redeemedAmount) && this.redeemedAmount > 0;
  }

  isPending(): boolean {
    return this.status === CoinRedemptionStatus.PENDING;
  }

  isApplied(): boolean {
    return this.status === CoinRedemptionStatus.APPLIED;
  }

  isReversed(): boolean {
    return this.status === CoinRedemptionStatus.REVERSED;
  }

  isFailed(): boolean {
    return this.status === CoinRedemptionStatus.FAILED;
  }

  canBeReversed(): boolean {
    return this.isApplied();
  }

  markAsApplied() {
    if (this.isReversed()) {
      throw new InvalidRedemptionException({
        message: 'Reversed redemption cannot be applied',
      });
    }

    this.status = CoinRedemptionStatus.APPLIED;

    this.touch();
  }

  markAsFailed() {
    if (this.isApplied()) {
      throw new InvalidRedemptionException({
        message: 'Applied redemption cannot be marked as failed',
      });
    }

    this.status = CoinRedemptionStatus.FAILED;

    this.touch();
  }

  reverse(params?: { reason?: string }) {
    if (!this.canBeReversed()) {
      throw new InvalidRedemptionException({
        message: 'Only applied redemption can be reversed',
      });
    }

    this.status = CoinRedemptionStatus.REVERSED;

    this.reversedAt = new Date();

    this.reversalReason = params?.reason?.trim();

    this.touch();
  }

  updateRedemption(params: { redeemedCoins?: number; redeemedAmount?: number }) {
    if (this.isReversed()) {
      throw new InvalidRedemptionException({
        message: 'Reversed redemption cannot be updated',
      });
    }

    if (params.redeemedCoins !== undefined) {
      this.redeemedCoins = params.redeemedCoins;
    }

    if (params.redeemedAmount !== undefined) {
      this.redeemedAmount = Number(params.redeemedAmount.toFixed(2));
    }

    this.validate();

    this.touch();
  }

  validate() {
    if (!this.userId?.trim()) {
      throw new InvalidRedemptionException({
        message: 'User ID is required',
      });
    }

    if (!this.walletId?.trim()) {
      throw new InvalidRedemptionException({
        message: 'Wallet ID is required',
      });
    }

    if (!this.orderId?.trim()) {
      throw new InvalidRedemptionException({
        message: 'Order ID is required',
      });
    }

    if (!this.hasValidCoins()) {
      throw new InvalidRedemptionException({
        message: 'Redeemed coins must be a positive integer',
      });
    }

    if (!this.hasValidAmount()) {
      throw new InvalidRedemptionException({
        message: 'Redeemed amount must be greater than zero',
      });
    }

    if (this.redeemedAmount < 0) {
      throw new InvalidRedemptionException({
        message: 'Redeemed amount cannot be negative',
      });
    }

    if (this.reversedAt && !this.isReversed()) {
      throw new InvalidRedemptionException({
        message: 'Only reversed redemption can have reversedAt',
      });
    }

    if (this.isReversed() && !this.reversedAt) {
      throw new InvalidRedemptionException({
        message: 'Reversed redemption must have reversedAt',
      });
    }
  }

  private touch() {
    this.updatedAt = new Date();
  }
}
