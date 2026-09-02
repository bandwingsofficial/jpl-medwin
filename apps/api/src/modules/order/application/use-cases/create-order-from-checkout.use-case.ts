// src/modules/order/application/use-cases/create-order-from-checkout.use-case.ts

import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import * as crypto from 'crypto';
import { OrderNotificationService } from '@/modules/notifications/order-notification.service';

import { CustomerOrderNotificationService } from '@/modules/notifications/customer-order-notification.service';
import { TOKENS } from '@/common/constants/tokens';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';

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

import { OrderAddressValidationService } from '../services/order-address-validation.service';

import { OrderAddressResponseMapper } from '../mappers/order-address-response.mapper';
import { OrderAddressSnapshotMapper } from '../mappers/order-address-snapshot.mapper';
import { CartRepository } from '@/modules/cart/domain/repositories/cart.repository';

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

    @Inject(TOKENS.CART_REPO)
    private readonly cartRepo: CartRepository,

    private readonly summaryService: OrderSummaryService,

    private readonly orderNumberService: OrderNumberService,

    private readonly redeemCoinsUseCase: RedeemCoinsUseCase,

    private readonly orderAddressValidationService: OrderAddressValidationService,

    private readonly prisma: PrismaService,
    private readonly orderNotificationService: OrderNotificationService,

    private readonly customerOrderNotificationService: CustomerOrderNotificationService,
  ) {}

  async execute(input: {
    checkoutSessionId: string;

    userId: string;

    shippingAddressId: string;

    billingAddressId?: string;

    isBillingSameAsShipping?: boolean;

    customerNote?: string;

    gstNumber?: string;

    paymentMethod:
    | 'RAZORPAY'
    | 'UPI'
    | 'COD';

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
    // 🔄 IDEMPOTENCY CHECK
    // =======================
    const existingOrder = await this.orderRepo.findByCheckoutSessionId(session.id);
    if (existingOrder) {
      const existingItems = await this.orderItemRepo.findByOrderId(existingOrder.id);
      const summary = this.summaryService.build({
        items: existingItems,
        couponDiscount: existingOrder.couponDiscount ?? 0,
        rewardDiscount: existingOrder.redeemedAmount ?? 0,
        shippingCharge: existingOrder.shippingCharge ?? 0,
        overweightDeliveryCharge: existingOrder.overweightDeliveryCharge ?? 0,
        tax: existingOrder.tax ?? 0,
      });

      return {
        orderId: existingOrder.id,
        orderNumber: existingOrder.orderNumber,
        status: existingOrder.status,
        paymentStatus: existingOrder.paymentStatus,
        checkoutSessionId: existingOrder.checkoutSessionId,
        cart: {
          id: existingOrder.cartId,
          status: 'CONVERTED',
          couponCode: existingOrder.couponCode,
        },
        rewards: {
          redeemedCoins: existingOrder.redeemedCoins,
          redeemedAmount: existingOrder.redeemedAmount,
        },
        items: existingItems.map((item) => {
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
        summary,
        ...OrderAddressResponseMapper.toOrderAddressFields(existingOrder),
        customerNote: existingOrder.customerNote,
        gstNumber: existingOrder.gstNumber ?? null,
        createdAt: existingOrder.createdAt,
      };
    }

    // =======================
    // 📦 GET CHECKOUT ITEMS
    // =======================

    const checkoutItems = await this.checkoutSessionItemRepo.findByCheckoutSessionId(session.id);

console.log("🔥 ORDER STEP 1 - CHECKOUT ITEMS:", checkoutItems.length);

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
    // 📍 VALIDATE ADDRESSES
    // =======================

    const validatedAddresses =
  await this.orderAddressValidationService.validateForOrderCreation({
    userId: input.userId,
    shippingAddressId: input.shippingAddressId,
    billingAddressId: input.billingAddressId,
    isBillingSameAsShipping: input.isBillingSameAsShipping,
  });

console.log("🔥 ORDER STEP 2 - ADDRESSES VALIDATED");

    // =======================
    // 🔢 GENERATE ORDER NUMBER
    // =======================

    let orderNumber = this.orderNumberService.generate();

    while (await this.orderRepo.existsByOrderNumber(orderNumber)) {
  orderNumber = this.orderNumberService.generate();
}

console.log("🔥 ORDER STEP 3 - ORDER NUMBER:", orderNumber);
    // =======================
    // 🪙 REWARDS SNAPSHOT
    // =======================

    const redeemedCoins = session.rewardCoinsUsed ?? 0;

    const redeemedAmount = session.rewardDiscount ?? 0;

    // =======================
    // 💰 FINAL TOTAL
    // =======================

    const finalGrandTotal = session.grandTotal;

    const isCod = input.paymentMethod === 'COD';

    // =======================
    // 💵 COD LIMIT CHECK
    // =======================
    const COD_MAX_AMOUNT = 10000;
    if (isCod && finalGrandTotal >= COD_MAX_AMOUNT) {
      throw new BadRequestException(
        'Cash on Delivery is available only for orders below ₹10,000. Please choose an online payment method.',
      );
    }

    const shippingAddressSnapshot = OrderAddressSnapshotMapper.fromSavedAddress(
      validatedAddresses.shippingAddress,
    );

    const billingAddressSnapshot = OrderAddressSnapshotMapper.fromSavedAddress(
      validatedAddresses.billingAddress,
    );

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

      session.overweightDeliveryCharge,

      session.tax,

      finalGrandTotal,

      session.totalSavings,

      0,

      redeemedCoins,

      redeemedAmount,

      validatedAddresses.shippingAddressId,

      validatedAddresses.billingAddressId,

      validatedAddresses.isBillingSameAsShipping,

      validatedAddresses.shippingAddress,

      validatedAddresses.billingAddress,

      shippingAddressSnapshot,

      billingAddressSnapshot,

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

      input.gstNumber ? input.gstNumber.trim().toUpperCase() : undefined,

      undefined,

      {
        checkoutSessionId: session.id,
        paymentMethod: input.paymentMethod || 'COD',
      },
    );

    // =======================
    // 💾 SAVE ORDER + ITEMS (ATOMIC)
    // =======================
    if (isCod) {
      order.confirmCodOrder();
    }

    const orderItems = checkoutItems.map(
      (item) =>
        new OrderItem(
          crypto.randomUUID(),

          order.id,

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

   console.log("🔥 ORDER: BEFORE TRANSACTION");

const cart = isCod
  ? await this.cartRepo.findById(session.cartId)
  : null;

const createdOrder = await this.prisma.$transaction(async (tx) => {
  const persistedOrder = await this.orderRepo.create(order, tx);

  await this.orderItemRepo.createMany(orderItems, tx);

  if (isCod) {
    session.complete();

    await this.checkoutSessionRepo.update(session, tx);

    if (cart && !cart.isConverted()) {
      cart.convert();

      await tx.cart.update({
        where: { id: cart.id },
        data: { status: 'CONVERTED' },
      });
    }
  }

  return persistedOrder;
});
console.log("🔥 ORDER: TRANSACTION COMPLETED", createdOrder.id);
    // =======================
// 📧 NEW ORDER EMAIL
// =======================

void this.orderNotificationService.sendNewOrderNotification(
  createdOrder.id,
);

void this.customerOrderNotificationService.sendCustomerOrderNotification(
  createdOrder.id,
  'PLACED',
);

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
    // 💰 BUILD SUMMARY
    // =======================

    const summary = this.summaryService.build({
      items: orderItems,

      couponDiscount: createdOrder.couponDiscount ?? 0,

      rewardDiscount: createdOrder.redeemedAmount ?? 0,

      shippingCharge: createdOrder.shippingCharge ?? 0,

      overweightDeliveryCharge: createdOrder.overweightDeliveryCharge ?? 0,

      tax: createdOrder.tax ?? 0,
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

        status: isCod ? 'CONVERTED' : 'LOCKED',

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

      ...OrderAddressResponseMapper.toOrderAddressFields(createdOrder),

      // =======================
      // 📝 CUSTOMER NOTE & GST
      // =======================

      customerNote: createdOrder.customerNote,

      gstNumber: createdOrder.gstNumber ?? null,

      createdAt: createdOrder.createdAt,
    };
  }
}
