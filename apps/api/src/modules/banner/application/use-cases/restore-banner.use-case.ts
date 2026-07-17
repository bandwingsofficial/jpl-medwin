import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { BannerRepository } from '../../domain/repositories/banner.repository';
import { BannerImageRepository } from '../../domain/repositories/banner-image.repository';

import { BannerNotFoundException } from '../../domain/exceptions/banner-not-found.exception';

@Injectable()
export class RestoreBannerUseCase {
  constructor(
    @Inject(TOKENS.BANNER_REPO)
    private readonly bannerRepo: BannerRepository,

    @Inject(TOKENS.BANNER_IMAGE_REPO)
    private readonly bannerImageRepo: BannerImageRepository,
  ) {}

  async execute(bannerId: string): Promise<void> {
    // =======================
    // 🔍 FIND BANNER
    // =======================

    const banner = await this.bannerRepo.findByIdIncludingDeleted(bannerId);

    if (!banner) {
      throw new BannerNotFoundException({
        bannerId,
      });
    }

    // =======================
    // 🔍 FIND IMAGES
    // =======================

    const images = await this.bannerImageRepo.findByBannerIdIncludingDeleted(bannerId);

    // =======================
    // ♻️ RESTORE IMAGES
    // =======================

    await Promise.all(
      images.map(async (image) => {
        image.restore();

        return this.bannerImageRepo.update(image);
      }),
    );

    // =======================
    // ♻️ RESTORE BANNER
    // =======================

    banner.restore();

    // =======================
    // 💾 SAVE
    // =======================

    await this.bannerRepo.update(banner);
  }
}
