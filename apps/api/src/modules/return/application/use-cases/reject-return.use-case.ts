import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ReturnRepository } from '../../domain/repositories/return.repository';

import { ReturnNotFoundException } from '../../domain/exceptions/return-not-found.exception';

import { ReturnDomainService } from '../../domain/services/return-domain.service';

import { OrderRepository } from '@/modules/order/domain/repositories/order.repository';
import { OrderNotFoundException } from '@/modules/order/domain/exceptions/order-not-found.exception';
import { OrderResponseBuilderService } from '@/modules/order/application/services/order-response-builder.service';

@Injectable()
export class RejectReturnUseCase {
  constructor(
    @Inject(TOKENS.RETURN_REPO)
    private readonly returnRepo: ReturnRepository,

    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,

    private readonly domainService: ReturnDomainService,

    private readonly orderResponseBuilder: OrderResponseBuilderService,
  ) {}

  async execute(input: {
    returnId: string;

    reason?: string;
  }) {
    // =======================
    // 🔍 FIND RETURN
    // =======================

    const returnRequest = await this.returnRepo.findById(input.returnId);

    // =======================
    // ❌ NOT FOUND
    // =======================

    if (!returnRequest) {
      throw new ReturnNotFoundException({
        returnId: input.returnId,
      });
    }

    // =======================
    // 🛡 VALIDATE
    // =======================

    this.domainService.ensureReturnUsable(returnRequest);

    this.domainService.ensureCanReject(returnRequest);

    // =======================
    // LOAD THE ORDER DETAILS
    // =======================

    const order = await this.orderRepo.findById(returnRequest.orderId);

    if (!order) {
      throw new OrderNotFoundException({
        orderId: returnRequest.orderId,
      });
    }

    // =======================
    // ❌ REJECT
    // =======================

    returnRequest.reject(input.reason);

    // =======================
    // 💾 SAVE
    // =======================

    const updated = await this.returnRepo.update(returnRequest);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      returnRequest: {
        id: updated.id,

        orderId: updated.orderId,

        userId: updated.userId,

        type: updated.type,

        reason: updated.reason,

        description: updated.description,

        status: updated.status,

        rejectionReason: updated.rejectionReason,

        rejectedAt: updated.rejectedAt,

        createdAt: updated.createdAt,

        updatedAt: updated.updatedAt,
      },

      order: this.orderResponseBuilder.buildReplacementOrder(order),
    };
  }
}
