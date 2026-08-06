import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProductRepository } from '../../domain/repositories/product.repository';
import { VariantRepository } from '../../domain/repositories/variant.repository';

import { SlugVO } from '@/modules/category/domain/value-objects/slug.vo';

@Injectable()
export class ProductSlugService {
  constructor(
    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,

    @Inject(TOKENS.VARIANT_REPO)
    private readonly variantRepo: VariantRepository,
  ) {}

  getBaseSlug(source: string): string {
    if (!source?.trim()) {
      throw new Error('Slug generation failed: name/slug missing');
    }

    return new SlugVO(source).getValue();
  }

  async generateProductSlug(source: string): Promise<string> {
    const base = this.getBaseSlug(source);

    let slug = base;
    let counter = 1;

    while (await this.productRepo.existsBySlug(slug)) {
      slug = `${base}-${counter++}`;
    }

    return slug;
  }

  async generateVariantSlug(source: string): Promise<string> {
    if (!source) {
      throw new Error('Variant slug generation failed');
    }

    const base = new SlugVO(source).getValue();

    let slug = base;
    let counter = 1;

    while (await this.variantRepo.existsBySlug(slug)) {
      slug = `${base}-${counter++}`;
    }

    return slug;
  }

  async generateUpdatedProductSlug(
    source: string,
    currentProductId: string,
    tx?: any,
  ): Promise<string> {
    if (!source) {
      throw new Error('Slug generation failed');
    }

    const base = new SlugVO(source).getValue();

    let slug = base;
    let counter = 1;

    while (true) {
      const existing = await this.productRepo.findBySlug(slug, true, tx);

      if (!existing || existing.id === currentProductId) {
        return slug;
      }

      slug = `${base}-${counter++}`;
    }
  }
}
