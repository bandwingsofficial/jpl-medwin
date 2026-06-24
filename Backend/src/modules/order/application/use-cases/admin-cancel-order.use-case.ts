// src/modules/order/application/use-cases/admin-cancel-order.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { OrderRepository } from '../../domain/repositories/order.repository';
import { OrderItemRepository } from '../../domain/repositories/order-item.repository';

import { OrderNotFoundException } from '../../domain/exceptions/order-not-found.exception';
import { InvalidOrderOperationException } from '../../domain/exceptions/invalid-order-operation.exception';

import { OrderDomainService } from '../../domain/services/order-domain.service';

import { RefundCoinsUseCase } from '@/modules/coins/application/use-cases/wallet/refund-coins.use-case';

@Injectable()
export class AdminCancelOrderUseCase {
  constructor(
    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,

    @Inject(TOKENS.ORDER_ITEM_REPO)
    private readonly orderItemRepo: OrderItemRepository,

    private readonly domainService: OrderDomainService,

    private readonly refundCoinsUseCase: RefundCoinsUseCase,
  ) {}

  async execute(input: {
    orderId: string;
    reason?: string;
    adminId?: string;
  }) {
    // =======================
    // FIND ORDER
    // =======================

    const order = await this.orderRepo.findById(
      input.orderId,
    );

    if (!order) {
      throw new OrderNotFoundException({
        orderId: input.orderId,
      });
    }

  // =======================
// VALIDATE
// =======================

this.domainService.ensureOrderUsable(order);

this.domainService.ensureCanAdminCancel(order);

    // =======================
    // DELIVERED ORDERS
    // =======================

    if (order.isDelivered()) {
      throw new InvalidOrderOperationException({
        orderId: order.id,

        operation: 'admin_cancel',

        reason:
          'Delivered orders cannot be cancelled. Use return/refund flow.',
      });
    }

    // =======================
    // ALREADY REFUNDED
    // =======================

    if (order.isRefunded()) {
      throw new InvalidOrderOperationException({
        orderId: order.id,

        operation: 'admin_cancel',

        reason:
          'Refunded orders cannot be cancelled.',
      });
    }

    // =======================
    // CANCEL ORDER
    // =======================

    order.cancel(
      input.reason ??
        'Cancelled by administrator',
    );

    const updated = await this.orderRepo.update(
      order,
    );

    // =======================
    // REFUND REDEEMED COINS
    // =======================

    if (
      updated.redeemedCoins > 0 &&
      updated.userId &&
      !updated.rewardRefunded
    ) {
      try {
        await this.refundCoinsUseCase.execute({
          userId: updated.userId,

          orderId: updated.id,

          coins: updated.redeemedCoins,

          reason:
            input.reason ??
            `Admin cancelled order ${updated.orderNumber}`,
        });

        updated.markRewardRefunded();

        await this.orderRepo.update(updated);
      } catch (error) {
        console.warn(
          'Reward refund skipped:',
          error instanceof Error
            ? error.message
            : String(error),
        );
      }
    }

    // =======================
    // ITEMS
    // =======================

    const items =
      await this.orderItemRepo.findByOrderId(
        updated.id,
      );

    // =======================
    // RESPONSE
    // =======================

    return {
      success: true,

      data: {
        id: updated.id,

        orderNumber: updated.orderNumber,

        status: updated.status,

        paymentStatus:
          updated.paymentStatus,

        cancelledAt:
          updated.cancelledAt,

        cancellationReason:
          input.reason,

        totals: {
          subtotal: updated.subtotal,

          couponDiscount:
            updated.couponDiscount,

          shippingCharge:
            updated.shippingCharge,

          tax: updated.tax,

          grandTotal:
            updated.grandTotal,

          totalSavings:
            updated.totalSavings,

          redeemedCoins:
            updated.redeemedCoins,

          redeemedAmount:
            updated.redeemedAmount,

          earnedCoins:
            updated.earnedCoins,
        },

        itemCount: items.length,

        totalQuantity: items.reduce(
          (total, item) =>
            total + item.quantity,
          0,
        ),

        updatedAt: updated.updatedAt,
      },
    };
  }
}