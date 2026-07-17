// src/modules/checkout-session/domain/repositories/checkout-session.repository.ts

import { CheckoutSession } from '../entities/checkout-session.entity';

import { CheckoutSessionStatus } from '../enums/checkout-session-status.enum';

export interface CheckoutSessionRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(id: string): Promise<CheckoutSession | null>;

  findActiveByCartId(cartId: string): Promise<CheckoutSession | null>;

  findByCartId(cartId: string): Promise<CheckoutSession[]>;

  findByUserId(userId: string): Promise<CheckoutSession[]>;

  findByGuestId(guestId: string): Promise<CheckoutSession[]>;

  findExpiredSessions(): Promise<CheckoutSession[]>;

  // =======================
  // 🧠 CHECKS
  // =======================

  existsActiveSessionByCartId(cartId: string): Promise<boolean>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(session: CheckoutSession): Promise<CheckoutSession>;

  update(session: CheckoutSession): Promise<CheckoutSession>;

  // =======================
  // 🔄 STATUS
  // =======================

  updateStatus(params: {
    checkoutSessionId: string;

    status: CheckoutSessionStatus;
  }): Promise<void>;

  complete(checkoutSessionId: string): Promise<void>;

  fail(checkoutSessionId: string): Promise<void>;

  expire(checkoutSessionId: string): Promise<void>;

  // =======================
  // ❌ DELETE
  // =======================

  softDelete(checkoutSessionId: string): Promise<void>;

  restore(checkoutSessionId: string): Promise<void>;
}
