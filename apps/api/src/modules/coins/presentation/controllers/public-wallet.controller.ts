import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';

import { CurrentUser } from '@/modules/auth/presentation/decorators/current-user.decorator';

import { CoinTransactionType } from '../../domain/enums/coin-transaction-type.enum';

import { GetWalletUseCase } from '../../application/use-cases/wallet/get-wallet.use-case';
import { GetWalletBalanceUseCase } from '../../application/use-cases/wallet/get-wallet-balance.use-case';
import { ListCoinTransactionsUseCase } from '../../application/use-cases/transactions/list-coin-transactions.use-case';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class PublicWalletController {
  constructor(
    private readonly getWalletUseCase: GetWalletUseCase,
    private readonly getWalletBalanceUseCase: GetWalletBalanceUseCase,
    private readonly listCoinTransactionsUseCase: ListCoinTransactionsUseCase,
  ) {}

  @Get()
  async getMyWallet(
    @CurrentUser()
    user: {
      userId: string;
    },
  ) {
    return this.getWalletUseCase.execute({
      userId: user.userId,
    });
  }

  @Get('balance')
  async getBalance(
    @CurrentUser()
    user: {
      userId: string;
    },
  ) {
    return this.getWalletBalanceUseCase.execute({
      userId: user.userId,
    });
  }

  @Get('transactions')
  async getTransactions(
    @CurrentUser()
    user: {
      userId: string;
    },

    @Query('type')
    type?: CoinTransactionType,
  ) {
    return this.listCoinTransactionsUseCase.execute({
      userId: user.userId,
      type,
    });
  }
}
