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

      orderBy: [
        {
          sortOrder: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });

    // Auto-normalize any duplicate sort orders in existing data
    const sortOrders = data.map((d) => d.sortOrder);
    const hasDuplicates = new Set(sortOrders).size !== sortOrders.length;

    if (hasDuplicates && data.length > 0) {
      await this.prisma.$transaction(
        data.map((item, index) =>
          this.prisma.bannerImage.update({
            where: { id: item.id },
            data: { sortOrder: index },
          }),
        ),
      );

      data.forEach((item, index) => {
        item.sortOrder = index;
      });
    }

    return data.map((item) => BannerImageMapper.toDomain(item));
  }

  async findByProductId(productId: string): Promise<BannerImage[]> {
    const data = await this.prisma.bannerImage.findMany({
      where: {
        productId,

        deletedAt: null,
      },

      orderBy: [
        {
          sortOrder: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
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
    return this.createWithSortOrder(image, image.sortOrder);
  }

  async createWithSortOrder(image: BannerImage, requestedSortOrder?: number): Promise<BannerImage> {
    return this.prisma.$transaction(async (tx) => {
      const activeImages = await tx.bannerImage.findMany({
        where: {
          bannerId: image.bannerId,
          deletedAt: null,
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      });

      const total = activeImages.length;
      let targetSortOrder: number;

      if (requestedSortOrder === undefined || requestedSortOrder === null || isNaN(requestedSortOrder)) {
        targetSortOrder = total;
      } else if (requestedSortOrder < 0) {
        targetSortOrder = 0;
      } else if (requestedSortOrder > total) {
        targetSortOrder = total;
      } else {
        targetSortOrder = Math.floor(requestedSortOrder);
      }

      // Shift affected existing images
      for (let i = 0; i < activeImages.length; i++) {
        const item = activeImages[i];
        const newSortOrder = i < targetSortOrder ? i : i + 1;

        if (item.sortOrder !== newSortOrder) {
          await tx.bannerImage.update({
            where: { id: item.id },
            data: { sortOrder: newSortOrder },
          });
        }
      }

      image.sortOrder = targetSortOrder;
      const persistenceData = BannerImageMapper.toPersistence(image);

      const created = await tx.bannerImage.create({
        data: {
          ...persistenceData,
          sortOrder: targetSortOrder,
        },
      });

      return BannerImageMapper.toDomain(created);
    });
  }

  async createMany(images: BannerImage[]): Promise<void> {
    await this.prisma.bannerImage.createMany({
      data: images.map((image) => BannerImageMapper.toPersistence(image)),
    });
  }

  async update(image: BannerImage): Promise<BannerImage> {
    return this.updateWithSortOrder(image, image.sortOrder);
  }

  async updateWithSortOrder(image: BannerImage, newSortOrder?: number): Promise<BannerImage> {
    return this.prisma.$transaction(async (tx) => {
      const activeImages = await tx.bannerImage.findMany({
        where: {
          bannerId: image.bannerId,
          deletedAt: null,
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      });

      const existingIndex = activeImages.findIndex((img) => img.id === image.id);
      if (existingIndex === -1) {
        const updated = await tx.bannerImage.update({
          where: { id: image.id },
          data: BannerImageMapper.toPersistence(image),
        });
        return BannerImageMapper.toDomain(updated);
      }

      const currentSortOrder = activeImages[existingIndex].sortOrder;
      const total = activeImages.length;

      let targetSortOrder = currentSortOrder;
      if (newSortOrder !== undefined && newSortOrder !== null && !isNaN(newSortOrder)) {
        if (newSortOrder < 0) {
          targetSortOrder = 0;
        } else if (newSortOrder >= total) {
          targetSortOrder = total - 1;
        } else {
          targetSortOrder = Math.floor(newSortOrder);
        }
      }

      // Re-sequence in memory
      const reordered = [...activeImages];
      const [removed] = reordered.splice(existingIndex, 1);
      reordered.splice(targetSortOrder, 0, removed);

      for (let i = 0; i < reordered.length; i++) {
        const item = reordered[i];
        const correctSortOrder = i;

        if (item.id === image.id) {
          image.sortOrder = correctSortOrder;
          await tx.bannerImage.update({
            where: { id: image.id },
            data: {
              ...BannerImageMapper.toPersistence(image),
              sortOrder: correctSortOrder,
            },
          });
        } else if (item.sortOrder !== correctSortOrder) {
          await tx.bannerImage.update({
            where: { id: item.id },
            data: { sortOrder: correctSortOrder },
          });
        }
      }

      const refreshed = await tx.bannerImage.findUnique({
        where: { id: image.id },
      });

      return refreshed ? BannerImageMapper.toDomain(refreshed) : image;
    });
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
    await this.prisma.$transaction(async (tx) => {
      const image = await tx.bannerImage.findUnique({
        where: { id },
      });

      if (!image || image.deletedAt !== null) {
        return;
      }

      await tx.bannerImage.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      const remainingImages = await tx.bannerImage.findMany({
        where: {
          bannerId: image.bannerId,
          deletedAt: null,
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      });

      for (let i = 0; i < remainingImages.length; i++) {
        const item = remainingImages[i];
        const correctSortOrder = i;
        if (item.sortOrder !== correctSortOrder) {
          await tx.bannerImage.update({
            where: { id: item.id },
            data: { sortOrder: correctSortOrder },
          });
        }
      }
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
