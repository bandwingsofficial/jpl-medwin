import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { BannerRepository } from '../../domain/repositories/banner.repository';
import { BannerImageRepository } from '../../domain/repositories/banner-image.repository';

import { Banner } from '../../domain/entities/banner.entity';
import { BannerImage } from '../../domain/entities/banner-image.entity';

import { BannerStatus } from '../../domain/enums/banner-status.enum';
import { BannerType } from '../../domain/enums/banner-type.enum';

import { BannerAlreadyExistsException } from '../../domain/exceptions/banner-already-exists.exception';

@Injectable()
export class CreateBannerUseCase {
  constructor(
    @Inject(TOKENS.BANNER_REPO)
    private readonly bannerRepo: BannerRepository,

    @Inject(TOKENS.BANNER_IMAGE_REPO)
    private readonly bannerImageRepo: BannerImageRepository,
  ) {}

  async execute(input: {
    name: string;

    type: BannerType;

    priority?: number;

    images: {
      imageUrl: string;
      link?: string;
      productId?: string;
      sortOrder?: number;
    }[];
  }) {
    // =======================
    // 🔍 INCLUDING DELETED
    // =======================

    const existing = await this.bannerRepo.findByNameIncludingDeleted(input.name);

    // =======================
    // ♻️ RESTORE
    // =======================

    if (existing?.isDeleted()) {
      existing.restore();

      existing.name = input.name;

      existing.type = input.type;

      existing.status = BannerStatus.ACTIVE;

      const restored = await this.bannerRepo.updateWithPriority(existing, input.priority);

      return {
        id: restored.id,

        name: restored.name,

        type: restored.type,

        priority: restored.priority,

        status: restored.status,

        createdAt: restored.createdAt,

        updatedAt: restored.updatedAt,
      };
    }

    // =======================
    // 🚫 EXISTS
    // =======================

    if (existing) {
      throw new BannerAlreadyExistsException({
        name: input.name,
      });
    }

    // =======================
    // 🆕 CREATE BANNER
    // =======================

    const banner = new Banner(
      crypto.randomUUID(),

      input.name,

      input.type,

      input.priority ?? 1,

      BannerStatus.ACTIVE,
    );

    const createdBanner = await this.bannerRepo.createWithPriority(banner, input.priority);

    // =======================
    // 🖼️ CREATE IMAGES
    // =======================

    const createdImages = await Promise.all(
      input.images.map(async (image, index) => {
        const sortOrder =
          image.sortOrder !== undefined && image.sortOrder !== null && !isNaN(image.sortOrder)
            ? image.sortOrder
            : index;

        const bannerImage = new BannerImage(
          crypto.randomUUID(),

          createdBanner.id,

          image.imageUrl,

          image.link,

          image.productId,

          sortOrder,
        );

        return this.bannerImageRepo.create(bannerImage);
      }),
    );

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: createdBanner.id,

      name: createdBanner.name,

      type: createdBanner.type,

      priority: createdBanner.priority,

      status: createdBanner.status,

      images: createdImages.map((image) => ({
        id: image.id,

        imageUrl: image.imageUrl,

        link: image.link ?? null,

        productId: image.productId ?? null,

        sortOrder: image.sortOrder,
      })),

      createdAt: createdBanner.createdAt,

      updatedAt: createdBanner.updatedAt,
    };
  }
}
