import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/presentation/guards/role.guard';
import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';

import { UserRole } from '@/domain/enums/user-role.enum';

import { RewardTierStatus } from '../../domain/enums/reward-tier-status.enum';

import { CreateRewardConfigUseCase } from '../../application/use-cases/config/create-reward-config.use-case';
import { UpdateRewardConfigUseCase } from '../../application/use-cases/config/update-reward-config.use-case';
import { GetRewardConfigUseCase } from '../../application/use-cases/config/get-reward-config.use-case';

import { GetWalletUseCase } from '../../application/use-cases/wallet/get-wallet.use-case';
import { GetWalletBalanceUseCase } from '../../application/use-cases/wallet/get-wallet-balance.use-case';
import { CreditCoinsUseCase } from '../../application/use-cases/wallet/credit-coins.use-case';
import { DebitCoinsUseCase } from '../../application/use-cases/wallet/debit-coins.use-case';
import { RefundCoinsUseCase } from '../../application/use-cases/wallet/refund-coins.use-case';
import { ExpireCoinsUseCase } from '../../application/use-cases/wallet/expire-coins.use-case';

import { ListCoinTransactionsUseCase } from '../../application/use-cases/transactions/list-coin-transactions.use-case';
import { GetCoinTransactionUseCase } from '../../application/use-cases/transactions/get-coin-transaction.use-case';

import { CreateTierUseCase } from '../../application/use-cases/tiers/create-tier.use-case';
import { UpdateTierUseCase } from '../../application/use-cases/tiers/update-tier.use-case';
import { ListTiersUseCase } from '../../application/use-cases/tiers/list-tiers.use-case';

import { CreateRewardCampaignUseCase } from '../../application/use-cases/campaigns/create-reward-campaign.use-case';
import { UpdateRewardCampaignUseCase } from '../../application/use-cases/campaigns/update-reward-campaign.use-case';
import { ListRewardCampaignsUseCase } from '../../application/use-cases/campaigns/list-reward-campaigns.use-case';

import { GetCoinsAnalyticsUseCase } from '../../application/use-cases/analytics/get-coins-analytics.use-case';
import { GetRedemptionAnalyticsUseCase } from '../../application/use-cases/analytics/get-redemption-analytics.use-case';
import { GetTopUsersUseCase } from '../../application/use-cases/analytics/get-top-users.use-case';

import { CreateRewardConfigDto } from '../dto/config/create-reward-config.dto';
import { UpdateRewardConfigDto } from '../dto/config/update-reward-config.dto';

import { CreditCoinsDto } from '../dto/wallet/credit-coins.dto';
import { DebitCoinsDto } from '../dto/wallet/debit-coins.dto';
import { RefundCoinsDto } from '../dto/wallet/refund-coins.dto';

import { CreateRewardTierDto } from '../dto/tiers/create-reward-tier.dto';
import { UpdateRewardTierDto } from '../dto/tiers/update-reward-tier.dto';

import { CreateRewardCampaignDto } from '../dto/campaigns/create-reward-campaign.dto';
import { UpdateRewardCampaignDto } from '../dto/campaigns/update-reward-campaign.dto';

