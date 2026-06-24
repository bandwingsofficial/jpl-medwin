import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { VariantRepository } from '../../domain/repositories/variant.repository';

import { ProductRepository } from '../../domain/repositories/product.repository';

import { ProductStatus } from '../../domain/enums/product-status.enum';

@Injectable()
export class RestoreVariantUseCase {
  constructor(
    @Inject(TOKENS.VARIANT_REPO)
    private readonly variantRepo: VariantRepository,

    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(id: string) {
    // =======================
    // 🔍 FIND VARIANT
    // =======================

    const variant = await this.variantRepo.findById(id, true);

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    // =======================
    // ✅ ALREADY ACTIVE
    // =======================

    if (!variant.isDeleted()) {
      return {
        success: true,
        message: 'Variant already restored',

        data: {
          id: variant.id,
          status: variant.status,
          deletedAt: variant.deletedAt,
        },
      };
    }

    // =======================
    // 🔍 PRODUCT CHECK
    // =======================

    const product = await this.productRepo.findById(variant.productId);

    if (!product || product.isDeleted?.()) {
      throw new BadRequestException('Cannot restore: parent product not found');
    }

    if (product.status === ProductStatus.INACTIVE) {
      throw new BadRequestException('Cannot restore variant when product is inactive');
    }

    // =======================
    // 🔒 SKU CHECK
    // =======================

    const skuExists = await this.variantRepo.findBySku(variant.sku);

    if (skuExists && skuExists.id !== variant.id) {
      throw new ConflictException(`Cannot restore: SKU already used (${variant.sku})`);
    }

    // =======================
    // 🔒 SLUG CHECK
    // =======================

    const slugExists = await this.variantRepo.findBySlug(variant.slug);

    if (slugExists && slugExists.id !== variant.id) {
      throw new ConflictException(`Cannot restore: Slug already used (${variant.slug})`);
    }

    // =======================
    // ♻️ RESTORE
    // =======================

    variant.restore();

    try {
      const updated = await this.variantRepo.update(variant);

      return {
        success: true,
        message: 'Variant restored successfully',

        data: {
          id: updated.id,
          productId: updated.productId,

          status: updated.status,

          deletedAt: updated.deletedAt,
        },
      };
    } catch {
      throw new ConflictException('Restore failed due to duplicate SKU or slug');
    }
  }
}
