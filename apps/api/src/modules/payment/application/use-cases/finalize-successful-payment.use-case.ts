// src/modules/payment/application/use-cases/finalize-successful-payment.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { TOKENS } from '@/common/constants/tokens';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentRepository } from '../../domain/repositories/payment.repository';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { PaymentNotFoundException } from '../../domain/exceptions/payment-not-found.exception';
import { PaymentFailedException } from '../../domain/exceptions/payment-failed.exception';

import { Order } from '@/modules/order/domain/entities/order.entity';
import { OrderItem } from '@/modules/order/domain/entities/order-item.entity';
import { OrderStatus } from '@/modules/order/domain/enums/order-status.enum';
import { OrderRepository } from '@/modules/order/domain/repositories/order.repository';
import { OrderItemRepository } from '@/modules/order/domain/repositories/order-item.repository';
import { OrderNumberService } from '@/modules/order/application/services/order-number.service';
import { OrderAddressValidationService } from '@/modules/order/application/services/order-address-validation.service';
import { OrderAddressSnapshotMapper } from '@/modules/order/application/mappers/order-address-snapshot.mapper';
import { OrderNotificationService } from '@/modules/notifications/order-notification.service';

import { CheckoutSessionRepository } from '@/modules/checkout-session/domain/repositories/checkout-session.repository';
import { CheckoutSessionItemRepository } from '@/modules/checkout-session/domain/repositories/checkout-session-item.repository';
import { CheckoutSessionNotFoundException } from '@/modules/checkout-session/domain/exceptions/checkout-session-not-found.exception';
import { CartRepository } from '@/modules/cart/domain/repositories/cart.repository';

import { RedeemCouponUseCase } from '@/modules/coupon/application/use-cases/redeem-coupon.use-case';
import { CouponApplicationService } from '@/modules/coupon/application/services/coupon-application.service';
import { RedeemCoinsUseCase } from '@/modules/coins/application/use-cases/redemption/redeem-coins.use-case';

export interface FinalizeSuccessfulPaymentInput {
  paymentId?: string;
  providerPaymentId?: string;
  providerOrderId?: string;
  providerSignature?: string;
  webhookEvent?: string;
  webhookPayload?: Record<string, any>;
  shippingAddressId?: string;
  billingAddressId?: string;
  isBillingSameAsShipping?: boolean;
  customerNote?: string;
  gstNumber?: string;
  userId?: string;
}

@Injectable()
export class FinalizeSuccessfulPaymentUseCase {
  constructor(
    @Inject(TOKENS.PAYMENT_REPO)
    private readonly paymentRepo: PaymentRepository,

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

    private readonly orderNumberService: OrderNumberService,
    private readonly orderAddressValidationService: OrderAddressValidationService,
    private readonly orderNotificationService: OrderNotificationService,
    private readonly couponApplicationService: CouponApplicationService,
    private readonly redeemCouponUseCase: RedeemCouponUseCase,
    private readonly redeemCoinsUseCase: RedeemCoinsUseCase,
    private readonly prisma: PrismaService,
  ) {}

