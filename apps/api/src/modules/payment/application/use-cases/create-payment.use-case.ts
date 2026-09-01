// src/modules/payment/application/use-cases/create-payment.use-case.ts

import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { Payment } from '../../domain/entities/payment.entity';

import { PaymentRepository } from '../../domain/repositories/payment.repository';

import { PaymentDomainService } from '../../domain/services/payment-domain.service';

import { PaymentProvider } from '../../domain/enums/payment-provider.enum';

import { PaymentStatus } from '../../domain/enums/payment-status.enum';

import { RazorpayService } from '../services/razorpay.service';

import { StripeService } from '../services/stripe.service';

import { CheckoutSessionRepository } from '@/modules/checkout-session/domain/repositories/checkout-session.repository';

import { CheckoutSessionNotFoundException } from '@/modules/checkout-session/domain/exceptions/checkout-session-not-found.exception';

import { InvalidCheckoutSessionException } from '@/modules/checkout-session/domain/exceptions/invalid-checkout-session.exception';

import { OrderAddressValidationService } from '@/modules/order/application/services/order-address-validation.service';

import { OrderRepository } from '@/modules/order/domain/repositories/order.repository';

import { OrderNotFoundException } from '@/modules/order/domain/exceptions/order-not-found.exception';

import { InvalidOrderOperationException } from '@/modules/order/domain/exceptions/invalid-order-operation.exception';

import { InvalidPaymentOperationException } from '../../domain/exceptions/invalid-payment-operation.exception';

import { OrderStatus } from '@/modules/order/domain/enums/order-status.enum';

export interface CreatePaymentInput {
  checkoutSessionId?: string;

  orderId?: string;

  userId: string;

  provider: PaymentProvider;

  shippingAddressId?: string;

  billingAddressId?: string;

  isBillingSameAsShipping?: boolean;

  customerNote?: string;

