import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

import { TOKENS } from '@/common/constants/tokens';

import { ReturnRepository } from '../../domain/repositories/return.repository';
import { ReturnNotFoundException } from '../../domain/exceptions/return-not-found.exception';

import { OrderRepository } from '@/modules/order/domain/repositories/order.repository';
import { OrderItemRepository } from '@/modules/order/domain/repositories/order-item.repository';
import { OrderResponseBuilderService } from '@/modules/order/application/services/order-response-builder.service';
import { OrderNotFoundException } from '@/modules/order/domain/exceptions/order-not-found.exception';

import { Order } from '@/modules/order/domain/entities/order.entity';
import { OrderItem } from '@/modules/order/domain/entities/order-item.entity';

import { OrderStatus } from '@/modules/order/domain/enums/order-status.enum';
import { PaymentStatus } from '@/modules/order/domain/enums/payment-status.enum';

@Injectable()
export class CreateReplacementOrderUseCase {
  constructor(
    @Inject(TOKENS.RETURN_REPO)
    private readonly returnRepo: ReturnRepository,

    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,

    @Inject(TOKENS.ORDER_ITEM_REPO)
    private readonly orderItemRepo: OrderItemRepository,

    private readonly orderResponseBuilder: OrderResponseBuilderService,
  ) {}

  async execute(input: { returnId: string }) {
    // =======================
    // 🔍 FIND RETURN
    // =======================

    const returnRequest = await this.returnRepo.findById(input.returnId);

    if (!returnRequest) {
      throw new ReturnNotFoundException({
        returnId: input.returnId,
      });
    }

    // =======================
    // 🔍 FIND ORIGINAL ORDER
    // =======================

    const originalOrder = await this.orderRepo.findById(returnRequest.orderId);

    if (!originalOrder) {
      throw new OrderNotFoundException({
        orderId: returnRequest.orderId,
      });
    }

    // =======================
    // 📦 FIND ORIGINAL ITEMS
    // =======================

    const originalItems = await this.orderItemRepo.findByOrderId(originalOrder.id);

    // =======================
    // 🆕 CREATE ORDER
    // =======================

    const replacementOrder = new Order(
      crypto.randomUUID(),

      `REP-${Date.now()}`,

      undefined,

      undefined,

      originalOrder.userId,

      OrderStatus.CONFIRMED,

      PaymentStatus.CAPTURED,

      undefined,

      originalOrder.subtotal,

      originalOrder.couponDiscount,

      originalOrder.shippingCharge,

      originalOrder.tax,

      originalOrder.grandTotal,

      originalOrder.totalSavings,

      0, // earnedCoins

      0, // redeemedCoins

      0, // redeemedAmount

      originalOrder.shippingAddressId,

      originalOrder.billingAddressId,

      originalOrder.isBillingSameAsShipping,

      originalOrder.shippingAddress,

      originalOrder.billingAddress,

      originalOrder.shippingAddressSnapshot,

      originalOrder.billingAddressSnapshot,

      undefined,

      undefined,

      undefined,

      undefined,

      undefined,

      false,

      undefined,

      undefined,

      'Replacement order',

      {
        replacementForOrderId: originalOrder.id,

        returnId: returnRequest.id,
      },
    );

    const createdOrder = await this.orderRepo.create(replacementOrder);

    // =======================
    // 🔗 LINK RETURN ↔ REPLACEMENT ORDER
    // =======================

    returnRequest.replacementOrderId = createdOrder.id;

    await this.returnRepo.update(returnRequest);

    // =======================
    // 📦 COPY ITEMS
    // =======================

    const replacementItems = originalItems.map((item) => {
      const replacementItem = new OrderItem(
        crypto.randomUUID(),

        createdOrder.id,

        item.productId,

        item.variantId,

        item.productName,

        item.variantName,

        item.sku,

        item.imageUrl,

        item.quantity,

        item.price,

        item.mrp,
      );

      replacementItem.refreshTotals();

      return replacementItem;
    });

    await this.orderItemRepo.createMany(replacementItems);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      replacementOrder: this.orderResponseBuilder.buildReplacementOrder(createdOrder),

      originalOrder: {
        id: originalOrder.id,

        orderNumber: originalOrder.orderNumber,
      },

      returnRequest: {
        id: returnRequest.id,

        status: returnRequest.status,

        type: returnRequest.type,
      },

      itemCount: replacementItems.length,
    };
  }
}
