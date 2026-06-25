import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ReturnRepository } from '../../domain/repositories/return.repository';
import { OrderRepository } from '@/modules/order/domain/repositories/order.repository';

import { ReturnNotFoundException } from '../../domain/exceptions/return-not-found.exception';
import { InvalidReturnOperationException } from '../../domain/exceptions/invalid-return-operation.exception';

import { ReturnOwnershipService } from '../services/return-ownership.service';
import { OrderResponseBuilderService } from '@/modules/order/application/services/order-response-builder.service';

@Injectable()
export class GetReturnUseCase {
  constructor(
    @Inject(TOKENS.RETURN_REPO)
    private readonly returnRepo: ReturnRepository,

    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,

    private readonly ownershipService: ReturnOwnershipService,

    private readonly orderResponseBuilder: OrderResponseBuilderService,
  ) {}

  async execute(input: { returnId: string; userId: string; isAdmin?: boolean }) {
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
    // 🔐 OWNER CHECK
    // =======================

    if (!input.isAdmin) {
      const canAccess = this.ownershipService.canAccess({
        returnRequest,
        userId: input.userId,
      });

      if (!canAccess) {
        throw new InvalidReturnOperationException({
          returnId: returnRequest.id,

          operation: 'view',

          reason: 'Unauthorized access to return',
        });
      }
    }

    // =======================
    // 🔄 REPLACEMENT ORDER
    // =======================

    const replacementOrder = returnRequest.replacementOrderId
      ? await this.orderRepo.findById(returnRequest.replacementOrderId)
      : null;

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: returnRequest.id,

      orderId: returnRequest.orderId,

      userId: returnRequest.userId,

      type: returnRequest.type,

      status: returnRequest.status,

      reason: returnRequest.reason,

      description: returnRequest.description,

      adminRemark: returnRequest.adminRemark,

      rejectionReason: returnRequest.rejectionReason,

      pickupTrackingId: returnRequest.pickupTrackingId,

      replacementOrder: this.orderResponseBuilder.buildReplacementOrder(replacementOrder),

      approvedAt: returnRequest.approvedAt,

      rejectedAt: returnRequest.rejectedAt,

      pickedUpAt: returnRequest.pickedUpAt,

      completedAt: returnRequest.completedAt,

      metadata: returnRequest.metadata,

      createdAt: returnRequest.createdAt,

      updatedAt: returnRequest.updatedAt,
    };
  }
}
