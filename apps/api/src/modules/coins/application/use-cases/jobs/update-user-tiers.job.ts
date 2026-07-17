import { Inject, Injectable, Logger } from '@nestjs/common';

import { Cron } from '@nestjs/schedule';

import { TOKENS } from '@/common/constants/tokens';

import { CoinWalletRepository } from '../../../domain/repositories/coin-wallet.repository';

import { AssignTierUseCase } from '../tiers/assign-tier.use-case';

@Injectable()
export class UpdateUserTiersJob {
  private readonly logger = new Logger(UpdateUserTiersJob.name);

  constructor(
    @Inject(TOKENS.COIN_WALLET_REPO)
    private readonly walletRepo: CoinWalletRepository,

    private readonly assignTierUseCase: AssignTierUseCase,
  ) {}

  @Cron('0 3 * * *')
  async handleUpdateUserTiers() {
    this.logger.log('Starting user tier update job...');

    try {
      const wallets = await this.walletRepo.findAll();

      let updatedUsers = 0;

      for (const wallet of wallets) {
        try {
          await this.assignTierUseCase.execute({
            userId: wallet.userId,
          });

          updatedUsers++;
        } catch (error) {
          this.logger.warn(`Failed tier update for user ${wallet.userId}`);
        }
      }

      this.logger.log(`User tier update completed. Updated users: ${updatedUsers}`);
    } catch (error) {
      this.logger.error(
        'Failed to process user tier updates',
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
