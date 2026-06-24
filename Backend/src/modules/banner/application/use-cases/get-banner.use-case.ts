import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { BannerRepository } from '../../domain/repositories/banner.repository';
import { BannerImageRepository } from '../../domain/repositories/banner-image.repository';
import { ProductRepository } from '../../../product/domain/repositories/product.repository';

import { BannerNotFoundException } from '../../domain/exceptions/banner-not-found.exception';

@Injectable()
export class GetBannerUseCase {
  constructor(
    @Inject(TOKENS.BANNER_REPO)
    private readonly bannerRepo: BannerRepository,

    @Inject(TOKENS.BANNER_IMAGE_REPO)
    private readonly bannerImageRepo: BannerImageRepository,

    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(bannerId: string) {
    // =======================
    // 🔍 FIND BANNER
    // =======================

    const banner = await this.bannerRepo.findById(bannerId);

    if (!banner) {
      throw new BannerNotFoundException({ bannerId });
    }

    // =======================
    // 🔍 FIND IMAGES
    // =======================

    const images = await this.bannerImageRepo.findByBannerId(banner.id);

    // =======================
    // 🔍 RESOLVE PRODUCT SLUGS
    // =======================

    // Collect unique productIds that are actually set — one DB call, not N calls
    const productIds = [
      ...new Set(
        images
          .map((image) => image.productId)
          .filter((id): id is string => !!id),
      ),
    ];

    // productSlugMap → { [productId]: slug }
    // If no images have a productId we skip the DB call entirely
    const productSlugMap = new Map<string, string>();

    if (productIds.length > 0) {
      const products = await this.productRepo.findByIds(productIds);

      for (const product of products) {
        productSlugMap.set(product.id, product.slug);
      }
    }

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: banner.id,

      name: banner.name,

      type: banner.type,

      status: banner.status,

      images: images.map((image) => ({
        id: image.id,

        bannerId: image.bannerId,

        imageUrl: image.imageUrl,

        productId: image.productId ?? null,

        // Resolved at read time from productRepo — not stored on BannerImage
        productSlug: image.productId
          ? (productSlugMap.get(image.productId) ?? null)
          : null,

        sortOrder: image.sortOrder,

        createdAt: image.createdAt,

        updatedAt: image.updatedAt,
      })),

      createdAt: banner.createdAt,

      updatedAt: banner.updatedAt,
    };
  }
}