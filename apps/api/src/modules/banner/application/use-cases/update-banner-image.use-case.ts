import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { BannerImageRepository } from '../../domain/repositories/banner-image.repository';

import { BannerImageNotFoundException } from '../../domain/exceptions/banner-image-not-found.exception';

@Injectable()
export class UpdateBannerImageUseCase {
  constructor(
    @Inject(TOKENS.BANNER_IMAGE_REPO)
    private readonly bannerImageRepo: BannerImageRepository,
  ) {}

  async execute(input: {
    bannerImageId: string;

    imageUrl?: string;

    link?: string;

    productId?: string;

    sortOrder?: number;
  }) {
    // =======================
    // 🔍 FIND
    // =======================

    const image = await this.bannerImageRepo.findById(input.bannerImageId);

    if (!image) {
      throw new BannerImageNotFoundException({
        bannerImageId: input.bannerImageId,
      });
    }

    // =======================
    // ✏️ UPDATE IMAGE
    // =======================

    if (input.imageUrl !== undefined) {
      image.updateImage(input.imageUrl);
    }

    // =======================
    // ✏️ UPDATE LINK
    // =======================

    if (input.link !== undefined) {
      image.updateLink(input.link);
    }

    // =======================
    // ✏️ UPDATE PRODUCT
    // =======================

    if (input.productId !== undefined) {
      image.updateProduct(input.productId);
    }

    // =======================
    // ✏️ UPDATE SORT ORDER
    // =======================

    if (input.sortOrder !== undefined) {
      image.updateSortOrder(input.sortOrder);
    }

    // =======================
    // 💾 SAVE WITH SORT ORDER
    // =======================

    const updated = await this.bannerImageRepo.updateWithSortOrder(image, input.sortOrder);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: updated.id,

      bannerId: updated.bannerId,

      imageUrl: updated.imageUrl,

      link: updated.link ?? null,

      productId: updated.productId ?? null,

      sortOrder: updated.sortOrder,

      createdAt: updated.createdAt,

      updatedAt: updated.updatedAt,
    };
  }
}
