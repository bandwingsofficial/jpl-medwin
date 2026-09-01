import { BannerImage as PrismaBannerImage } from '@prisma/client';

import { BannerImage } from '../../../../domain/entities/banner-image.entity';

import { BannerStatus } from '../../../../domain/enums/banner-status.enum';

export class BannerImageMapper {
  static toDomain(
    p: PrismaBannerImage & {
      link?: string | null;
      product?: {
        slug: string;
      } | null;
    },
  ): BannerImage {
    return new BannerImage(
      p.id,

      p.bannerId,

      p.imageUrl,

      p.link ?? undefined,

      p.productId ?? undefined,

      p.sortOrder,

      p.status as BannerStatus,

      p.createdAt,

      p.updatedAt,

      p.deletedAt ?? undefined,
    );
  }

  static toPersistence(e: BannerImage) {
    return {
      id: e.id,

      bannerId: e.bannerId,

      imageUrl: e.imageUrl,

      link: e.link ?? null,

      productId: e.productId ?? null,

      sortOrder: e.sortOrder,

      status: e.status,

      createdAt: e.createdAt,

      updatedAt: e.updatedAt,

      deletedAt: e.deletedAt ?? null,
    };
  }
}
