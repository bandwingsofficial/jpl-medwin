import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { BrandRepository } from '../../domain/repositories/brand.repository';
import { BrandDomainService } from '../../domain/services/brand-domain.service';

import { BrandNotFoundException } from '../../domain/exceptions/brand-not-found.exception';

import { BrandNameVO } from '../../domain/value-objects/brand-name.vo';
import { BrandSlugVO } from '../../domain/value-objects/brand-slug.vo';
import { BrandSlugExistsException } from '../../domain/exceptions/brand-slug-exists.exception';

@Injectable()
export class UpdateBrandUseCase {
  constructor(
    @Inject(TOKENS.BRAND_REPO)
    private readonly brandRepo: BrandRepository,

    private readonly domainService: BrandDomainService,
  ) {}

  async execute(input: {
    id: string;
    name?: string;
    imageUrl?: string;
    description?: string;
    metaDescription?: string;
  }) {
    const brand = await this.brandRepo.findById(input.id);

    if (!brand) {
      throw new BrandNotFoundException({ brandId: input.id });
    }

    if (input.name) {
      const nameVO = new BrandNameVO(input.name);
      const newSlug = new BrandSlugVO(nameVO.getValue()).getValue();

      if (newSlug !== brand.slug) {
        await this.domainService.validateBrandSlugForUpdate(newSlug, brand.id);
      }

      brand.name = nameVO.getValue();
      brand.slug = newSlug;
    }

    if (input.imageUrl !== undefined) brand.imageUrl = input.imageUrl;
    if (input.description !== undefined) {
      brand.description = input.description;
    }
    if (input.metaDescription !== undefined) {
      brand.metaDescription = input.metaDescription;
    }

    try {
      return await this.brandRepo.update(brand);
    } catch (err: any) {
      if (err?.code === 'P2002') {
        throw new BrandSlugExistsException({
          slug: input.name ?? 'unknown',
        });
      }
      throw err;
    }
  }
}
