// src/modules/cart/application/use-cases/merge-cart.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { Cart } from '../../domain/entities/cart.entity';

import { CartStatus } from '../../domain/enums/cart-status.enum';

import { CartRepository } from '../../domain/repositories/cart.repository';

import { CartItemRepository } from '../../domain/repositories/cart-item.repository';

import { CartDomainService } from '../../domain/services/cart-domain.service';

import { CartMergeService } from '../services/cart-merge.service';

import { CartSummaryService } from '../services/cart-summary.service';

@Injectable()
export class MergeCartUseCase {
  constructor(
    @Inject(TOKENS.CART_REPO)
    private readonly cartRepo: CartRepository,

    @Inject(TOKENS.CART_ITEM_REPO)
    private readonly cartItemRepo: CartItemRepository,

    private readonly domainService: CartDomainService,

    private readonly mergeService: CartMergeService,

    private readonly summaryService: CartSummaryService,
  ) {}

  async execute(input: {
    userId: string;

    guestId: string;
  }) {
    // =======================
    // 👤 USER CART
    // =======================

    let userCart = await this.cartRepo.findActiveByUserId(input.userId);

    // =======================
    // 👥 GUEST CART
    // =======================

    const guestCart = await this.cartRepo.findActiveByGuestId(input.guestId);

    // =======================
    // 📭 NO GUEST CART
    // =======================

    if (!guestCart) {
      return null;
    }

    // =======================
    // 🛡 VALIDATE
    // =======================

    this.domainService.ensureCartUsable(guestCart);

    // =======================
    // 🆕 CREATE USER CART
    // =======================

    if (!userCart) {
      userCart = new Cart(
        crypto.randomUUID(),

        input.userId,

        undefined,

        CartStatus.ACTIVE,
      );

      userCart = await this.cartRepo.create(userCart);
    }

    // =======================
    // 📦 GET ITEMS
    // =======================

    const guestItems = await this.cartItemRepo.findByCartId(guestCart.id);

    const userItems = await this.cartItemRepo.findByCartId(userCart.id);

    // =======================
    // 🔄 MERGE ITEMS
    // =======================

    const mergedItems = this.mergeService.mergeItems({
      sourceItems: guestItems,

      targetItems: userItems,
    });

    // =======================
    // 💾 SAVE ITEMS
    // =======================

    for (const item of mergedItems) {
      const existing = await this.cartItemRepo.findByVariantId({
        cartId: userCart.id,

        variantId: item.variantId,
      });

      if (existing) {
        existing.setQuantity(item.quantity);

        await this.cartItemRepo.update(existing);
      } else {
        item.cartId = userCart.id;

        await this.cartItemRepo.create(item);
      }
    }

    // =======================
    // 🧹 CLEAR GUEST CART
    // =======================

    for (const item of guestItems) {
      await this.cartItemRepo.delete(item.id);
    }

    // =======================
    // 📦 FINAL ITEMS
    // =======================

    const finalItems = await this.cartItemRepo.findByCartId(userCart.id);

    // =======================
    // 💰 SUMMARY
    // =======================

    const summary = await this.summaryService.build({
      items: finalItems,
    });

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: userCart.id,

      status: userCart.status,

      totalItems: summary.totalProducts,

      totalQuantity: summary.totalQuantity,

      summary,

      createdAt: userCart.createdAt,

      updatedAt: new Date(),
    };
  }
}
