import { Injectable, Logger } from '@nestjs/common';

import { Cron } from '@nestjs/schedule';

import { ExpireCoinsUseCase } from '../wallet/expire-coins.use-case';

@Injectable()
export class ExpireCoinsJob {
  private readonly logger = new Logger(ExpireCoinsJob.name);

  constructor(private readonly expireCoinsUseCase: ExpireCoinsUseCase) {}

  @Cron('0 2 * * *')
  async handleExpireCoins() {
    this.logger.log('Starting expired coins job...');

    try {
      const result = await this.expireCoinsUseCase.execute();

      this.logger.log(
        `Expired coins processed successfully. Total processed: ${result.totalProcessed}`,
      );
    } catch (error) {
      this.logger.error(
        'Failed to process expired coins',
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