  gstNumber?: string;
}

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    @Inject(TOKENS.PAYMENT_REPO)
    private readonly paymentRepo: PaymentRepository,

    @Inject(TOKENS.CHECKOUT_SESSION_REPO)
    private readonly checkoutSessionRepo: CheckoutSessionRepository,

    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,

    private readonly orderAddressValidationService: OrderAddressValidationService,

    private readonly paymentDomainService: PaymentDomainService,

    private readonly razorpayService: RazorpayService,

    private readonly stripeService: StripeService,
  ) {}

  async execute(input: CreatePaymentInput) {
    // ==========================================
    // 🅰️ EXISTING ORDER PAYMENT (e.g. COD -> ONLINE)
    // ==========================================
    if (input.orderId) {
      const order = await this.orderRepo.findById(input.orderId);

      if (!order) {
        throw new OrderNotFoundException({
          orderId: input.orderId,
        });
      }

      if (order.userId !== input.userId) {
        throw new InvalidOrderOperationException({
          orderId: order.id,
          operation: 'pay',
          reason: 'Unauthorized access to order',
        });
      }

      if (order.isCancelled() || order.status === OrderStatus.REFUNDED) {
        throw new InvalidOrderOperationException({
          orderId: order.id,
          operation: 'pay',
          reason: 'Cannot make payment for a cancelled or refunded order',
        });
      }

      if (
        order.paymentStatus === PaymentStatus.SUCCESS ||
        order.paymentStatus === PaymentStatus.CAPTURED
      ) {
        throw new InvalidPaymentOperationException({
          paymentId: order.id,
          reason: 'Order is already paid',
        });
      }

      // CREATE PAYMENT ENTITY LINKED TO EXISTING ORDER
      const payment = new Payment({
        orderId: order.id,
        provider: input.provider,
        amount: order.grandTotal,
        currency: 'INR',
        status: PaymentStatus.PENDING,
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          userId: input.userId,
          paymentType: 'EXISTING_COD_ORDER',
        },
      });

      this.paymentDomainService.ensureCanCreate(payment);

      let providerOrderId: string | undefined;
      let providerResponse: Record<string, any> | undefined;

      if (input.provider === PaymentProvider.RAZORPAY) {
        const razorpayOrder = await this.razorpayService.createOrder({
          amount: order.grandTotal,
          currency: 'INR',
          receipt: order.orderNumber,
          notes: {
            orderId: order.id,
            userId: input.userId,
          },
        });

        providerOrderId = razorpayOrder.id;
        providerResponse = razorpayOrder;
      } else if (input.provider === PaymentProvider.STRIPE) {
        const paymentIntent = await this.stripeService.createPaymentIntent({
          amount: order.grandTotal,
          currency: 'INR',
          metadata: {
            orderId: order.id,
            userId: input.userId,
          },
        });

        providerOrderId = paymentIntent.id;
        providerResponse = paymentIntent;
      }

      payment.markCreated({
        providerOrderId,
      });

      const created = await this.paymentRepo.create(payment);

      return {
        id: created.id,
        orderId: created.orderId,
        provider: created.provider,
        status: created.status,
        amount: created.amount,
        currency: created.currency,
        providerOrderId: created.providerOrderId,
        providerResponse,
        createdAt: created.createdAt,
      };
    }

    // ==========================================
    // 🅱️ CHECKOUT SESSION PAYMENT (NEW ONLINE CHECKOUT)
    // ==========================================
    if (!input.checkoutSessionId) {
      throw new BadRequestException(
        'Either checkoutSessionId or orderId must be provided',
      );
    }

    if (!input.shippingAddressId) {
      throw new BadRequestException(
        'shippingAddressId is required for checkout session payment',
      );
    }

    const session = await this.checkoutSessionRepo.findById(input.checkoutSessionId);

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
    // 📍 VALIDATE ADDRESSES
    // =======================

    const validatedAddresses = await this.orderAddressValidationService.validateForOrderCreation({
      userId: input.userId,
      shippingAddressId: input.shippingAddressId,
      billingAddressId: input.billingAddressId,
      isBillingSameAsShipping: input.isBillingSameAsShipping,
    });

    // =======================
    // 💳 CREATE PAYMENT ENTITY
    // =======================

    const payment = new Payment({
      checkoutSessionId: session.id,

      provider: input.provider,

      // INTERNAL SYSTEM STORES INR (Server Source of Truth!)
      amount: session.grandTotal,

      currency: 'INR',

      status: PaymentStatus.PENDING,

      metadata: {
        checkoutSessionId: session.id,
        userId: input.userId,
        shippingAddressId: validatedAddresses.shippingAddressId,
        billingAddressId: validatedAddresses.billingAddressId,
        isBillingSameAsShipping: validatedAddresses.isBillingSameAsShipping,
        customerNote: input.customerNote,
        gstNumber: input.gstNumber ? input.gstNumber.trim().toUpperCase() : undefined,
      },
    });

    // =======================
    // 🛡 VALIDATE
    // =======================

    this.paymentDomainService.ensureCanCreate(payment);

    // =======================
    // 💳 PROVIDER ORDER
    // =======================

    let providerOrderId: string | undefined;

    let providerResponse: Record<string, any> | undefined;

    // =======================
    // 🟦 RAZORPAY
    // =======================

    if (input.provider === PaymentProvider.RAZORPAY) {
      const razorpayOrder = await this.razorpayService.createOrder({
        // SEND INR (Service will convert to paise)
        amount: session.grandTotal,

        currency: 'INR',

        receipt: `CS_${session.id.slice(-8).toUpperCase()}`,

        notes: {
          checkoutSessionId: session.id,
          userId: input.userId,
        },
      });

      providerOrderId = razorpayOrder.id;

      providerResponse = razorpayOrder;
    }

    // =======================
    // 🟪 STRIPE
    // =======================
    else if (input.provider === PaymentProvider.STRIPE) {
      const paymentIntent = await this.stripeService.createPaymentIntent({
        amount: session.grandTotal,

        currency: 'INR',

        metadata: {
          checkoutSessionId: session.id,
          userId: input.userId,
        },
      });

      providerOrderId = paymentIntent.id;

      providerResponse = paymentIntent;
    }

    // =======================
    // 🏗 MARK CREATED
    // =======================

    payment.markCreated({
      providerOrderId,
    });

    // =======================
    // 💾 SAVE
    // =======================

    const created = await this.paymentRepo.create(payment);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: created.id,

      checkoutSessionId: created.checkoutSessionId,

      provider: created.provider,

      status: created.status,

      // RETURN INR TO FRONTEND
      amount: created.amount,

      currency: created.currency,

      providerOrderId: created.providerOrderId,

      providerResponse,

      createdAt: created.createdAt,
    };
  }
}
