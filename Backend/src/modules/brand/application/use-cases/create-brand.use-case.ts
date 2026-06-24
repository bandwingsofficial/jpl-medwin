import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { BrandRepository } from '../../domain/repositories/brand.repository';
import { BrandDomainService } from '../../domain/services/brand-domain.service';

import { Brand } from '../../domain/entities/brand.entity';
import { BrandNameVO } from '../../domain/value-objects/brand-name.vo';
import { BrandSlugVO } from '../../domain/value-objects/brand-slug.vo';
import { BrandStatus } from '../../domain/enums/brand-status.enum';

@Injectable()
export class CreateBrandUseCase {
  constructor(
    @Inject(TOKENS.BRAND_REPO)
    private readonly brandRepo: BrandRepository,

    private readonly domainService: BrandDomainService,
  ) {}

  async execute(input: {
    name: string;
    imageUrl?: string;
    description?: string;
    metaDescription?: string;
  }): Promise<Brand> {
    // =======================
    // 🔹 1. VALUE OBJECTS
    // =======================
    const nameVO = new BrandNameVO(input.name);
    const baseSlug = new BrandSlugVO(nameVO.getValue()).getValue();

    // =======================
    // 🔥 2. CHECK EXISTING (INCLUDING DELETED)
    // =======================
    const existing = await this.brandRepo.findBySlugIncludingDeleted(baseSlug);

    if (existing) {
      // ❌ if already ACTIVE → block
      if (!existing.isDeleted()) {
        throw new Error('Brand already exists');
      }

      // ♻️ RESTORE + REPLACE DATA
      existing.name = nameVO.getValue();
      existing.slug = baseSlug;

      existing.imageUrl = input.imageUrl;
      existing.description = input.description;
      existing.metaDescription = input.metaDescription ?? input.description;

      existing.deletedAt = undefined;
      existing.status = BrandStatus.ACTIVE;

      return this.brandRepo.update(existing);
    }

    // =======================
    // 🆕 3. CREATE NEW
    // =======================
    const brand = new Brand(
      crypto.randomUUID(),
      nameVO.getValue(),
      baseSlug,
      input.imageUrl,
      input.description,
      input.metaDescription ?? input.description,
    );

    return this.brandRepo.create(brand);
  }
}
