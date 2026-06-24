// src/modules/order/application/services/order-ownership.service.ts

import { Injectable } from '@nestjs/common';

import { Order } from '../../domain/entities/order.entity';

@Injectable()
export class OrderOwnershipService {
  // =======================
  // 🔐 ACCESS
  // =======================

  canAccess(params: {
    order: Order;

    userId: string;
  }): boolean {
    const { order, userId } = params;

    return order.userId === userId;
  }

  // =======================
  // 👤 USER
  // =======================

  belongsToUser(params: {
    order: Order;

    userId: string;
  }): boolean {
    return params.order.userId === params.userId;
  }

  // =======================
  // 🔒 ASSERT OWNER
  // =======================

  assertOwnership(params: {
    order: Order;

    userId: string;
  }) {
    const belongs = this.belongsToUser(params);

    if (!belongs) {
      return false;
    }

    return true;
  }
}
