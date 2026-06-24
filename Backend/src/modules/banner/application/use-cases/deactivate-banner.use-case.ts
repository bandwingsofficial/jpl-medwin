import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { BannerRepository } from '../../domain/repositories/banner.repository';

import { BannerNotFoundException } from '../../domain/exceptions/banner-not-found.exception';

@Injectable()
export class DeactivateBannerUseCase {
  constructor(
    @Inject(TOKENS.BANNER_REPO)
    private readonly bannerRepo: BannerRepository,
  ) {}

  async execute(
    bannerId: string,
  ): Promise<void> {
    // =======================
    // 🔍 FIND
    // =======================

    const banner =
      await this.bannerRepo.findById(
        bannerId,
      );

    if (!banner) {
      throw new BannerNotFoundException({
        bannerId,
      });
    }

    // =======================
    // 🔄 DEACTIVATE
    // =======================

    banner.deactivate();

    // =======================
    // 💾 SAVE
    // =======================

    await this.bannerRepo.update(
      banner,
    );
  }
}