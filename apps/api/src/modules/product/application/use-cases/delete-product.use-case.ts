import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';

import { ProductRepository } from '../../domain/repositories/product.repository';

import { VariantRepository } from '../../domain/repositories/variant.repository';

import { ProductImageRepository } from '../../domain/repositories/product-image.repository';

import { ProductDomainService } from '../../domain/services/product-domain.service';

import { ProductNotFoundException } from '../../domain/exceptions/product-not-found.exception';
import { CartItemRepository } from '@/modules/cart/domain/repositories/cart-item.repository';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,

    @Inject(TOKENS.VARIANT_REPO)
    private readonly variantRepo: VariantRepository,

    @Inject(TOKENS.PRODUCT_IMAGE_REPO)
    private readonly imageRepo: ProductImageRepository,

    private readonly domainService: ProductDomainService,

    @Inject(TOKENS.CART_ITEM_REPO)
    private readonly cartItemRepo: CartItemRepository,
  ) {}

  async execute(productId: string, force = false, preview = false) {
    // =======================
    // 🔍 FIND PRODUCT
    // =======================

    const product = await this.productRepo.findById(productId, true);

    if (!product) {
      throw new ProductNotFoundException({
        productId,
      });
    }

    // =======================
    // ⚡ ALREADY DELETED
    // =======================

    if (product.isDeleted()) {
      return {
        success: true,

        message: 'Product already deleted',

        data: {
          id: product.id,

          deletedAt: product.deletedAt,
        },
      };
    }

    // =======================
    // 🔍 PREVIEW
    // =======================

    if (preview) {
      const info = await this.domainService.getProductUsageInfo(productId);

      return {
        success: true,

        message: info.hasUsage ? 'Preview: product is in use' : 'Preview: product is not used',

        data: info,
      };
    }

    // =======================
    // 🔍 FIND VARIANTS
    // =======================

    const variants = await this.variantRepo.findByProduct(productId, true);

    // =======================
    // 🔒 SAFE DELETE
    // =======================

    if (!force) {
      const info = await this.domainService.getProductUsageInfo(productId);

      if (info.hasUsage) {
        throw new BadRequestException('Product has dependencies. Use force=true to delete.');
      }

      const activeVariants = variants.filter((v) => !v.isDeleted());

      if (activeVariants.length) {
        throw new BadRequestException(
          `Product has ${activeVariants.length} active variants. Pass force=true to delete all variants.`,
        );
      }
    }

    // =======================
    // 💾 TRANSACTION
    // =======================

    return this.prisma.$transaction(async (tx) => {
      // =======================
      // 🛒 REMOVE CART ITEMS
      // =======================

      await this.cartItemRepo.deleteByProductId(product.id);

      // =======================
      // 🔴 DEACTIVATE PRODUCT
      // =======================

      product.deactivate();

      // remove default variant
      product.defaultVariantId = undefined;

      // =======================
      // 🗑 SOFT DELETE PRODUCT
      // =======================

      product.softDelete();

      await this.productRepo.update(product, tx);

      // =======================
      // 🔴 CHILD VARIANTS
      // =======================

      for (const variant of variants) {
        if (!variant.isDeleted()) {
          variant.deactivate();

          variant.softDelete();

          await this.variantRepo.update(variant, tx);
        }
      }

      // =======================
      // 🖼 SOFT DELETE IMAGES
      // =======================

      await this.imageRepo.softDeleteByProduct(productId, tx);

      await this.imageRepo.softDeleteByVariantProduct(productId, tx);

      // =======================
      // ✅ RESPONSE
      // =======================

      return {
        success: true,

        message: force ? 'Product force deleted successfully' : 'Product deleted successfully',

        data: {
          id: product.id,

          status: product.status,

          deletedAt: product.deletedAt,
        },
      };
    });
  }
}
