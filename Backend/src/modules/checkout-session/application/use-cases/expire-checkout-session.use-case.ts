// src/modules/checkout-session/application/use-cases/expire-checkout-session.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CheckoutSessionRepository } from '../../domain/repositories/checkout-session.repository';

import { CheckoutSessionNotFoundException } from '../../domain/exceptions/checkout-session-not-found.exception';

import { CheckoutSessionDomainService } from '../../domain/services/checkout-session-domain.service';

import { CartRepository } from '@/modules/cart/domain/repositories/cart.repository';

@Injectable()
export class ExpireCheckoutSessionUseCase {
  constructor(
    @Inject(TOKENS.CHECKOUT_SESSION_REPO)
    private readonly checkoutSessionRepo: CheckoutSessionRepository,

    @Inject(TOKENS.CART_REPO)
    private readonly cartRepo: CartRepository,

    private readonly domainService: CheckoutSessionDomainService,
  ) {}

  async execute(input: { checkoutSessionId: string }) {
    // =======================
    // 🔍 FIND SESSION
    // =======================

    const session = await this.checkoutSessionRepo.findById(input.checkoutSessionId);

    // =======================
    // ❌ NOT FOUND
    // =======================

    if (!session) {
      throw new CheckoutSessionNotFoundException({
        checkoutSessionId: input.checkoutSessionId,
      });
    }

    // =======================
    // 🛡 VALIDATE SESSION
    // =======================

    this.domainService.ensureSessionUsable(session);

    // =======================
    // ⏳ EXPIRE SESSION
    // =======================

    session.expire();

    // =======================
// 🪙 CLEAR REWARD SNAPSHOT
// =======================

session.removeRewards();

    // =======================
    // 💾 SAVE SESSION
    // =======================

    await this.checkoutSessionRepo.update(session);

    // =======================
    // 🔓 UNLOCK CART
    // =======================

    const cart = await this.cartRepo.findById(session.cartId);

    if (cart && cart.isLocked()) {
      cart.unlock();

      await this.cartRepo.update(cart);
    }

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: session.id,

      status: session.status,

      expiredAt: new Date(),

      cartUnlocked: !!cart && !cart.isLocked(),
    };
  }
}
