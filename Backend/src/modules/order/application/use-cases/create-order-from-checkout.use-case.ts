// src/modules/order/application/use-cases/create-order-from-checkout.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import * as crypto from 'crypto';

import { TOKENS } from '@/common/constants/tokens';

import { Order } from '../../domain/entities/order.entity';

import { OrderItem } from '../../domain/entities/order-item.entity';

import { OrderRepository } from '../../domain/repositories/order.repository';

import { OrderItemRepository } from '../../domain/repositories/order-item.repository';

import { OrderSummaryService } from '../services/order-summary.service';

import { OrderNumberService } from '../services/order-number.service';

import { CheckoutSessionRepository } from '@/modules/checkout-session/domain/repositories/checkout-session.repository';

import { CheckoutSessionItemRepository } from '@/modules/checkout-session/domain/repositories/checkout-session-item.repository';

import { CheckoutSessionNotFoundException } from '@/modules/checkout-session/domain/exceptions/checkout-session-not-found.exception';

import { InvalidCheckoutSessionException } from '@/modules/checkout-session/domain/exceptions/invalid-checkout-session.exception';

import { RedeemCoinsUseCase } from '@/modules/coins/application/use-cases/redemption/redeem-coins.use-case';

@Injectable()
export class CreateOrderFromCheckoutUseCase {
  constructor(
    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,

    @Inject(TOKENS.ORDER_ITEM_REPO)
    private readonly orderItemRepo: OrderItemRepository,

    @Inject(TOKENS.CHECKOUT_SESSION_REPO)
    private readonly checkoutSessionRepo: CheckoutSessionRepository,

    @Inject(TOKENS.CHECKOUT_SESSION_ITEM_REPO)
    private readonly checkoutSessionItemRepo: CheckoutSessionItemRepository,

    private readonly summaryService: OrderSummaryService,

    private readonly orderNumberService: OrderNumberService,

    private readonly redeemCoinsUseCase: RedeemCoinsUseCase,
  ) {}

