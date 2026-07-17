// src/modules/order/application/use-cases/process-order.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { OrderRepository } from '../../domain/repositories/order.repository';

import { OrderItemRepository } from '../../domain/repositories/order-item.repository';

import { OrderNotFoundException } from '../../domain/exceptions/order-not-found.exception';

import { OrderDomainService } from '../../domain/services/order-domain.service';

@Injectable()
export class ProcessOrderUseCase {
  constructor(
    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,

    @Inject(TOKENS.ORDER_ITEM_REPO)
    private readonly orderItemRepo: OrderItemRepository,

    private readonly domainService: OrderDomainService,
  ) {}

  async execute(input: { orderId: string }) {
    // =======================
    // 🔍 FIND ORDER
    // =======================

    const order = await this.orderRepo.findById(input.orderId);

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

    this.domainService.ensureOrderUsable(order);

    this.domainService.ensureCanProcess(order);

    // =======================
    // ⚙️ PROCESS ORDER
    // =======================

    order.process();

    // =======================
    // 💾 SAVE
    // =======================

    const updated = await this.orderRepo.update(order);

    // =======================
    // 📦 ITEMS
    // =======================

    const items = await this.orderItemRepo.findByOrderId(updated.id);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: updated.id,

      orderNumber: updated.orderNumber,

      status: updated.status,

      paymentStatus: updated.paymentStatus,

      totals: {
        subtotal: updated.subtotal,

        couponDiscount: updated.couponDiscount,

        shippingCharge: updated.shippingCharge,

        tax: updated.tax,

        redeemedCoins: updated.redeemedCoins,

        redeemedAmount: updated.redeemedAmount,

        earnedCoins: updated.earnedCoins,

        grandTotal: updated.grandTotal,

        totalSavings: updated.totalSavings,
      },

      itemCount: this.domainService.calculateTotalProducts(items),

      totalQuantity: this.domainService.calculateTotalQuantity(items),

      processedAt: updated.updatedAt,

      updatedAt: updated.updatedAt,
    };
  }
}
