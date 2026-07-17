import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { BrandRepository } from '../../domain/repositories/brand.repository';
import { BrandDomainService } from '../../domain/services/brand-domain.service';

import { BrandNotFoundException } from '../../domain/exceptions/brand-not-found.exception';

@Injectable()
export class DeleteBrandUseCase {
  constructor(
    @Inject(TOKENS.BRAND_REPO)
    private readonly brandRepo: BrandRepository,

    private readonly domainService: BrandDomainService,
  ) {}

  async execute(brandId: string, force = false, preview = false) {
    const brand = await this.brandRepo.findById(brandId);

    if (!brand || brand.isDeleted?.()) {
      throw new BrandNotFoundException({ brandId });
    }

    // =======================
    // 🔍 PREVIEW
    // =======================
    if (preview) {
      const info = await this.domainService.getBrandUsageInfo(brandId);

      return {
        message: info.hasUsage ? 'Preview: brand is in use' : 'Preview: brand is not used',
        ...info,
      };
    }

    // =======================
    // 🔒 NORMAL DELETE
    // =======================
    if (!force) {
      await this.domainService.validateBrandDeletion(brandId);
    }

    // =======================
    // 🗑 DELETE (soft)
    // =======================
    await this.brandRepo.delete(brandId);

    return {
      message: force ? 'Brand deleted (forced)' : 'Brand deleted successfully',
    };
  }
}