  async execute(input: FinalizeSuccessfulPaymentInput) {
    // ==========================================
    // 1. FIND PAYMENT ATTEMPT
    // ==========================================
    let payment: Payment | null = null;

    if (input.paymentId) {
      payment = await this.paymentRepo.findById(input.paymentId);
    } else if (input.providerPaymentId) {
      payment = await this.paymentRepo.findByProviderPaymentId(input.providerPaymentId);
    } else if (input.providerOrderId) {
      payment = await this.paymentRepo.findByProviderOrderId(input.providerOrderId);
    }

    if (!payment) {
      throw new PaymentNotFoundException({
        paymentId: input.paymentId,
        providerPaymentId: input.providerPaymentId,
      });
    }

    // ==========================================
    // 2. EXISTING ORDER PAYMENT FINALIZATION (e.g. COD -> ONLINE)
    // ==========================================
    if (payment.orderId) {
      const existingOrder = await this.orderRepo.findById(payment.orderId);

      if (!existingOrder) {
        throw new PaymentFailedException({
          paymentId: payment.id,
          reason: `Associated order ${payment.orderId} not found`,
        });
      }

      // Idempotency: if already SUCCESS and order paid, return immediately
      if (
        payment.status === PaymentStatus.SUCCESS &&
        existingOrder.paymentStatus === PaymentStatus.SUCCESS
      ) {
        return {
          success: true,
          orderId: existingOrder.id,
          orderNumber: existingOrder.orderNumber,
          status: existingOrder.status,
          paymentStatus: existingOrder.paymentStatus,
          isDuplicate: true,
        };
      }

      payment.status = PaymentStatus.SUCCESS;
      if (input.providerPaymentId) payment.providerPaymentId = input.providerPaymentId;
      if (input.providerSignature) payment.providerSignature = input.providerSignature;
      payment.capturedAt = new Date();

      if (input.webhookEvent) {
        payment.storeWebhook({
          event: input.webhookEvent,
          payload: input.webhookPayload,
        });
      }

      existingOrder.markPaymentSuccess();

      const updatedOrder = await this.prisma.$transaction(async (tx) => {
        await this.paymentRepo.update(payment, tx);
        const persisted = await this.orderRepo.update(existingOrder, tx);
        return persisted;
      });

      return {
        success: true,
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus,
        checkoutSessionId: updatedOrder.checkoutSessionId,
      };
    }

    // ==========================================
    // 3. VALIDATE LINKED CHECKOUT SESSION (NEW CHECKOUT)
    // ==========================================
    const checkoutSessionId = payment.checkoutSessionId || (payment.metadata?.checkoutSessionId as string);

    if (!checkoutSessionId) {
      throw new PaymentFailedException({
        paymentId: payment.id,
        reason: 'Payment attempt is missing checkout session reference',
      });
    }

    const session = await this.checkoutSessionRepo.findById(checkoutSessionId);

    if (!session) {
      throw new CheckoutSessionNotFoundException({
        checkoutSessionId,
      });
    }

    // Check if an order was already created for this checkout session (race condition check)
    const existingOrders = await this.prisma.order.findMany({
      where: { checkoutSessionId: session.id },
    });

    if (existingOrders.length > 0) {
      const existingOrder = existingOrders[0];
      if (!payment.orderId) {
        payment.linkOrder(existingOrder.id);
        payment.status = PaymentStatus.SUCCESS;
        if (input.providerPaymentId) payment.providerPaymentId = input.providerPaymentId;
        if (input.providerSignature) payment.providerSignature = input.providerSignature;
        payment.capturedAt = new Date();
        await this.paymentRepo.update(payment);
      }

      return {
        success: true,
        orderId: existingOrder.id,
        orderNumber: existingOrder.orderNumber,
        status: existingOrder.status,
        paymentStatus: existingOrder.paymentStatus,
        isDuplicate: true,
      };
    }

    // ==========================================
    // 4. GET CHECKOUT ITEMS
    // ==========================================
    const checkoutItems = await this.checkoutSessionItemRepo.findByCheckoutSessionId(session.id);

    if (checkoutItems.length === 0) {
      throw new Error('Checkout session has no items');
    }

    // ==========================================
    // 5. RESOLVE AND VALIDATE ADDRESSES
    // ==========================================
    const shippingAddressId =
      input.shippingAddressId ||
      (payment.metadata?.shippingAddressId as string);

    const billingAddressId =
      input.billingAddressId ||
      (payment.metadata?.billingAddressId as string);

    const isBillingSameAsShipping =
      input.isBillingSameAsShipping ??
      (payment.metadata?.isBillingSameAsShipping as boolean) ??
      true;

    const customerNote =
      input.customerNote ||
      (payment.metadata?.customerNote as string);

    const gstNumber =
      input.gstNumber ||
      (payment.metadata?.gstNumber as string);

    const userId =
      input.userId ||
      session.userId ||
      (payment.metadata?.userId as string);

    if (!shippingAddressId) {
      throw new Error('Shipping address missing for order creation');
    }

    const validatedAddresses = await this.orderAddressValidationService.validateForOrderCreation({
      userId: userId!,
      shippingAddressId,
      billingAddressId,
      isBillingSameAsShipping,
    });

    // ==========================================
    // 6. GENERATE UNIQUE ORDER NUMBER
    // ==========================================
    let orderNumber = this.orderNumberService.generate();

    while (await this.orderRepo.existsByOrderNumber(orderNumber)) {
      orderNumber = this.orderNumberService.generate();
    }

    // ==========================================
    // 7. SNAPSHOTS & REWARDS
    // ==========================================
    const shippingAddressSnapshot = OrderAddressSnapshotMapper.fromSavedAddress(
      validatedAddresses.shippingAddress,
    );

    const billingAddressSnapshot = OrderAddressSnapshotMapper.fromSavedAddress(
      validatedAddresses.billingAddress,
    );

    const redeemedCoins = session.rewardCoinsUsed ?? 0;
    const redeemedAmount = session.rewardDiscount ?? 0;
    const finalGrandTotal = session.grandTotal;

    // ==========================================
    // 8. CREATE ORDER DOMAIN ENTITY
    // ==========================================
    const order = new Order(
      crypto.randomUUID(),
      orderNumber,
      session.cartId,
      session.id,
      userId,
      OrderStatus.CONFIRMED,
      PaymentStatus.SUCCESS,
      session.couponCode,
      session.subtotal,
      session.couponDiscount,
      session.shippingCharge,
      session.overweightDeliveryCharge,
      session.tax,
      finalGrandTotal,
      session.totalSavings,
      0, // earnedCoins
      redeemedCoins,
      redeemedAmount,
      validatedAddresses.shippingAddressId,
      validatedAddresses.billingAddressId,
      validatedAddresses.isBillingSameAsShipping,
      validatedAddresses.shippingAddress,
      validatedAddresses.billingAddress,
      shippingAddressSnapshot,
      billingAddressSnapshot,
      undefined, // trackingId
      undefined, // courierName
      undefined, // shippedAt
      undefined, // deliveredAt
      undefined, // cancelledAt
      false, // rewardRefunded
      undefined, // refundedAt
      customerNote,
      gstNumber ? gstNumber.trim().toUpperCase() : undefined,
      undefined, // adminNote
      {
        checkoutSessionId: session.id,
        paymentId: payment.id,
        providerPaymentId: input.providerPaymentId || payment.providerPaymentId,
      },
    );

    // ==========================================
    // 9. CREATE ORDER ITEMS
    // ==========================================
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

    // ==========================================
    // 10. UPDATE PAYMENT & SESSION & CART STATE
    // ==========================================
    payment.linkOrder(order.id);
    payment.status = PaymentStatus.SUCCESS;
    if (input.providerPaymentId) payment.providerPaymentId = input.providerPaymentId;
    if (input.providerSignature) payment.providerSignature = input.providerSignature;
    payment.capturedAt = new Date();

    if (input.webhookEvent) {
      payment.storeWebhook({
        event: input.webhookEvent,
        payload: input.webhookPayload,
      });
    }

    session.complete();
    await this.checkoutSessionRepo.update(session);

    const cart = await this.cartRepo.findById(session.cartId);
    if (cart && !cart.isConverted()) {
      cart.convert();
      await this.cartRepo.update(cart);
    }

    // ==========================================
    // 11. ATOMIC DATABASE TRANSACTION
    // ==========================================
    const createdOrder = await this.prisma.$transaction(async (tx) => {
      const persistedOrder = await this.orderRepo.create(order, tx);
      await this.orderItemRepo.createMany(orderItems, tx);
      await this.paymentRepo.update(payment, tx);
      return persistedOrder;
    });

    // ==========================================
    // 12. REDEEM COUPON & REWARD COINS
    // ==========================================
    if (createdOrder.couponCode && createdOrder.couponDiscount > 0) {
      try {
        const coupon = await this.couponApplicationService.findCouponByCode(
          createdOrder.couponCode,
        );
        await this.redeemCouponUseCase.execute({
          couponId: coupon.id,
          userId: createdOrder.userId!,
          orderId: createdOrder.id,
          discountAmount: createdOrder.couponDiscount,
        });
      } catch (err) {
        console.error('Coupon redemption error during payment finalization:', err);
      }
    }

    if (redeemedCoins > 0 && redeemedAmount > 0 && createdOrder.userId) {
      try {
        await this.redeemCoinsUseCase.execute({
          userId: createdOrder.userId,
          orderId: createdOrder.id,
          coins: redeemedCoins,
          orderAmount: createdOrder.grandTotal + createdOrder.redeemedAmount,
          metadata: {
            orderNumber: createdOrder.orderNumber,
          },
        });
      } catch (err) {
        console.error('Coin redemption error during payment finalization:', err);
      }
    }

    // ==========================================
    // 13. SEND CONFIRMED ORDER NOTIFICATION
    // ==========================================
    void this.orderNotificationService.sendNewOrderNotification(createdOrder.id);

    // ==========================================
    // 14. RETURN SUCCESS RESPONSE
    // ==========================================
    return {
      success: true,
      orderId: createdOrder.id,
      orderNumber: createdOrder.orderNumber,
      status: createdOrder.status,
      paymentStatus: createdOrder.paymentStatus,
      checkoutSessionId: createdOrder.checkoutSessionId,
    };
  }
}
