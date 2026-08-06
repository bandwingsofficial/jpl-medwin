import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { BannerImageRepository } from '../../../../domain/repositories/banner-image.repository';

import { BannerImage } from '../../../../domain/entities/banner-image.entity';

import { BannerImageMapper } from '../mappers/banner-image.mapper';

@Injectable()
export class PrismaBannerImageRepository implements BannerImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // 🔍 FIND
  // =======================

  async findById(id: string): Promise<BannerImage | null> {
    const data = await this.prisma.bannerImage.findFirst({
      where: {
        id,

        deletedAt: null,
      },

      include: {
        product: {
          select: {
            slug: true,
          },
        },
      },
    });

    return data ? BannerImageMapper.toDomain(data) : null;
  }

  async findByBannerId(bannerId: string): Promise<BannerImage[]> {
    const data = await this.prisma.bannerImage.findMany({
      where: {
        bannerId,

        deletedAt: null,
      },

      include: {
        product: {
          select: {
            slug: true,
          },
        },
      },

      orderBy: {
        sortOrder: 'asc',
      },
    });

    return data.map((item) => BannerImageMapper.toDomain(item));
  }

  async findByProductId(productId: string): Promise<BannerImage[]> {
    const data = await this.prisma.bannerImage.findMany({
      where: {
        productId,

        deletedAt: null,
      },

      orderBy: {
        sortOrder: 'asc',
      },
    });

    return data.map((item) => BannerImageMapper.toDomain(item));
  }

  // =======================
  // ♻️ FIND INCLUDING DELETED
  // =======================

  async findByIdIncludingDeleted(id: string): Promise<BannerImage | null> {
    const data = await this.prisma.bannerImage.findUnique({
      where: {
        id,
      },

      include: {
        product: {
          select: {
            slug: true,
          },
        },
      },
    });

    return data ? BannerImageMapper.toDomain(data) : null;
  }

  // =======================
  // ✍️ WRITE
  // =======================

  async create(image: BannerImage): Promise<BannerImage> {
    const data = await this.prisma.bannerImage.create({
      data: BannerImageMapper.toPersistence(image),
    });

    return BannerImageMapper.toDomain(data);
  }

  async createMany(images: BannerImage[]): Promise<void> {
    await this.prisma.bannerImage.createMany({
      data: images.map((image) => BannerImageMapper.toPersistence(image)),
    });
  }

  async update(image: BannerImage): Promise<BannerImage> {
    const data = await this.prisma.bannerImage.update({
      where: {
        id: image.id,
      },

      data: BannerImageMapper.toPersistence(image),
    });

    return BannerImageMapper.toDomain(data);
  }

  async updateSortOrder(params: {
    id: string;

    sortOrder: number;
  }): Promise<void> {
    await this.prisma.bannerImage.update({
      where: {
        id: params.id,
      },

      data: {
        sortOrder: params.sortOrder,
      },
    });
  }

  // =======================
  // ❌ DELETE
  // =======================

  async softDelete(id: string): Promise<void> {
    await this.prisma.bannerImage.update({
      where: {
        id,
      },

      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(id: string): Promise<void> {
    await this.prisma.bannerImage.update({
      where: {
        id,
      },

      data: {
        deletedAt: null,
      },
    });
  }

  async deleteByBannerId(bannerId: string): Promise<void> {
    await this.prisma.bannerImage.updateMany({
      where: {
        bannerId,
      },

      data: {
        deletedAt: new Date(),
      },
    });
  }
  // =======================
  // ♻️ FIND INCLUDING DELETED
  // =======================

  async findByBannerIdIncludingDeleted(bannerId: string): Promise<BannerImage[]> {
    const data = await this.prisma.bannerImage.findMany({
      where: {
        bannerId,
      },

      orderBy: {
        sortOrder: 'asc',
      },
    });

    return data.map((item) => BannerImageMapper.toDomain(item));
  }
}
