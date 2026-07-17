import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { BrandRepository } from '../repositories/brand.repository';
import { Brand } from '../entities/brand.entity';

import { BrandSlugExistsException } from '../exceptions/brand-slug-exists.exception';

@Injectable()
export class BrandDomainService {
  constructor(
    @Inject(TOKENS.BRAND_REPO)
    private readonly brandRepo: BrandRepository,
  ) {}

  // =======================
  // 🔒 SLUG VALIDATION (OPTIONAL)
  // =======================
  /**
   * ⚠️ NOTE:
   * Slug uniqueness should ideally be handled by:
   * 1. UseCase (slug generation + retry)
   * 2. DB unique constraint
   *
   * Keep this only if you want strict validation.
   */

  async validateBrandSlug(slug: string): Promise<void> {
    const exists = await this.brandRepo.existsBySlug(slug);

    if (exists) {
      throw new BrandSlugExistsException({ slug });
    }
  }

  // =======================
  // 🗑 DELETE VALIDATION
  // =======================
  /**
   * For now, Brand is independent.
   * Later → you may check Product relation here.
   */

  async validateBrandDeletion(_brandId: string): Promise<void> {
    // 🔥 Future:
    // const count = await productRepo.countByBrandId(brandId);
    // if (count > 0) throw new BrandHasProductsException(...)
  }

  // =======================
  // 🔍 PREVIEW SUPPORT
  // =======================

  async getBrandUsageInfo(_brandId: string) {
    return {
      usageCount: 0,
      hasUsage: false,
    };

    // 🔥 Future:
    // const count = await productRepo.countByBrandId(brandId);
    // return { usageCount: count, hasUsage: count > 0 };
  }

  // =======================
  // 🛡 STATUS VALIDATION
  // =======================

  validateBrandActive(brand: Brand): void {
    if (!brand) return; // safety
    brand.ensureActive();
  }
  // =======================
  // BRAND SLUG VALIDATION FOR UPDATE
  // =======================
  async validateBrandSlugForUpdate(slug: string, currentBrandId: string): Promise<void> {
    const existing = await this.brandRepo.findBySlug(slug);

    if (existing && existing.id !== currentBrandId) {
      throw new BrandSlugExistsException({ slug });
    }
  }
}
