import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { BannerRepository } from '../../domain/repositories/banner.repository';
import { BannerImageRepository } from '../../domain/repositories/banner-image.repository';

import { BannerImage } from '../../domain/entities/banner-image.entity';

import { BannerNotFoundException } from '../../domain/exceptions/banner-not-found.exception';

@Injectable()
export class AddBannerImageUseCase {
  constructor(
    @Inject(TOKENS.BANNER_REPO)
    private readonly bannerRepo: BannerRepository,

    @Inject(TOKENS.BANNER_IMAGE_REPO)
    private readonly bannerImageRepo: BannerImageRepository,
  ) {}

  async execute(input: {
    bannerId: string;

    imageUrl: string;

    link?: string;

    productId?: string;

    sortOrder?: number;
  }) {
    // =======================
    // 🔍 VERIFY BANNER
    // =======================

    const banner = await this.bannerRepo.findById(input.bannerId);

    if (!banner) {
      throw new BannerNotFoundException({
        bannerId: input.bannerId,
      });
    }

    // =======================
    // 🖼 CREATE IMAGE
    // =======================

    const image = new BannerImage(
      crypto.randomUUID(),

      input.bannerId,

      input.imageUrl,

      input.link,

      input.productId,

      input.sortOrder ?? 0,
    );

    const created = await this.bannerImageRepo.createWithSortOrder(image, input.sortOrder);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: created.id,

      bannerId: created.bannerId,

      imageUrl: created.imageUrl,

      link: created.link ?? null,

      productId: created.productId ?? null,

      sortOrder: created.sortOrder,

      createdAt: created.createdAt,

      updatedAt: created.updatedAt,
    };
  }
}
