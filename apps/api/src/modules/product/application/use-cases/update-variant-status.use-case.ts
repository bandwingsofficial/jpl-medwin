import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { VariantRepository } from '../../domain/repositories/variant.repository';
import { ProductRepository } from '../../domain/repositories/product.repository';

import { ProductStatus } from '../../domain/enums/product-status.enum';
import { CartItemRepository } from '@/modules/cart/domain/repositories/cart-item.repository';

@Injectable()
export class UpdateVariantStatusUseCase {
  constructor(
    @Inject(TOKENS.VARIANT_REPO)
    private readonly variantRepo: VariantRepository,

    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,

    @Inject(TOKENS.CART_ITEM_REPO)
    private readonly cartItemRepo: CartItemRepository, // Assuming there's a CartItemRepository for handling cart items
  ) {}

  async execute(input: { productId: string; id: string; status: ProductStatus }) {
    // =======================
    // 🔍 FIND VARIANT
    // =======================

    const variant = await this.variantRepo.findById(input.id, true);

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    // =======================
    // 🔒 OWNERSHIP CHECK
    // =======================

    if (variant.productId !== input.productId) {
      throw new BadRequestException('Variant does not belong to product');
    }

    // =======================
    // 🔍 FIND PRODUCT
    // =======================

    const product = await this.productRepo.findById(input.productId, true);

    if (!product || product.isDeleted?.()) {
      throw new NotFoundException('Parent product not found');
    }

    // =======================
    // ⚡ NO CHANGE
    // =======================

    if (variant.status === input.status && !variant.isDeleted()) {
      return {
        success: true,
        message: 'Variant already in requested status',

        data: {
          id: variant.id,
          productId: variant.productId,

          status: variant.status,

          deletedAt: variant.deletedAt,

          defaultVariantId: product.defaultVariantId,
        },
      };
    }

    // =======================
    // 🚫 BUSINESS RULE
    // =======================

    if (product.status === ProductStatus.INACTIVE && input.status === ProductStatus.ACTIVE) {
      throw new BadRequestException('Cannot activate variant when product is inactive');
    }

    // =======================
    // 🔄 DEACTIVATE
    // =======================

    if (input.status === ProductStatus.INACTIVE) {
      variant.deactivate();

      // =======================
      // 🛒 REMOVE CART ITEMS
      // =======================

      await this.cartItemRepo.deleteByVariantId(variant.id);

      // 🔥 DEFAULT VARIANT CHECK
      if (product.defaultVariantId === variant.id) {
        const variants = await this.variantRepo.findByProduct(product.id, true);

        const nextDefault = variants.find(
          (v) => v.id !== variant.id && v.status === ProductStatus.ACTIVE && !v.isDeleted(),
        );

        product.defaultVariantId = nextDefault?.id;

        await this.productRepo.update(product);
      }
    }

    // =======================
    // 🔄 ACTIVATE
    // =======================
    else {
      // restore if deleted
      if (variant.isDeleted()) {
        variant.restore();
      }

      variant.activate();

      // 🔥 SET DEFAULT IF EMPTY
      if (!product.defaultVariantId) {
        product.defaultVariantId = variant.id;

        await this.productRepo.update(product);
      }
    }

    // =======================
    // 💾 SAVE VARIANT
    // =======================

    const updated = await this.variantRepo.update(variant);

    // =======================
    // ✅ RESPONSE
    // =======================

    return {
      success: true,

      message:
        input.status === ProductStatus.ACTIVE
          ? 'Variant activated successfully'
          : 'Variant deactivated successfully',

      data: {
        id: updated.id,

        productId: updated.productId,

        status: updated.status,

        deletedAt: updated.deletedAt,

        defaultVariantId: product.defaultVariantId,
      },
    };
  }
}
