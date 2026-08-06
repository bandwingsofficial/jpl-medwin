import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { BannerImageRepository } from '../../domain/repositories/banner-image.repository';

import { BannerImageNotFoundException } from '../../domain/exceptions/banner-image-not-found.exception';

@Injectable()
export class DeleteBannerImageUseCase {
  constructor(
    @Inject(TOKENS.BANNER_IMAGE_REPO)
    private readonly bannerImageRepo: BannerImageRepository,
  ) {}

  async execute(bannerImageId: string) {
    // =======================
    // 🔍 FIND
    // =======================

    const image = await this.bannerImageRepo.findById(bannerImageId);

    if (!image) {
      throw new BannerImageNotFoundException({
        bannerImageId,
      });
    }
    // =======================
    // 🔄 DEACTIVATE BANNER
    // =======================

    image.deactivate();

    // =======================
    // 🗑 SOFT DELETE
    // =======================

    image.softDelete();

    // =======================
    // 💾 SAVE
    // =======================

    await this.bannerImageRepo.update(image);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      success: true,
      message: 'Banner image deleted successfully',
    };
  }
}
