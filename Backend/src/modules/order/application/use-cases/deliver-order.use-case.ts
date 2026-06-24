// src/modules/order/application/use-cases/deliver-order.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { OrderRepository } from '../../domain/repositories/order.repository';
import { OrderItemRepository } from '../../domain/repositories/order-item.repository';

import { OrderNotFoundException } from '../../domain/exceptions/order-not-found.exception';

import { OrderDomainService } from '../../domain/services/order-domain.service';

import { ProcessOrderRewardUseCase } from '@/modules/coins/application/use-cases/rewards/process-order-reward.use-case';

@Injectable()
export class DeliverOrderUseCase {
  constructor(
    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,

    @Inject(TOKENS.ORDER_ITEM_REPO)
    private readonly orderItemRepo: OrderItemRepository,

    private readonly domainService: OrderDomainService,

    private readonly processOrderRewardUseCase: ProcessOrderRewardUseCase,
  ) {}

  async execute(input: {
    orderId: string;
  }) {
    // =======================
    // 🔍 FIND ORDER
    // =======================

    const order = await this.orderRepo.findById(
      input.orderId,
    );

    // =======================
    // ❌ NOT FOUND
    // =======================

    if (!order) {
      throw new OrderNotFoundException({
        orderId: input.orderId,
      });
    }

    // =======================
    // 🛡 VALIDATE
    // =======================

    this.domainService.ensureOrderUsable(
      order,
    );

    this.domainService.ensureCanDeliver(
      order,
    );

    // =======================
    // 🚚 DELIVER ORDER
    // =======================

    order.deliver();

    const updated =
      await this.orderRepo.update(
        order,
      );

    // =======================
    // 🪙 PROCESS REWARDS
    // =======================

    if (
      updated.userId &&
      updated.earnedCoins === 0
    ) {
      const rewardResult =
        await this.processOrderRewardUseCase.execute(
          {
            userId: updated.userId,

            orderId: updated.id,

            orderAmount:
              updated.grandTotal,

            metadata: {
              orderNumber:
                updated.orderNumber,
            },
          },
        );

      const earnedCoins =
        rewardResult.rewards?.finalCoins ??
        0;

      if (earnedCoins > 0) {
        updated.applyEarnedCoins(
          earnedCoins,
        );

        await this.orderRepo.update(
          updated,
        );
      }
    }

    // =======================
    // 📦 ITEMS
    // =======================

    const items =
      await this.orderItemRepo.findByOrderId(
        updated.id,
      );

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      success: true,

      data: {
        id: updated.id,

        orderNumber:
          updated.orderNumber,

        status: updated.status,

        paymentStatus:
          updated.paymentStatus,

        shipment: {
          trackingId:
            updated.trackingId,

          courierName:
            updated.courierName,

          shippedAt:
            updated.shippedAt,

          deliveredAt:
            updated.deliveredAt,
        },

        rewards: {
          earnedCoins:
            updated.earnedCoins,
        },

        totals: {
          subtotal:
            updated.subtotal,

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

        itemCount:
          this.domainService.calculateTotalProducts(
            items,
          ),

        totalQuantity:
          this.domainService.calculateTotalQuantity(
            items,
          ),

        updatedAt:
          updated.updatedAt,
      },
    };
  }
}