  async execute(input: {
    checkoutSessionId: string;

    userId: string;

    shippingAddress?: Record<string, any>;

    billingAddress?: Record<string, any>;

    customerNote?: string;

    redeemCoins?: boolean;

    coinsToRedeem?: number;
  }) {
    // =======================
    // 🔍 FIND CHECKOUT SESSION
    // =======================

    const session = await this.checkoutSessionRepo.findById(input.checkoutSessionId);

    // =======================
    // ❌ SESSION NOT FOUND
    // =======================

    if (!session) {
      throw new CheckoutSessionNotFoundException({
        checkoutSessionId: input.checkoutSessionId,
      });
    }

    // =======================
    // 🛡 VALIDATE OWNER
    // =======================

    if (session.userId !== input.userId) {
      throw new InvalidCheckoutSessionException({
        checkoutSessionId: session.id,

        reason: 'Unauthorized checkout session access',
      });
    }

    // =======================
    // ⏰ SESSION EXPIRED
    // =======================

    if (session.isExpired()) {
      throw new InvalidCheckoutSessionException({
        checkoutSessionId: session.id,

        reason: 'Checkout session expired',
      });
    }

    // =======================
    // ✅ SESSION COMPLETED
    // =======================

    if (session.isCompleted()) {
      throw new InvalidCheckoutSessionException({
        checkoutSessionId: session.id,

        reason: 'Checkout session already completed',
      });
    }

    // =======================
    // 📦 GET CHECKOUT ITEMS
    // =======================

    const checkoutItems = await this.checkoutSessionItemRepo.findByCheckoutSessionId(session.id);

    // =======================
    // ❌ EMPTY SESSION
    // =======================

    if (checkoutItems.length === 0) {
      throw new InvalidCheckoutSessionException({
        checkoutSessionId: session.id,

        reason: 'Checkout session has no items',
      });
    }

    // =======================
    // 🔢 GENERATE ORDER NUMBER
    // =======================

    let orderNumber = this.orderNumberService.generate();

    while (await this.orderRepo.existsByOrderNumber(orderNumber)) {
      orderNumber = this.orderNumberService.generate();
    }

    // =======================
    // 🪙 REWARDS SNAPSHOT
    // =======================

    const redeemedCoins = session.rewardCoinsUsed ?? 0;

    const redeemedAmount = session.rewardDiscount ?? 0;

    // =======================
    // 💰 FINAL TOTAL
    // =======================

    const finalGrandTotal = session.grandTotal;

    // =======================
    // 🧾 CREATE ORDER ENTITY
    // =======================

    const order = new Order(
      crypto.randomUUID(),

      orderNumber,

      session.cartId,

      session.id,

      input.userId,

      undefined,

      undefined,

      session.couponCode,

      session.subtotal,

      session.couponDiscount,

      session.shippingCharge,

      session.tax,

      finalGrandTotal,

      session.totalSavings,

      0,

      redeemedCoins,

      redeemedAmount,

      input.shippingAddress ?? {},

      input.billingAddress ?? {},

      // =======================
      // 🚚 SHIPMENT
      // =======================

      undefined, // trackingId

      undefined, // courierName

      undefined, // shippedAt

      undefined, // deliveredAt

      undefined, // cancelledAt

      false, // rewardRefunded

      undefined, // refundedAt

      input.customerNote,

      undefined,

      {
        checkoutSessionId: session.id,
      },
    );

    // =======================
    // 💾 SAVE ORDER
    // =======================

    const createdOrder = await this.orderRepo.create(order);

    // // =======================
    // // 🪙 REDEEM COINS
    // // =======================

    // if (redeemedCoins > 0 && redeemedAmount > 0) {
    //   await this.redeemCoinsUseCase.execute({
    //     userId: input.userId,

    //     orderId: createdOrder.id,

    //     coins: redeemedCoins,

    //     orderAmount: createdOrder.grandTotal + createdOrder.redeemedAmount,

    //     metadata: {
    //       orderNumber: createdOrder.orderNumber,
    //     },
    //   });
    // }

    // =======================
    // 📦 CREATE ORDER ITEMS
    // =======================

    const orderItems = checkoutItems.map(
      (item) =>
        new OrderItem(
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

          item.totalPrice,

          item.mrp ? item.mrp * item.quantity : undefined,

          item.mrp ? item.mrp * item.quantity - item.totalPrice : undefined,
        ),
    );

    // =======================
    // 💾 SAVE ORDER ITEMS
    // =======================

    await this.orderItemRepo.createMany(orderItems);

//     // =======================
// // ✅ COMPLETE CHECKOUT SESSION
// // =======================

// session.complete();

// await this.checkoutSessionRepo.update(
//   session,
// );

    // =======================
    // 💰 BUILD SUMMARY
    // =======================

    const summary = this.summaryService.build({
  items: orderItems,

  couponDiscount:
    createdOrder.couponDiscount ?? 0,

  rewardDiscount:
    createdOrder.redeemedAmount ?? 0,

  shippingCharge:
    createdOrder.shippingCharge ?? 0,

  tax:
    createdOrder.tax ?? 0,
});

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      orderId: createdOrder.id,

      orderNumber: createdOrder.orderNumber,

      status: createdOrder.status,

      paymentStatus: createdOrder.paymentStatus,

      checkoutSessionId: createdOrder.checkoutSessionId,

      // =======================
      // 🛒 CART
      // =======================

      cart: {
        id: createdOrder.cartId,

        status: 'LOCKED',

        couponCode: createdOrder.couponCode,
      },

      // =======================
      // 🪙 REWARDS
      // =======================

      rewards: {
        redeemedCoins: createdOrder.redeemedCoins,

        redeemedAmount: createdOrder.redeemedAmount,
      },

      // =======================
      // 📦 ITEMS
      // =======================

      items: orderItems.map((item) => {
        const mrp = item.mrp ?? item.price;

        const mrpTotal = mrp * item.quantity;

        const discount = mrpTotal - item.totalPrice;

        return {
          id: item.id,

          orderId: item.orderId,

          productId: item.productId,

          variantId: item.variantId,

          productName: item.productName,

          variant: {
            id: item.variantId,

            name: item.variantName,

            sku: item.sku,

            quantity: item.quantity,

            pricing: {
              sellingPrice: item.price,

              mrp,
            },

            images: {
              main: item.imageUrl,
            },
          },

          totals: {
            subtotal: item.totalPrice,

            mrpTotal,

            discount,
          },
        };
      }),

      // =======================
      // 💰 SUMMARY
      // =======================

      summary,

      // =======================
      // 🚚 SHIPPING ADDRESS
      // =======================

      shippingAddress: createdOrder.shippingAddress,

      // =======================
      // 🧾 BILLING ADDRESS
      // =======================

      billingAddress: createdOrder.billingAddress,

      // =======================
      // 📝 CUSTOMER NOTE
      // =======================

      customerNote: createdOrder.customerNote,

      createdAt: createdOrder.createdAt,
    };
  }
}
