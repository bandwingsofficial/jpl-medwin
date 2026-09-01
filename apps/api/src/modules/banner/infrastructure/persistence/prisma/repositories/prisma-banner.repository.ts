import { Injectable } from '@nestjs/common';

import { BannerStatus as PrismaBannerStatus, BannerType as PrismaBannerType } from '@prisma/client';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { BannerRepository } from '../../../../domain/repositories/banner.repository';

import { Banner } from '../../../../domain/entities/banner.entity';

import { BannerStatus } from '../../../../domain/enums/banner-status.enum';

import { BannerType } from '../../../../domain/enums/banner-type.enum';

import { BannerMapper } from '../mappers/banner.mapper';

@Injectable()
export class PrismaBannerRepository implements BannerRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // 🔍 FIND
  // =======================

  async findById(id: string): Promise<Banner | null> {
    const data = await this.prisma.banner.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    return data ? BannerMapper.toDomain(data) : null;
  }

  async findAll(): Promise<Banner[]> {
    const data = await this.prisma.banner.findMany({
      where: {
        deletedAt: null,
      },

      orderBy: [
        {
          priority: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });

    return data.map((item) => BannerMapper.toDomain(item));
  }

  async findByType(type: BannerType): Promise<Banner[]> {
    const data = await this.prisma.banner.findMany({
      where: {
        type: type as unknown as PrismaBannerType,

        deletedAt: null,
      },

      orderBy: [
        {
          priority: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });

    return data.map((item) => BannerMapper.toDomain(item));
  }

  async findByStatus(status: BannerStatus): Promise<Banner[]> {
    const data = await this.prisma.banner.findMany({
      where: {
        status: status as unknown as PrismaBannerStatus,

        deletedAt: null,
      },

      orderBy: [
        {
          priority: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });

    return data.map((item) => BannerMapper.toDomain(item));
  }

  // =======================
  // ♻️ FIND INCLUDING DELETED
  // =======================

  async findByIdIncludingDeleted(id: string): Promise<Banner | null> {
    const data = await this.prisma.banner.findUnique({
      where: {
        id,
      },
    });

    return data ? BannerMapper.toDomain(data) : null;
  }

  async findByNameIncludingDeleted(name: string): Promise<Banner | null> {
    const data = await this.prisma.banner.findFirst({
      where: {
        name,
      },
    });

    return data ? BannerMapper.toDomain(data) : null;
  }

  // =======================
  // 🧠 CHECKS & COUNTS
  // =======================

  async existsByName(name: string): Promise<boolean> {
    const count = await this.prisma.banner.count({
      where: {
        name,
        deletedAt: null,
      },
    });

    return count > 0;
  }

  async countActiveByType(type: BannerType): Promise<number> {
    return this.prisma.banner.count({
      where: {
        type: type as unknown as PrismaBannerType,
        deletedAt: null,
      },
    });
  }

  async getNextPriority(type: BannerType): Promise<number> {
    const count = await this.countActiveByType(type);
    return count + 1;
  }

  // =======================
  // ✍️ WRITE WITH PRIORITY
  // =======================

  async create(banner: Banner): Promise<Banner> {
    return this.createWithPriority(banner, banner.priority);
  }

  async createWithPriority(banner: Banner, requestedPriority?: number): Promise<Banner> {
    return this.prisma.$transaction(async (tx) => {
      const prismaType = BannerMapper.toPersistence(banner).type;

      // 1. Fetch all active banners of the same type ordered by priority ASC, createdAt ASC
      const activeBanners = await tx.banner.findMany({
        where: {
          type: prismaType,
          deletedAt: null,
        },
        orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
      });

      const total = activeBanners.length;

      // 2. Normalize requested priority
      let targetPriority: number;
      if (requestedPriority === undefined || requestedPriority === null || isNaN(requestedPriority)) {
        targetPriority = total + 1;
      } else if (requestedPriority > total + 1) {
        targetPriority = total + 1;
      } else if (requestedPriority < 1) {
        targetPriority = 1;
      } else {
        targetPriority = Math.floor(requestedPriority);
      }

      // 3. Shift affected banners of this type downward
      for (let i = 0; i < activeBanners.length; i++) {
        const item = activeBanners[i];
        const newPriorityForExisting = i < targetPriority - 1 ? i + 1 : i + 2;

        if (item.priority !== newPriorityForExisting) {
          await tx.banner.update({
            where: { id: item.id },
            data: { priority: newPriorityForExisting },
          });
        }
      }

      // 4. Create the new banner with targetPriority
      banner.priority = targetPriority;
      const persistenceData = BannerMapper.toPersistence(banner);

      const created = await tx.banner.create({
        data: {
          ...persistenceData,
          priority: targetPriority,
        },
      });

      return BannerMapper.toDomain(created);
    });
  }

  async update(banner: Banner): Promise<Banner> {
    return this.updateWithPriority(banner, banner.priority);
  }

  async updateWithPriority(banner: Banner, newPriority?: number): Promise<Banner> {
    return this.prisma.$transaction(async (tx) => {
      const currentBanner = await tx.banner.findUnique({
        where: { id: banner.id },
      });

      if (!currentBanner || currentBanner.deletedAt !== null) {
        const updated = await tx.banner.update({
          where: { id: banner.id },
          data: BannerMapper.toPersistence(banner),
        });
        return BannerMapper.toDomain(updated);
      }

      const oldType = currentBanner.type;
      const newType = BannerMapper.toPersistence(banner).type;

      // If banner type changed, resequence old type and insert into new type
      if (oldType !== newType) {
        // 1. Resequence old type (close gap)
        const oldTypeBanners = await tx.banner.findMany({
          where: {
            type: oldType,
            deletedAt: null,
            id: { not: banner.id },
          },
          orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
        });

        for (let i = 0; i < oldTypeBanners.length; i++) {
          const item = oldTypeBanners[i];
          const correctPriority = i + 1;
          if (item.priority !== correctPriority) {
            await tx.banner.update({
              where: { id: item.id },
              data: { priority: correctPriority },
            });
          }
        }

        // 2. Insert into new type
        const newTypeBanners = await tx.banner.findMany({
          where: {
            type: newType,
            deletedAt: null,
            id: { not: banner.id },
          },
          orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
        });

        const totalNew = newTypeBanners.length;
        let targetPriority: number;
        if (newPriority === undefined || newPriority === null || isNaN(newPriority)) {
          targetPriority = totalNew + 1;
        } else if (newPriority > totalNew + 1) {
          targetPriority = totalNew + 1;
        } else if (newPriority < 1) {
          targetPriority = 1;
        } else {
          targetPriority = Math.floor(newPriority);
        }

        for (let i = 0; i < newTypeBanners.length; i++) {
          const item = newTypeBanners[i];
          const newPriorityForExisting = i < targetPriority - 1 ? i + 1 : i + 2;
          if (item.priority !== newPriorityForExisting) {
            await tx.banner.update({
              where: { id: item.id },
              data: { priority: newPriorityForExisting },
            });
          }
        }

        banner.priority = targetPriority;
        const updated = await tx.banner.update({
          where: { id: banner.id },
          data: {
            ...BannerMapper.toPersistence(banner),
            priority: targetPriority,
          },
        });

        return BannerMapper.toDomain(updated);
      }

      // Same type re-ordering
      const activeBanners = await tx.banner.findMany({
        where: {
          type: newType,
          deletedAt: null,
        },
        orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
      });

      const existingIndex = activeBanners.findIndex((b) => b.id === banner.id);
      if (existingIndex === -1) {
        const updated = await tx.banner.update({
          where: { id: banner.id },
          data: BannerMapper.toPersistence(banner),
        });
        return BannerMapper.toDomain(updated);
      }

      const currentPriority = activeBanners[existingIndex].priority;
      const total = activeBanners.length;

      let targetPriority = currentPriority;
      if (newPriority !== undefined && newPriority !== null && !isNaN(newPriority)) {
        if (newPriority > total) {
          targetPriority = total;
        } else if (newPriority < 1) {
          targetPriority = 1;
        } else {
          targetPriority = Math.floor(newPriority);
        }
      }

      // Resequence list in memory
      const reorderedList = [...activeBanners];
      const [removed] = reorderedList.splice(existingIndex, 1);
      reorderedList.splice(targetPriority - 1, 0, removed);

      for (let i = 0; i < reorderedList.length; i++) {
        const item = reorderedList[i];
        const correctPriority = i + 1;

        if (item.id === banner.id) {
          banner.priority = correctPriority;
          await tx.banner.update({
            where: { id: banner.id },
            data: {
              ...BannerMapper.toPersistence(banner),
              priority: correctPriority,
            },
          });
        } else if (item.priority !== correctPriority) {
          await tx.banner.update({
            where: { id: item.id },
            data: { priority: correctPriority },
          });
        }
      }

      const refreshed = await tx.banner.findUnique({
        where: { id: banner.id },
      });

      return refreshed ? BannerMapper.toDomain(refreshed) : banner;
    });
  }

  // =======================
  // 🔄 STATUS
  // =======================

  async activate(bannerId: string): Promise<void> {
    await this.prisma.banner.update({
      where: {
        id: bannerId,
      },

      data: {
        status: PrismaBannerStatus.ACTIVE,
      },
    });
  }

  async deactivate(bannerId: string): Promise<void> {
    await this.prisma.banner.update({
      where: {
        id: bannerId,
      },

      data: {
        status: PrismaBannerStatus.INACTIVE,
      },
    });
  }

  // =======================
  // ❌ DELETE
  // =======================

  async softDelete(bannerId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const banner = await tx.banner.findUnique({
        where: { id: bannerId },
      });

      if (!banner || banner.deletedAt !== null) {
        return;
      }

      await tx.banner.update({
        where: { id: bannerId },
        data: {
          deletedAt: new Date(),
          status: PrismaBannerStatus.INACTIVE,
        },
      });

      // Resequence remaining active banners of this type (1...N)
      const remainingBanners = await tx.banner.findMany({
        where: {
          type: banner.type,
          deletedAt: null,
        },
        orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
      });

      for (let i = 0; i < remainingBanners.length; i++) {
        const item = remainingBanners[i];
        const correctPriority = i + 1;
        if (item.priority !== correctPriority) {
          await tx.banner.update({
            where: { id: item.id },
            data: { priority: correctPriority },
          });
        }
      }
    });
  }

  async restore(bannerId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const banner = await tx.banner.findUnique({
        where: { id: bannerId },
      });

      if (!banner) {
        return;
      }

      const activeCount = await tx.banner.count({
        where: {
          type: banner.type,
          deletedAt: null,
        },
      });

      const targetPriority = activeCount + 1;

      await tx.banner.update({
        where: { id: bannerId },
        data: {
          deletedAt: null,
          status: PrismaBannerStatus.ACTIVE,
          priority: targetPriority,
        },
      });
    });
  }
}
