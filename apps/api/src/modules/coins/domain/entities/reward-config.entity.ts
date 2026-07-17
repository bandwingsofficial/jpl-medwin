import { InactiveRewardConfigException } from '../exceptions/inactive-reward-config.exception';
import { InvalidCoinTransactionException } from '../exceptions/invalid-coin-transaction.exception';

export class RewardConfig {
  constructor(
    public readonly id: string,
    public earnRateAmount: number,
    public earnRateCoins: number,
    public coinValue: number = 1,
    public maxRedemptionPercentage: number,
    public minimumOrderAmount?: number,
    public expiryMonths: number = 12,
    public rewardOnDelivered: boolean = true,
    public isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {
    this.validate();
  }

  isInactive(): boolean {
    return !this.isActive;
  }

  hasMinimumOrderAmount(): boolean {
    return this.minimumOrderAmount !== undefined;
  }

  calculateEarnedCoins(orderAmount: number): number {
    this.ensureActive();

    if (!Number.isFinite(orderAmount) || orderAmount <= 0) {
      return 0;
    }

    const earnedCoins = Math.floor(orderAmount / this.earnRateAmount) * this.earnRateCoins;

    return Math.max(0, earnedCoins);
  }

  calculateCoinValue(coins: number): number {
    if (!Number.isInteger(coins) || coins <= 0) {
      return 0;
    }

    return Number((coins * this.coinValue).toFixed(2));
  }

  calculateMaxRedeemableAmount(orderAmount: number): number {
    if (!Number.isFinite(orderAmount) || orderAmount <= 0) {
      return 0;
    }

    return Number(((orderAmount * this.maxRedemptionPercentage) / 100).toFixed(2));
  }

  calculateMaxRedeemableCoins(orderAmount: number): number {
    const maxAmount = this.calculateMaxRedeemableAmount(orderAmount);

    return Math.floor(maxAmount / this.coinValue);
  }

  calculateExpiryDate(fromDate: Date = new Date()): Date {
    const expiryDate = new Date(fromDate);

    expiryDate.setMonth(expiryDate.getMonth() + this.expiryMonths);

    return expiryDate;
  }

  canRedeemOrder(orderAmount: number): boolean {
    if (!this.ensureValidAmount(orderAmount)) {
      return false;
    }

    if (this.minimumOrderAmount !== undefined && orderAmount < this.minimumOrderAmount) {
      return false;
    }

    return true;
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
    earnRateAmount?: number;
    earnRateCoins?: number;
    coinValue?: number;
    maxRedemptionPercentage?: number;
    minimumOrderAmount?: number;
    expiryMonths?: number;
    rewardOnDelivered?: boolean;
    isActive?: boolean;
  }) {
    if (params.earnRateAmount !== undefined) {
      this.earnRateAmount = Number(params.earnRateAmount.toFixed(2));
    }

    if (params.earnRateCoins !== undefined) {
      this.earnRateCoins = params.earnRateCoins;
    }

    if (params.coinValue !== undefined) {
      this.coinValue = Number(params.coinValue.toFixed(2));
    }

    if (params.maxRedemptionPercentage !== undefined) {
      this.maxRedemptionPercentage = Number(params.maxRedemptionPercentage.toFixed(2));
    }

    if (params.minimumOrderAmount !== undefined) {
      this.minimumOrderAmount = Number(params.minimumOrderAmount.toFixed(2));
    }

    if (params.expiryMonths !== undefined) {
      this.expiryMonths = params.expiryMonths;
    }

    if (params.rewardOnDelivered !== undefined) {
      this.rewardOnDelivered = params.rewardOnDelivered;
    }

    if (params.isActive !== undefined) {
      this.isActive = params.isActive;
    }

    this.validate();

    this.touch();
  }

  ensureActive() {
    if (this.isInactive()) {
      throw new InactiveRewardConfigException({
        rewardConfigId: this.id,
      });
    }
  }

  validate() {
    if (!Number.isFinite(this.earnRateAmount) || this.earnRateAmount <= 0) {
      throw new InvalidCoinTransactionException({
        message: 'Earn rate amount must be greater than zero',
      });
    }

    if (!Number.isInteger(this.earnRateCoins) || this.earnRateCoins <= 0) {
      throw new InvalidCoinTransactionException({
        message: 'Earn rate coins must be a positive integer',
      });
    }

    if (!Number.isFinite(this.coinValue) || this.coinValue <= 0) {
      throw new InvalidCoinTransactionException({
        message: 'Coin value must be greater than zero',
      });
    }

    if (
      !Number.isFinite(this.maxRedemptionPercentage) ||
      this.maxRedemptionPercentage <= 0 ||
      this.maxRedemptionPercentage > 100
    ) {
      throw new InvalidCoinTransactionException({
        message: 'Max redemption percentage must be between 1 and 100',
      });
    }

    if (
      this.minimumOrderAmount !== undefined &&
      (!Number.isFinite(this.minimumOrderAmount) || this.minimumOrderAmount < 0)
    ) {
      throw new InvalidCoinTransactionException({
        message: 'Minimum order amount cannot be negative',
      });
    }

    if (!Number.isInteger(this.expiryMonths) || this.expiryMonths <= 0) {
      throw new InvalidCoinTransactionException({
        message: 'Expiry months must be a positive integer',
      });
    }
  }

  private ensureValidAmount(amount: number): boolean {
    return Number.isFinite(amount) && amount > 0;
  }

  private touch() {
    this.updatedAt = new Date();
  }
}
