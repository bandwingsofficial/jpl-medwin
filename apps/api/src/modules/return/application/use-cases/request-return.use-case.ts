import { Inject, Injectable } from '@nestjs/common';

import * as crypto from 'crypto';

import { TOKENS } from '@/common/constants/tokens';

import { Return } from '../../domain/entities/return.entity';

import { ReturnRepository } from '../../domain/repositories/return.repository';

import { ReturnDomainService } from '../../domain/services/return-domain.service';

import { OrderRepository } from '@/modules/order/domain/repositories/order.repository';
import { OrderResponseBuilderService } from '@/modules/order/application/services/order-response-builder.service';
import { OrderNotFoundException } from '@/modules/order/domain/exceptions/order-not-found.exception';

import { InvalidOrderOperationException } from '@/modules/order/domain/exceptions/invalid-order-operation.exception';

import { ReturnAlreadyRequestedException } from '../../domain/exceptions/return-already-requested.exception';

import { ReturnReason } from '../../domain/enums/return-reason.enum';

import { ReturnType } from '../../domain/enums/return-type.enum';

import { OrderStatus } from '@/modules/order/domain/enums/order-status.enum';

@Injectable()
export class RequestReturnUseCase {
  constructor(
    @Inject(TOKENS.RETURN_REPO)
    private readonly returnRepo: ReturnRepository,

    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,

    private readonly domainService: ReturnDomainService,

    private readonly orderResponseBuilder: OrderResponseBuilderService,
  ) {}

  async execute(input: {
    orderId: string;

    userId: string;

    type: ReturnType;

    reason: ReturnReason;

    description?: string;
  }) {
    // =======================
    // 🔍 FIND ORDER
    // =======================

    const order = await this.orderRepo.findById(input.orderId);

    // =======================
    // ❌ ORDER NOT FOUND
    // =======================

    if (!order) {
      throw new OrderNotFoundException({
        orderId: input.orderId,
      });
    }

    // =======================
    // 🔐 OWNER CHECK
    // =======================

    if (order.userId !== input.userId) {
      throw new InvalidOrderOperationException({
        orderId: order.id,

        operation: 'request_return',

        reason: 'Unauthorized access to order',
      });
    }

    // =======================
    // 📦 ONLY DELIVERED ORDERS
    // =======================

    if (order.status !== OrderStatus.DELIVERED) {
      throw new InvalidOrderOperationException({
        orderId: order.id,

        operation: 'request_return',

        reason: 'Only delivered orders can be returned',
      });
    }

    // =======================
    // 🛡 PREVENT DUPLICATE
    // =======================

    const existing = await this.returnRepo.findActiveReturnByOrderId(order.id);

    if (existing) {
      throw new ReturnAlreadyRequestedException({
        orderId: order.id,
      });
    }

    // =======================
    // 🧾 CREATE ENTITY
    // =======================

    const returnRequest = Return.create({
      orderId: order.id,
      userId: input.userId,
      type: input.type,
      reason: input.reason,
      description: input.description,
    });
    // =======================
    // 💾 SAVE
    // =======================

    const created = await this.returnRepo.create(returnRequest);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      returnRequest: {
        id: created.id,

        orderId: created.orderId,

        userId: created.userId,

        type: created.type,

        reason: created.reason,

        description: created.description,

        status: created.status,

        createdAt: created.createdAt,

        updatedAt: created.updatedAt,
      },

      order: this.orderResponseBuilder.buildReplacementOrder(order),
    };
  }
}
