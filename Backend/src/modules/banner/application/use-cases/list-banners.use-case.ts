import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { BannerRepository } from '../../domain/repositories/banner.repository';

import { BannerStatus } from '../../domain/enums/banner-status.enum';
import { BannerType } from '../../domain/enums/banner-type.enum';

@Injectable()
export class ListBannersUseCase {
  constructor(
    @Inject(TOKENS.BANNER_REPO)
    private readonly bannerRepo: BannerRepository,
  ) {}

  async execute(filters?: {
    type?: BannerType;

    status?: BannerStatus;
  }) {
    // =======================
    // 🔍 FILTER BY TYPE
    // =======================

    if (filters?.type) {
      const banners =
        await this.bannerRepo.findByType(
          filters.type,
        );

      return banners.map((banner) => ({
        id: banner.id,

        name: banner.name,

        type: banner.type,

        status: banner.status,

        createdAt: banner.createdAt,

        updatedAt: banner.updatedAt,
      }));
    }

    // =======================
    // 🔍 FILTER BY STATUS
    // =======================

    if (filters?.status) {
      const banners =
        await this.bannerRepo.findByStatus(
          filters.status,
        );

      return banners.map((banner) => ({
        id: banner.id,

        name: banner.name,

        type: banner.type,

        status: banner.status,

        createdAt: banner.createdAt,

        updatedAt: banner.updatedAt,
      }));
    }

    // =======================
    // 🔍 ALL
    // =======================

    const banners =
      await this.bannerRepo.findAll();

    return banners.map((banner) => ({
      id: banner.id,

      name: banner.name,

      type: banner.type,

      status: banner.status,

      createdAt: banner.createdAt,

      updatedAt: banner.updatedAt,
    }));
  }
}