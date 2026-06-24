import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';

import { ProductRepository } from '../../domain/repositories/product.repository';
import { VariantRepository } from '../../domain/repositories/variant.repository';

import { ProductNotFoundException } from '../../domain/exceptions/product-not-found.exception';

import { ProductStatus } from '../../domain/enums/product-status.enum';
import { CartItemRepository } from '@/modules/cart/domain/repositories/cart-item.repository';

@Injectable()
export class UpdateProductStatusUseCase {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,

    @Inject(TOKENS.VARIANT_REPO)
    private readonly variantRepo: VariantRepository,

      @Inject(TOKENS.CART_ITEM_REPO)
    private readonly cartItemRepo: CartItemRepository, // Assuming there's a CartItemRepository for handling cart items
  ) {}

  async execute(input: { id: string; status: ProductStatus; force?: boolean }) {
    // =======================
    // 🔍 FIND PRODUCT
    // =======================

    const product = await this.productRepo.findById(input.id, true);

    if (!product || product.isDeleted?.()) {
      throw new ProductNotFoundException({
        productId: input.id,
      });
    }

    // =======================
    // ⚡ NO CHANGE
    // =======================

    if (product.status === input.status) {
      return {
        data: {
          id: product.id,
          status: product.status,
        },
      };
    }

    // =======================
    // 🔍 FETCH VARIANTS
    // =======================

    const variants = await this.variantRepo.findByProduct(product.id, true);

    // =======================
    // 🚫 ACTIVE VARIANT CHECK
    // =======================

    if (input.status === ProductStatus.INACTIVE && !input.force) {
      const activeVariants = variants.filter(
        (v) => !v.isDeleted() && v.status === ProductStatus.ACTIVE,
      );

      if (activeVariants.length) {
        throw new BadRequestException(
          `Product has ${activeVariants.length} active variants. Pass force=true to deactivate all variants.`,
        );
      }
    }

    // =======================
    // 💾 TRANSACTION
    // =======================

   return this.prisma.$transaction(async (tx) => {
  // =======================
  // 🔴 DEACTIVATE
  // =======================

  if (input.status === ProductStatus.INACTIVE) {
    // =======================
    // 🛒 REMOVE CART ITEMS
    // =======================

    await this.cartItemRepo.deleteByProductId(product.id);

    // deactivate product
    product.deactivate();

    // remove default variant
    product.defaultVariantId = undefined;

    await this.productRepo.update(product, tx);

    // deactivate all child variants
    for (const v of variants) {
      if (!v.isDeleted()) {
        v.deactivate();
      }
    }

    await this.variantRepo.updateMany(variants, tx);
  }

  // =======================
  // 🟢 ACTIVATE
  // =======================
  else {
    // activate product
    product.activate();

    // activate variants
    for (const v of variants) {
      // don't restore deleted
      if (!v.isDeleted()) {
        v.activate();
      }
    }

    // set first active variant as default
    const firstActive = variants.find(
      (v) => !v.isDeleted() && v.status === ProductStatus.ACTIVE,
    );

    product.defaultVariantId = firstActive?.id;

    await this.productRepo.update(product, tx);

    await this.variantRepo.updateMany(variants, tx);
  }

  // =======================
  // ✅ FINAL RESPONSE
  // =======================

  return {
    success: true,

    message:
      input.status === ProductStatus.ACTIVE
        ? 'Product activated successfully'
        : 'Product deactivated successfully',

    data: {
      id: product.id,

      status: product.status,

      defaultVariantId: product.defaultVariantId ?? null,

      updatedAt: product.updatedAt,
    },
  };
});
  }
}
