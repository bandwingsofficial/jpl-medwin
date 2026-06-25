import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ReturnRepository } from '../../domain/repositories/return.repository';
import { OrderRepository } from '@/modules/order/domain/repositories/order.repository';
import { OrderResponseBuilderService } from '@/modules/order/application/services/order-response-builder.service';
import { OrderNotFoundException } from '@/modules/order/domain/exceptions/order-not-found.exception';
import { ReturnNotFoundException } from '../../domain/exceptions/return-not-found.exception';

import { ReturnDomainService } from '../../domain/services/return-domain.service';

@Injectable()
export class ApproveReturnUseCase {
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

    adminRemark?: string;
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

    this.domainService.ensureCanApprove(returnRequest);

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
    // ✅ APPROVE
    // =======================

    returnRequest.approve(input.adminRemark);

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

        status: updated.status,

        type: updated.type,

        reason: updated.reason,

        description: updated.description,

        adminRemark: updated.adminRemark,

        approvedAt: updated.approvedAt,
      },

      order: this.orderResponseBuilder.buildReplacementOrder(order),
    };
  }
}
