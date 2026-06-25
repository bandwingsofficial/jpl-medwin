import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { BannerImageRepository } from '../../domain/repositories/banner-image.repository';

import { BannerImageNotFoundException } from '../../domain/exceptions/banner-image-not-found.exception';

@Injectable()
export class RestoreBannerImageUseCase {
  constructor(
    @Inject(TOKENS.BANNER_IMAGE_REPO)
    private readonly bannerImageRepo: BannerImageRepository,
  ) {}

  async execute(bannerImageId: string): Promise<void> {
    // =======================
    // 🔍 FIND INCLUDING DELETED
    // =======================

    const image = await this.bannerImageRepo.findByIdIncludingDeleted(bannerImageId);

    if (!image) {
      throw new BannerImageNotFoundException({
        bannerImageId,
      });
    }

    // =======================
    // ♻️ RESTORE
    // =======================

    image.restore();

    // =======================
    // 💾 SAVE
    // =======================

    await this.bannerImageRepo.update(image);
  }
}
