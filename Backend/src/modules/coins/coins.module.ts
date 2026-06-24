import { Module } from '@nestjs/common';

import { ScheduleModule } from '@nestjs/schedule';

import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

// import { AuthModule } from '@/modules/auth/auth.module';

import { TOKENS } from '@/common/constants/tokens';

// =======================
// CONTROLLERS
// =======================

import { AdminCoinsController } from './presentation/controllers/admin-coins.controller';
import { AdminRewardTierController } from './presentation/controllers/admin-reward-tier.controller';
import { AdminRewardConfigController } from './presentation/controllers/admin-reward-config.controller';
import { PublicWalletController } from './presentation/controllers/public-wallet.controller';
import { PublicRewardsController } from './presentation/controllers/public-rewards.controller';

// =======================
// APPLICATION SERVICES
// =======================

import { CoinsApplicationService } from './application/services/coins-application.service';
import { WalletApplicationService } from './application/services/wallet-application.service';
import { RewardsApplicationService } from './application/services/rewards-application.service';

// =======================
// DOMAIN SERVICES
// =======================

import { CoinsDomainService } from './domain/services/coins-domain.service';
import { RewardsDomainService } from './domain/services/rewards-domain.service';
import { RedemptionDomainService } from './domain/services/redemption-domain.service';

// =======================
// CONFIG USE CASES
// =======================

import { CreateRewardConfigUseCase } from './application/use-cases/config/create-reward-config.use-case';
import { UpdateRewardConfigUseCase } from './application/use-cases/config/update-reward-config.use-case';
import { GetRewardConfigUseCase } from './application/use-cases/config/get-reward-config.use-case';

// =======================
// WALLET USE CASES
// =======================

import { GetWalletUseCase } from './application/use-cases/wallet/get-wallet.use-case';
import { GetWalletBalanceUseCase } from './application/use-cases/wallet/get-wallet-balance.use-case';
import { CreditCoinsUseCase } from './application/use-cases/wallet/credit-coins.use-case';
import { DebitCoinsUseCase } from './application/use-cases/wallet/debit-coins.use-case';
import { ExpireCoinsUseCase } from './application/use-cases/wallet/expire-coins.use-case';
import { RefundCoinsUseCase } from './application/use-cases/wallet/refund-coins.use-case';

// =======================
// TRANSACTION USE CASES
// =======================

import { CreateCoinTransactionUseCase } from './application/use-cases/transactions/create-coin-transaction.use-case';
import { ListCoinTransactionsUseCase } from './application/use-cases/transactions/list-coin-transactions.use-case';
import { GetCoinTransactionUseCase } from './application/use-cases/transactions/get-coin-transaction.use-case';

// =======================
// REDEMPTION USE CASES
// =======================

import { RedeemCoinsUseCase } from './application/use-cases/redemption/redeem-coins.use-case';
import { ValidateRedemptionUseCase } from './application/use-cases/redemption/validate-redemption.use-case';

// =======================
// REWARD USE CASES
// =======================

import { CalculateEarnedCoinsUseCase } from './application/use-cases/rewards/calculate-earned-coins.use-case';
import { ApplyRewardTierUseCase } from './application/use-cases/rewards/apply-reward-tier.use-case';
import { ProcessOrderRewardUseCase } from './application/use-cases/rewards/process-order-reward.use-case';

// =======================
// TIER USE CASES
// =======================

import { CreateTierUseCase } from './application/use-cases/tiers/create-tier.use-case';
import { UpdateTierUseCase } from './application/use-cases/tiers/update-tier.use-case';
import { AssignTierUseCase } from './application/use-cases/tiers/assign-tier.use-case';
import { ListTiersUseCase } from './application/use-cases/tiers/list-tiers.use-case';

// =======================
// CAMPAIGN USE CASES
// =======================

import { CreateRewardCampaignUseCase } from './application/use-cases/campaigns/create-reward-campaign.use-case';
import { UpdateRewardCampaignUseCase } from './application/use-cases/campaigns/update-reward-campaign.use-case';
import { ListRewardCampaignsUseCase } from './application/use-cases/campaigns/list-reward-campaigns.use-case';

// =======================
// ANALYTICS USE CASES
// =======================

import { GetCoinsAnalyticsUseCase } from './application/use-cases/analytics/get-coins-analytics.use-case';
import { GetRedemptionAnalyticsUseCase } from './application/use-cases/analytics/get-redemption-analytics.use-case';
import { GetTopUsersUseCase } from './application/use-cases/analytics/get-top-users.use-case';

// =======================
// JOBS
// =======================

import { ExpireCoinsJob } from './application/use-cases/jobs/expire-coins.job';
import { UpdateUserTiersJob } from './application/use-cases/jobs/update-user-tiers.job';

// =======================
// REPOSITORIES
// =======================

