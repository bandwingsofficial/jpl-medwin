import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';

import { VariantRepository } from '../../domain/repositories/variant.repository';

import { ProductImageRepository } from '../../domain/repositories/product-image.repository';

import { ProductDomainService } from '../../domain/services/product-domain.service';
import { CartItemRepository } from '@/modules/cart/domain/repositories/cart-item.repository';

@Injectable()
export class DeleteVariantUseCase {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(TOKENS.VARIANT_REPO)
    private readonly variantRepo: VariantRepository,

    @Inject(TOKENS.PRODUCT_IMAGE_REPO)
    private readonly imageRepo: ProductImageRepository,

    private readonly domainService: ProductDomainService,

    @Inject(TOKENS.CART_ITEM_REPO)
    private readonly cartItemRepo: CartItemRepository,
  ) {}

  async execute(variantId: string, force = false, preview = false) {
    // =======================
    // 🔍 FIND VARIANT
    // =======================

    const variant = await this.variantRepo.findById(variantId, true);

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    // =======================
    // ⚡ ALREADY DELETED
    // =======================

    if (variant.isDeleted()) {
      return {
        success: true,
        message: 'Variant already deleted',

        data: {
          id: variant.id,
          deletedAt: variant.deletedAt,
        },
      };
    }

    // =======================
    // 🔍 PREVIEW
    // =======================

    if (preview) {
      const info = await this.domainService.getVariantUsageInfo(variantId);

      return {
        success: true,

        message: info.hasUsage ? 'Preview: variant is in use' : 'Preview: variant is not used',

        data: info,
      };
    }

    // =======================
    // 💾 TRANSACTION
    // =======================

    return this.prisma.$transaction(async (tx) => {


  // =======================
  // 🛒 REMOVE CART ITEMS
  // =======================

  await this.cartItemRepo.deleteByVariantId(variant.id);

      // =======================
      // 🔒 SAFE DELETE
      // =======================

      if (!force) {
        const info = await this.domainService.getVariantUsageInfo(variantId);

        if (info.hasUsage) {
          throw new BadRequestException('Variant has dependencies. Use force=true to delete.');
        }
      }

      // =======================
      // 🔴 DEACTIVATE
      // =======================

      variant.deactivate();

      // =======================
      // 🗑 SOFT DELETE
      // =======================

      variant.softDelete();

      // =======================
      // 🖼 SOFT DELETE IMAGES
      // =======================

      await this.imageRepo.softDeleteByVariant(variantId, tx);

      // =======================
      // 💾 SAVE VARIANT
      // =======================

      await this.variantRepo.update(variant, tx);

      // =======================
      // ✅ RESPONSE
      // =======================

      return {
        success: true,

        message: force ? 'Variant force deleted successfully' : 'Variant deleted successfully',

        data: {
          id: variant.id,

          productId: variant.productId,

          status: variant.status,

          deletedAt: variant.deletedAt,
        },
      };
    });
  }
}
