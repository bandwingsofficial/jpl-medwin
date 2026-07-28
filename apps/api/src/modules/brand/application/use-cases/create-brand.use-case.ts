import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { BrandRepository } from '../../domain/repositories/brand.repository';
import { BrandDomainService } from '../../domain/services/brand-domain.service';

import { Brand } from '../../domain/entities/brand.entity';
import { BrandNameVO } from '../../domain/value-objects/brand-name.vo';
import { BrandSlugVO } from '../../domain/value-objects/brand-slug.vo';
import { BrandSkuPrefixVO } from '../../domain/value-objects/brand-sku-prefix.vo';
import { BrandStatus } from '../../domain/enums/brand-status.enum';
import { BrandSkuPrefixExistsException } from '../../domain/exceptions/brand-sku-prefix-exists.exception';

@Injectable()
export class CreateBrandUseCase {
  constructor(
    @Inject(TOKENS.BRAND_REPO)
    private readonly brandRepo: BrandRepository,

    private readonly domainService: BrandDomainService,
  ) {}

  async execute(input: {
    name: string;
    skuPrefix: string;
    imageUrl?: string;
    description?: string;
    metaDescription?: string;
  }): Promise<Brand> {
    const nameVO = new BrandNameVO(input.name);
    const baseSlug = new BrandSlugVO(nameVO.getValue()).getValue();
    const skuPrefixVO = new BrandSkuPrefixVO(input.skuPrefix);

    await this.domainService.validateBrandSkuPrefix(skuPrefixVO.getValue());

    const existing = await this.brandRepo.findBySlugIncludingDeleted(baseSlug);

    if (existing) {
      if (!existing.isDeleted()) {
        throw new Error('Brand already exists');
      }

      existing.name = nameVO.getValue();
      existing.slug = baseSlug;
      existing.skuPrefix = skuPrefixVO.getValue();
      existing.imageUrl = input.imageUrl;
      existing.description = input.description;
      existing.metaDescription = input.metaDescription ?? input.description;
      existing.deletedAt = undefined;
      existing.status = BrandStatus.ACTIVE;

      try {
        return await this.brandRepo.update(existing);
      } catch (err: any) {
        if (err?.code === 'P2002') {
          throw new BrandSkuPrefixExistsException({
            skuPrefix: skuPrefixVO.getValue(),
          });
        }
        throw err;
      }
    }

    const brand = new Brand(
      crypto.randomUUID(),
      nameVO.getValue(),
      baseSlug,
      skuPrefixVO.getValue(),
      input.imageUrl,
      input.description,
      input.metaDescription ?? input.description,
    );

    try {
      return await this.brandRepo.create(brand);
    } catch (err: any) {
      if (err?.code === 'P2002') {
        throw new BrandSkuPrefixExistsException({
          skuPrefix: skuPrefixVO.getValue(),
        });
      }
      throw err;
    }
  }
}
