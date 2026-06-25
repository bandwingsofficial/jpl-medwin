import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { BannerRepository } from '../../domain/repositories/banner.repository';

import { BannerNotFoundException } from '../../domain/exceptions/banner-not-found.exception';
import { BannerAlreadyExistsException } from '../../domain/exceptions/banner-already-exists.exception';

import { BannerType } from '../../domain/enums/banner-type.enum';

@Injectable()
export class UpdateBannerUseCase {
  constructor(
    @Inject(TOKENS.BANNER_REPO)
    private readonly bannerRepo: BannerRepository,
  ) {}

  async execute(input: {
    bannerId: string;

    name?: string;

    type?: BannerType;
  }) {
    // =======================
    // 🔍 FIND
    // =======================

    const banner = await this.bannerRepo.findById(input.bannerId);

    if (!banner) {
      throw new BannerNotFoundException({
        bannerId: input.bannerId,
      });
    }

    // =======================
    // 🚫 DUPLICATE NAME
    // =======================

    if (input.name !== undefined) {
      const existing = await this.bannerRepo.findByNameIncludingDeleted(input.name);

      if (existing && existing.id !== banner.id && !existing.isDeleted()) {
        throw new BannerAlreadyExistsException({
          name: input.name,
        });
      }

      banner.name = input.name;
    }

    // =======================
    // ✏️ UPDATE TYPE
    // =======================

    if (input.type !== undefined) {
      banner.type = input.type;
    }

    // =======================
    // 💾 SAVE
    // =======================

    const updated = await this.bannerRepo.update(banner);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: updated.id,

      name: updated.name,

      type: updated.type,

      status: updated.status,

      createdAt: updated.createdAt,

      updatedAt: updated.updatedAt,
    };
  }
}
