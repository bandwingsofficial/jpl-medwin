// src/modules/order/application/use-cases/cancel-order.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { OrderRepository } from '../../domain/repositories/order.repository';

import { OrderItemRepository } from '../../domain/repositories/order-item.repository';

import { OrderNotFoundException } from '../../domain/exceptions/order-not-found.exception';

import { InvalidOrderOperationException } from '../../domain/exceptions/invalid-order-operation.exception';

import { OrderDomainService } from '../../domain/services/order-domain.service';

import { OrderOwnershipService } from '../services/order-ownership.service';

import { RefundCoinsUseCase } from '@/modules/coins/application/use-cases/wallet/refund-coins.use-case';

@Injectable()
export class CancelOrderUseCase {
  constructor(
    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,

    @Inject(TOKENS.ORDER_ITEM_REPO)
    private readonly orderItemRepo: OrderItemRepository,

    private readonly domainService: OrderDomainService,

    private readonly ownershipService: OrderOwnershipService,

    private readonly refundCoinsUseCase: RefundCoinsUseCase,
  ) {}

  async execute(input: {
    orderId: string;

    userId: string;

    reason?: string;
  }) {
    const order = await this.orderRepo.findById(input.orderId);

    if (!order) {
      throw new OrderNotFoundException({
        orderId: input.orderId,
      });
    }

    const canAccess = this.ownershipService.canAccess({
      order,

      userId: input.userId,
    });

    if (!canAccess) {
      throw new InvalidOrderOperationException({
        orderId: order.id,

        operation: 'cancel',

        reason: 'Unauthorized access to order',
      });
    }

    this.domainService.ensureOrderUsable(order);

    this.domainService.ensureCanCancel(order);

    order.cancel(input.reason);

    const updated = await this.orderRepo.update(order);

    if (updated.redeemedCoins > 0 && updated.userId) {
      /*
   |--------------------------------------------------------------------------
   | ALREADY REFUNDED
   |--------------------------------------------------------------------------
   */

      if (updated.rewardRefunded) {
        return {
          success: true,

          data: {
            id: updated.id,

            orderNumber: updated.orderNumber,

            rewardRefunded: true,
          },
        };
      }

      /*
   |--------------------------------------------------------------------------
   | REFUND REDEEMED COINS
   |--------------------------------------------------------------------------
   |
   | In our flow, redeemed coins are deducted only
   | after successful payment verification.
   |
   | So for pending / failed payments:
   | - order may contain redeemedCoins
   | - but actual REDEEMED transaction may not exist
   |
   | In that case, skip refund safely.
   |--------------------------------------------------------------------------
   */

      try {
        await this.refundCoinsUseCase.execute({
          userId: updated.userId,

          orderId: updated.id,

          coins: updated.redeemedCoins,

          reason:
            input.reason ?? `Refunded redeemed coins for cancelled order ${updated.orderNumber}`,
        });

        /*
     |--------------------------------------------------------------------------
     | MARK REFUNDED
     |--------------------------------------------------------------------------
     */

        updated.markRewardRefunded();

        await this.orderRepo.update(updated);
      } catch (error) {
        console.warn(
          'Reward refund skipped:',
          error instanceof Error ? error.message : String(error),
        );
      }
    }

    const items = await this.orderItemRepo.findByOrderId(updated.id);

    return {
      success: true,

      data: {
        id: updated.id,

        orderNumber: updated.orderNumber,

        status: updated.status,

        paymentStatus: updated.paymentStatus,

        cancelledAt: updated.cancelledAt,

        cancellationReason: input.reason,

        totals: {
          subtotal: updated.subtotal,

          couponDiscount: updated.couponDiscount,

          shippingCharge: updated.shippingCharge,

          tax: updated.tax,

          grandTotal: updated.grandTotal,

          totalSavings: updated.totalSavings,

          redeemedCoins: updated.redeemedCoins,

          redeemedAmount: updated.redeemedAmount,

          earnedCoins: updated.earnedCoins,
        },
        itemCount: items.length,

        totalQuantity: items.reduce((total, item) => total + item.quantity, 0),

        updatedAt: updated.updatedAt,
      },
    };
  }
}