@Controller('admin/coins')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminCoinsController {
  constructor(
    private readonly createRewardConfigUseCase: CreateRewardConfigUseCase,
    private readonly updateRewardConfigUseCase: UpdateRewardConfigUseCase,
    private readonly getRewardConfigUseCase: GetRewardConfigUseCase,

    private readonly getWalletUseCase: GetWalletUseCase,
    private readonly getWalletBalanceUseCase: GetWalletBalanceUseCase,
    private readonly creditCoinsUseCase: CreditCoinsUseCase,
    private readonly debitCoinsUseCase: DebitCoinsUseCase,
    private readonly refundCoinsUseCase: RefundCoinsUseCase,
    private readonly expireCoinsUseCase: ExpireCoinsUseCase,

    private readonly listCoinTransactionsUseCase: ListCoinTransactionsUseCase,
    private readonly getCoinTransactionUseCase: GetCoinTransactionUseCase,

    private readonly createTierUseCase: CreateTierUseCase,
    private readonly updateTierUseCase: UpdateTierUseCase,
    private readonly listTiersUseCase: ListTiersUseCase,

    private readonly createRewardCampaignUseCase: CreateRewardCampaignUseCase,
    private readonly updateRewardCampaignUseCase: UpdateRewardCampaignUseCase,
    private readonly listRewardCampaignsUseCase: ListRewardCampaignsUseCase,

    private readonly getCoinsAnalyticsUseCase: GetCoinsAnalyticsUseCase,
    private readonly getRedemptionAnalyticsUseCase: GetRedemptionAnalyticsUseCase,
    private readonly getTopUsersUseCase: GetTopUsersUseCase,
  ) {}

  @Post('config')
  async createConfig(
    @Body()
    body: CreateRewardConfigDto,
  ) {
    return this.createRewardConfigUseCase.execute(body);
  }

  @Patch('config/:id')
  async updateConfig(
    @Param('id')
    id: string,

    @Body()
    body: UpdateRewardConfigDto,
  ) {
    return this.updateRewardConfigUseCase.execute({
      id,
      ...body,
    });
  }

  @Get('config')
  async getConfig() {
    return this.getRewardConfigUseCase.execute({
      activeOnly: true,
    });
  }

  @Get('wallets/:userId')
  async getWallet(
    @Param('userId')
    userId: string,
  ) {
    return this.getWalletUseCase.execute({
      userId,
    });
  }

  @Get('wallets/:userId/balance')
  async getWalletBalance(
    @Param('userId')
    userId: string,
  ) {
    return this.getWalletBalanceUseCase.execute({
      userId,
    });
  }

  @Post('wallets/credit')
  async creditCoins(
    @Body()
    body: CreditCoinsDto,
  ) {
    return this.creditCoinsUseCase.execute({
      ...body,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    });
  }

  @Post('wallets/debit')
  async debitCoins(
    @Body()
    body: DebitCoinsDto,
  ) {
    return this.debitCoinsUseCase.execute(body);
  }

  @Post('wallets/refund')
  async refundCoins(
    @Body()
    body: RefundCoinsDto,
  ) {
    return this.refundCoinsUseCase.execute(body);
  }

  @Post('wallets/expire')
  async expireCoins() {
    return this.expireCoinsUseCase.execute();
  }

  @Get('transactions')
  async listTransactions(
    @Query('walletId')
    walletId?: string,

    @Query('userId')
    userId?: string,
  ) {
    return this.listCoinTransactionsUseCase.execute({
      walletId,
      userId,
    });
  }

  @Get('transactions/:transactionId')
  async getTransaction(
    @Param('transactionId')
    transactionId: string,
  ) {
    return this.getCoinTransactionUseCase.execute({
      transactionId,
    });
  }

  @Post('tiers')
  async createTier(
    @Body()
    body: CreateRewardTierDto,
  ) {
    return this.createTierUseCase.execute(body);
  }

  @Patch('tiers/:id')
  async updateTier(
    @Param('id')
    id: string,

    @Body()
    body: UpdateRewardTierDto,
  ) {
    return this.updateTierUseCase.execute({
      id,
      ...body,
    });
  }

  @Get('tiers')
  async listTiers(
    @Query('status')
    status?: RewardTierStatus,
  ) {
    return this.listTiersUseCase.execute({
      status,
    });
  }

  @Post('campaigns')
  async createCampaign(
    @Body()
    body: CreateRewardCampaignDto,
  ) {
    return this.createRewardCampaignUseCase.execute({
      ...body,
      startsAt: new Date(body.startsAt),
      endsAt: new Date(body.endsAt),
    });
  }

  @Patch('campaigns/:id')
  async updateCampaign(
    @Param('id')
    id: string,

    @Body()
    body: UpdateRewardCampaignDto,
  ) {
    return this.updateRewardCampaignUseCase.execute({
      id,
      ...body,
      startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
      endsAt: body.endsAt ? new Date(body.endsAt) : undefined,
    });
  }

  @Get('campaigns')
  async listCampaigns() {
    return this.listRewardCampaignsUseCase.execute();
  }

  @Get('analytics')
  async getAnalytics() {
    return this.getCoinsAnalyticsUseCase.execute();
  }

  @Get('analytics/redemptions')
  async getRedemptionAnalytics() {
    return this.getRedemptionAnalyticsUseCase.execute();
  }

  @Get('analytics/top-users')
  async getTopUsers(
    @Query('limit')
    limit?: string,
  ) {
    return this.getTopUsersUseCase.execute({
      limit: limit ? Number(limit) : 10,
    });
  }
}
