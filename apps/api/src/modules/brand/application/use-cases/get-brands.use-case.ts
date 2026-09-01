import { Injectable, Inject } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { BrandRepository } from '../../domain/repositories/brand.repository';
import { Brand } from '../../domain/entities/brand.entity';

import { BrandS3ImageResolverService } from '../services/brand-s3-image-resolver.service';

@Injectable()
export class GetBrandsUseCase {
  constructor(
    @Inject(TOKENS.BRAND_REPO)
    private readonly brandRepo: BrandRepository,

    private readonly brandS3ImageResolverService: BrandS3ImageResolverService,
  ) {}

  async execute(): Promise<Brand[]> {
    const brands = await this.brandRepo.findAll();

    for (const brand of brands) {
      // If image already exists in DB, keep it.
      if (brand.imageUrl) {
        continue;
      }

      // Otherwise try S3 fallback.
     const image = await this.brandS3ImageResolverService.resolveImage(brand.slug);

if (image) {
  brand.imageUrl = image;
}
    }

    // Defensive filter
    return brands.filter((b) => !b.isDeleted?.());
  }
}