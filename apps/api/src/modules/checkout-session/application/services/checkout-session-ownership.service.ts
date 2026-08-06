// src/modules/checkout-session/application/services/checkout-session-ownership.service.ts

import { Injectable } from '@nestjs/common';

import { CheckoutSession } from '../../domain/entities/checkout-session.entity';

@Injectable()
export class CheckoutSessionOwnershipService {
  // =======================
  // 👤 USER OWNERSHIP
  // =======================

  belongsToUser(params: {
    session: CheckoutSession;

    userId: string;
  }): boolean {
    return params.session.userId === params.userId;
  }

  // =======================
  // 👥 GUEST OWNERSHIP
  // =======================

  belongsToGuest(params: {
    session: CheckoutSession;

    guestId: string;
  }): boolean {
    return params.session.guestId === params.guestId;
  }

  // =======================
  // 🔐 ACCESS CHECK
  // =======================

  canAccess(params: {
    session: CheckoutSession;

    userId?: string;

    guestId?: string;
  }): boolean {
    // user
    if (params.userId && params.session.userId === params.userId) {
      return true;
    }

    // guest
    if (params.guestId && params.session.guestId === params.guestId) {
      return true;
    }

    return false;
  }
}
