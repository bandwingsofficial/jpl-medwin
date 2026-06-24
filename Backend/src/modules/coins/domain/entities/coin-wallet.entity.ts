import { CoinTransactionType } from '../enums/coin-transaction-type.enum';

import { InsufficientCoinsException } from '../exceptions/insufficient-coins.exception';
import { InvalidCoinTransactionException } from '../exceptions/invalid-coin-transaction.exception';
import { NegativeWalletBalanceException } from '../exceptions/negative-wallet-balance.exception';

export class CoinWallet {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public balance: number = 0,
    public lifetimeEarned: number = 0,
    public lifetimeRedeemed: number = 0,
    public lifetimeExpired: number = 0,
    public lifetimeRefunded: number = 0,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {
    this.validate();
  }

  hasSufficientBalance(coins: number): boolean {
    return this.balance >= coins;
  }

  isEmpty(): boolean {
    return this.balance <= 0;
  }

  creditCoins(params: { coins: number; transactionType: CoinTransactionType }) {
    const { coins, transactionType } = params;

    this.ensureValidCoins(coins);

    this.balance += coins;

    switch (transactionType) {
      case CoinTransactionType.EARNED:
      case CoinTransactionType.BONUS:
      case CoinTransactionType.ADMIN_CREDIT:
        this.lifetimeEarned += coins;
        break;

      case CoinTransactionType.REFUNDED:
      case CoinTransactionType.REDEEM_REVERSED:
        this.lifetimeRefunded += coins;
        break;
    }

    this.touch();

    this.validate();
  }

  debitCoins(params: {
  coins: number;
  transactionType: CoinTransactionType;
}) {
  const { coins, transactionType } = params;

  this.ensureValidCoins(coins);

  this.ensureSufficientBalance(coins);

  this.balance -= coins;

  if (this.balance < 0) {
    throw new NegativeWalletBalanceException({
      walletId: this.id,
      balance: this.balance,
    });
  }

  switch (transactionType) {
    case CoinTransactionType.REDEEMED:
      this.lifetimeRedeemed += coins;
      break;

    case CoinTransactionType.EXPIRED:
      this.lifetimeExpired += coins;
      break;
  }

  this.touch();

  this.validate();
}

  expireCoins(params: { coins: number }) {
    const { coins } = params;

    this.ensureValidCoins(coins);

    this.ensureSufficientBalance(coins);

    this.balance -= coins;

    if (this.balance < 0) {
      throw new NegativeWalletBalanceException({
        walletId: this.id,
        balance: this.balance,
      });
    }

    this.lifetimeExpired += coins;

    this.touch();

    this.validate();
  }

  refundRedeemedCoins(params: { coins: number }) {
    const { coins } = params;

    this.ensureValidCoins(coins);

    this.balance += coins;

    this.lifetimeRefunded += coins;

    this.touch();

    this.validate();
  }

  ensureSufficientBalance(coins: number) {
    if (!this.hasSufficientBalance(coins)) {
      throw new InsufficientCoinsException({
        availableCoins: this.balance,
        requestedCoins: coins,
        userId: this.userId,
      });
    }
  }

  validateRedemption(params: { requestedCoins: number; minimumCoins?: number }) {
    const { requestedCoins, minimumCoins } = params;

    this.ensureValidCoins(requestedCoins);

    if (minimumCoins !== undefined && requestedCoins < minimumCoins) {
      throw new InvalidCoinTransactionException({
        message: `Minimum redeemable coins is ${minimumCoins}`,
      });
    }

    this.ensureSufficientBalance(requestedCoins);
  }

  validate() {
    if (!this.userId?.trim()) {
      throw new InvalidCoinTransactionException({
        message: 'Wallet user is required',
      });
    }

    if (this.balance < 0) {
      throw new NegativeWalletBalanceException({
        walletId: this.id,
        balance: this.balance,
      });
    }

    if (this.lifetimeEarned < 0) {
      throw new InvalidCoinTransactionException({
        message: 'Lifetime earned cannot be negative',
      });
    }

    if (this.lifetimeRedeemed < 0) {
      throw new InvalidCoinTransactionException({
        message: 'Lifetime redeemed cannot be negative',
      });
    }

    if (this.lifetimeExpired < 0) {
      throw new InvalidCoinTransactionException({
        message: 'Lifetime expired cannot be negative',
      });
    }

    if (this.lifetimeRefunded < 0) {
      throw new InvalidCoinTransactionException({
        message: 'Lifetime refunded cannot be negative',
      });
    }
  }

  private ensureValidCoins(coins: number) {
    if (!Number.isInteger(coins)) {
      throw new InvalidCoinTransactionException({
        message: 'Coins must be an integer value',
      });
    }

    if (coins <= 0) {
      throw new InvalidCoinTransactionException({
        message: 'Coins must be greater than zero',
      });
    }
  }

  private touch() {
    this.updatedAt = new Date();
  }
}