import { PrismaCoinWalletRepository } from './infrastructure/persistence/prisma/repositories/prisma-coin-wallet.repository';
import { PrismaCoinTransactionRepository } from './infrastructure/persistence/prisma/repositories/prisma-coin-transaction.repository';
import { PrismaCoinRedemptionRepository } from './infrastructure/persistence/prisma/repositories/prisma-coin-redemption.repository';
import { PrismaRewardConfigRepository } from './infrastructure/persistence/prisma/repositories/prisma-reward-config.repository';
import { PrismaRewardTierRepository } from './infrastructure/persistence/prisma/repositories/prisma-reward-tier.repository';
import { PrismaRewardCampaignRepository } from './infrastructure/persistence/prisma/repositories/prisma-reward-campaign.repository';


import { PrismaUserRepository } from '@/modules/auth/infrastructure/persistence/prisma/repositories/user.repository';

@Module({
  imports: [PrismaModule, ScheduleModule.forRoot()],

  controllers: [
    AdminCoinsController,
    AdminRewardTierController,
    AdminRewardConfigController,
    PublicWalletController,
    PublicRewardsController,
  ],

  providers: [
    // =======================
    // APPLICATION SERVICES
    // =======================

    CoinsApplicationService,
    WalletApplicationService,
    RewardsApplicationService,

    // =======================
    // DOMAIN SERVICES
    // =======================

    CoinsDomainService,
    RewardsDomainService,
    RedemptionDomainService,

    // =======================
    // CONFIG
    // =======================

    CreateRewardConfigUseCase,
    UpdateRewardConfigUseCase,
    GetRewardConfigUseCase,

    // =======================
    // WALLET
    // =======================

    GetWalletUseCase,
    GetWalletBalanceUseCase,
    CreditCoinsUseCase,
    DebitCoinsUseCase,
    ExpireCoinsUseCase,
    RefundCoinsUseCase,

    // =======================
    // TRANSACTIONS
    // =======================

    CreateCoinTransactionUseCase,
    ListCoinTransactionsUseCase,
    GetCoinTransactionUseCase,

    // =======================
    // REDEMPTION
    // =======================

    RedeemCoinsUseCase,
    ValidateRedemptionUseCase,

    // =======================
    // REWARDS
    // =======================

    CalculateEarnedCoinsUseCase,
    ApplyRewardTierUseCase,
    ProcessOrderRewardUseCase,

    // =======================
    // TIERS
    // =======================

    CreateTierUseCase,
    UpdateTierUseCase,
    AssignTierUseCase,
    ListTiersUseCase,

    // =======================
    // CAMPAIGNS
    // =======================

    CreateRewardCampaignUseCase,
    UpdateRewardCampaignUseCase,
    ListRewardCampaignsUseCase,

    // =======================
    // ANALYTICS
    // =======================

    GetCoinsAnalyticsUseCase,
    GetRedemptionAnalyticsUseCase,
    GetTopUsersUseCase,

    // =======================
    // JOBS
    // =======================

    ExpireCoinsJob,
    UpdateUserTiersJob,

    // =======================
    // REPOSITORIES
    // =======================
    {
  provide: TOKENS.USER_REPO,
  useClass: PrismaUserRepository,
},

    {
      provide: TOKENS.COIN_WALLET_REPO,
      useClass: PrismaCoinWalletRepository,
    },

    {
      provide: TOKENS.COIN_TRANSACTION_REPO,
      useClass: PrismaCoinTransactionRepository,
    },

    {
      provide: TOKENS.COIN_REDEMPTION_REPO,
      useClass: PrismaCoinRedemptionRepository,
    },

    {
      provide: TOKENS.REWARD_CONFIG_REPO,
      useClass: PrismaRewardConfigRepository,
    },

    {
      provide: TOKENS.REWARD_TIER_REPO,
      useClass: PrismaRewardTierRepository,
    },

    {
      provide: TOKENS.REWARD_CAMPAIGN_REPO,
      useClass: PrismaRewardCampaignRepository,
    },
  ],

  exports: [
    TOKENS.COIN_WALLET_REPO,
    TOKENS.COIN_TRANSACTION_REPO,
    TOKENS.COIN_REDEMPTION_REPO,
    TOKENS.REWARD_CONFIG_REPO,
    TOKENS.REWARD_TIER_REPO,
    TOKENS.REWARD_CAMPAIGN_REPO,

    CoinsApplicationService,
    WalletApplicationService,
    RewardsApplicationService,

    CreditCoinsUseCase,
    DebitCoinsUseCase,
    RedeemCoinsUseCase,
    RefundCoinsUseCase,

    ProcessOrderRewardUseCase,
    ValidateRedemptionUseCase,

    GetWalletUseCase,
    GetWalletBalanceUseCase,

    GetRewardConfigUseCase,

    ListCoinTransactionsUseCase,
    GetCoinTransactionUseCase,

    ListTiersUseCase,
    AssignTierUseCase,

    ListRewardCampaignsUseCase,
  ],
})
export class CoinsModule {}
