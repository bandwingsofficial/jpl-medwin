import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ReturnRepository } from '../../domain/repositories/return.repository';

import { ReturnNotFoundException } from '../../domain/exceptions/return-not-found.exception';

import { ReturnDomainService } from '../../domain/services/return-domain.service';

import { ReturnType } from '../../domain/enums/return-type.enum';

import { RefundOrderUseCase } from '@/modules/order/application/use-cases/refund-order.use-case';

import { CreateReplacementOrderUseCase } from './create-replacement-order.use-case';

@Injectable()
export class CompleteReturnUseCase {
  constructor(
    @Inject(TOKENS.RETURN_REPO)
    private readonly returnRepo: ReturnRepository,

    private readonly domainService: ReturnDomainService,

    private readonly refundOrderUseCase: RefundOrderUseCase,

    private readonly createReplacementOrderUseCase: CreateReplacementOrderUseCase,
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

    this.domainService.ensureCanComplete(returnRequest);

    let replacementOrderId: string | undefined;

    // =======================
    // 💰 REFUND FLOW
    // =======================

    if (returnRequest.type === ReturnType.REFUND) {
      await this.refundOrderUseCase.execute({
        orderId: returnRequest.orderId,

        reason: input.reason ?? 'Order refunded after return completion',
      });
    }

    // =======================
    // 🔄 REPLACEMENT FLOW
    // =======================

    let replacementOrder: any = null;

    if (returnRequest.type === ReturnType.REPLACEMENT) {
      const replacement = await this.createReplacementOrderUseCase.execute({
        returnId: returnRequest.id,
      });

      if (replacement.replacementOrder) {
        replacementOrder = replacement.replacementOrder;

        replacementOrderId = replacement.replacementOrder.id;
      }
    }
    // =======================
    // ✅ COMPLETE RETURN
    // =======================

    returnRequest.complete({
      replacementOrderId,
    });

    // =======================
    // 💾 SAVE
    // =======================

    const updated = await this.returnRepo.update(returnRequest);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: updated.id,

      orderId: updated.orderId,

      type: updated.type,

      status: updated.status,

      replacementOrder,

      completedAt: updated.completedAt,

      updatedAt: updated.updatedAt,
    };
  }
}
