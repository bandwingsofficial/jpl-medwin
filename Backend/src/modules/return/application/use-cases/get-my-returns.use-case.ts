import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ReturnRepository } from '../../domain/repositories/return.repository';

import { ReturnStatus } from '../../domain/enums/return-status.enum';
import { ReturnType } from '../../domain/enums/return-type.enum';
import { ReturnReason } from '../../domain/enums/return-reason.enum';

import { OrderRepository } from '@/modules/order/domain/repositories/order.repository';
import { OrderResponseBuilderService } from '@/modules/order/application/services/order-response-builder.service';

@Injectable()
export class GetMyReturnsUseCase {
  constructor(
    @Inject(TOKENS.RETURN_REPO)
    private readonly returnRepo: ReturnRepository,

    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,

    private readonly orderResponseBuilder: OrderResponseBuilderService,
  ) {}

  async execute(input: {
    userId: string;

    page?: number;

    limit?: number;

    status?: ReturnStatus;

    type?: ReturnType;

    reason?: ReturnReason;

    from?: Date;

    to?: Date;

    sortBy?: string;

    sortOrder?: 'asc' | 'desc';
  }) {
    // =======================
    // 🔍 FIND RETURNS
    // =======================

    const result = await this.returnRepo.findMany({
      page: input.page,

      limit: input.limit,

      userId: input.userId,

      status: input.status,

      type: input.type,

      reason: input.reason,

      from: input.from,

      to: input.to,

      sortBy: input.sortBy,

      sortOrder: input.sortOrder,
    });

    // =======================
    // 🚀 RESPONSE DATA
    // =======================

    const data = await Promise.all(
      result.data.map(async (returnRequest) => {
        const replacementOrder =
          returnRequest.replacementOrderId
            ? await this.orderRepo.findById(
                returnRequest.replacementOrderId,
              )
            : null;

        return {
          id: returnRequest.id,

          orderId: returnRequest.orderId,

          type: returnRequest.type,

          status: returnRequest.status,

          reason: returnRequest.reason,

          description:
            returnRequest.description,

          replacementOrder:
            this.orderResponseBuilder.buildReplacementOrder(
              replacementOrder,
            ),

          approvedAt:
            returnRequest.approvedAt,

          rejectedAt:
            returnRequest.rejectedAt,

          pickedUpAt:
            returnRequest.pickedUpAt,

          completedAt:
            returnRequest.completedAt,

          createdAt:
            returnRequest.createdAt,

          updatedAt:
            returnRequest.updatedAt,
        };
      }),
    );

    // =======================
    // 📄 RETURN RESPONSE
    // =======================

    return {
      data,

      pagination: {
        page: input.page ?? 1,

        limit: input.limit ?? 10,

        total: result.total,

        totalPages: Math.ceil(
          result.total / (input.limit ?? 10),
        ),
      },
    };
  }
}