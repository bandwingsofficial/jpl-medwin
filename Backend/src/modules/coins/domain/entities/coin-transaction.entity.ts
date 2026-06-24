import { CoinTransactionStatus } from '../enums/coin-transaction-status.enum';
import { CoinTransactionType } from '../enums/coin-transaction-type.enum';
import { RewardSourceType } from '../enums/reward-source-type.enum';

import { InvalidCoinTransactionException } from '../exceptions/invalid-coin-transaction.exception';

export class CoinTransaction {
  constructor(
    public readonly id: string,
    public readonly walletId: string,
    public readonly userId: string,

    public type: CoinTransactionType,

    public status: CoinTransactionStatus = CoinTransactionStatus.SUCCESS,

    public coins: number,

    public balanceBefore: number,

    public balanceAfter: number,

    public sourceType: RewardSourceType,

    public orderId?: string,

    public paymentId?: string,

    public redemptionId?: string,

    public description?: string,

    public metadata?: Record<string, unknown>,

    public expiresAt?: Date,

    public expiredAt?: Date,

    public remainingCoins?: number,

    public createdByAdminId?: string,

    public idempotencyKey?: string,

    public readonly createdAt: Date = new Date(),
  ) {
    this.validate();
  }

  isEarned(): boolean {
    return [
      CoinTransactionType.EARNED,
      CoinTransactionType.BONUS,
      CoinTransactionType.REFUNDED,
      CoinTransactionType.REDEEM_REVERSED,
      CoinTransactionType.ADMIN_CREDIT,
    ].includes(this.type);
  }

  isDebited(): boolean {
    return [
      CoinTransactionType.REDEEMED,
      CoinTransactionType.EXPIRED,
      CoinTransactionType.ADMIN_DEBIT,
      CoinTransactionType.ORDER_REWARD_REVERSED,
    ].includes(this.type);
  }

  isRedeemed(): boolean {
    return this.type === CoinTransactionType.REDEEMED;
  }

  isRefunded(): boolean {
    return this.type === CoinTransactionType.REFUNDED;
  }

  isExpired(): boolean {
    return this.type === CoinTransactionType.EXPIRED;
  }

  isPending(): boolean {
    return this.status === CoinTransactionStatus.PENDING;
  }

  isSuccessful(): boolean {
    return this.status === CoinTransactionStatus.SUCCESS;
  }

  isFailed(): boolean {
    return this.status === CoinTransactionStatus.FAILED;
  }

  isCancelled(): boolean {
    return this.status === CoinTransactionStatus.CANCELLED;
  }

  hasExpired(): boolean {
    if (!this.expiresAt) {
      return false;
    }

    return new Date() > this.expiresAt;
  }

  markAsSuccess() {
    this.status = CoinTransactionStatus.SUCCESS;
  }

  markAsFailed() {
    this.status = CoinTransactionStatus.FAILED;
  }

  markAsCancelled() {
    this.status = CoinTransactionStatus.CANCELLED;
  }

  markExpired() {
    this.expiredAt = new Date();

    this.type = CoinTransactionType.EXPIRED;
  }

  updateDescription(description: string) {
    this.description = description;
  }

  updateMetadata(metadata: Record<string, unknown>) {
    this.metadata = metadata;
  }

  validate() {
    if (!this.userId?.trim()) {
      throw new InvalidCoinTransactionException({
        message: 'Transaction userId is required',
      });
    }

    if (!this.walletId?.trim()) {
      throw new InvalidCoinTransactionException({
        message: 'Transaction walletId is required',
      });
    }

    if (!Number.isInteger(this.coins)) {
      throw new InvalidCoinTransactionException({
        message: 'Coins must be an integer value',
      });
    }

    if (this.coins <= 0) {
      throw new InvalidCoinTransactionException({
        message: 'Coins must be greater than zero',
      });
    }

    if (this.balanceBefore < 0) {
      throw new InvalidCoinTransactionException({
        message: 'Balance before cannot be negative',
      });
    }

    if (this.balanceAfter < 0) {
      throw new InvalidCoinTransactionException({
        message: 'Balance after cannot be negative',
      });
    }

    const expectedBalanceAfter = this.calculateExpectedBalanceAfter();

    if (expectedBalanceAfter !== this.balanceAfter) {
      throw new InvalidCoinTransactionException({
        message: 'Invalid wallet balance calculation',
      });
    }

    if (this.expiresAt && this.expiredAt && this.expiredAt < this.expiresAt) {
      throw new InvalidCoinTransactionException({
        message: 'Expired date cannot be before expiry date',
      });
    }

    if (this.remainingCoins !== undefined && this.remainingCoins < 0) {
      throw new InvalidCoinTransactionException({
        message: 'Remaining coins cannot be negative',
      });
    }

    if (this.isEarned() && this.remainingCoins !== undefined && this.remainingCoins > this.coins) {
      throw new InvalidCoinTransactionException({
        message: 'Remaining coins cannot exceed credited coins',
      });
    }
  }

  private calculateExpectedBalanceAfter(): number {
    if (this.isEarned()) {
      return this.balanceBefore + this.coins;
    }

    return this.balanceBefore - this.coins;
  }
}
