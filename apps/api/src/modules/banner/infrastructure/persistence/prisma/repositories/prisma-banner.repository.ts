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

      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map((item) => BannerMapper.toDomain(item));
  }

  async findByType(type: BannerType): Promise<Banner[]> {
    const data = await this.prisma.banner.findMany({
      where: {
        type: type as unknown as PrismaBannerType,

        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map((item) => BannerMapper.toDomain(item));
  }

  async findByStatus(status: BannerStatus): Promise<Banner[]> {
    const data = await this.prisma.banner.findMany({
      where: {
        status: status as unknown as PrismaBannerStatus,

        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
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
  // 🧠 CHECKS
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

  // =======================
  // ✍️ WRITE
  // =======================

  async create(banner: Banner): Promise<Banner> {
    const data = await this.prisma.banner.create({
      data: BannerMapper.toPersistence(banner),
    });

    return BannerMapper.toDomain(data);
  }

  async update(banner: Banner): Promise<Banner> {
    const data = await this.prisma.banner.update({
      where: {
        id: banner.id,
      },

      data: BannerMapper.toPersistence(banner),
    });

    return BannerMapper.toDomain(data);
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
    await this.prisma.banner.update({
      where: {
        id: bannerId,
      },

      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(bannerId: string): Promise<void> {
    await this.prisma.banner.update({
      where: {
        id: bannerId,
      },

      data: {
        deletedAt: null,
      },
    });
  }
}
