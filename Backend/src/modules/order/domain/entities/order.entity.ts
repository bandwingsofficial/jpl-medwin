// src/modules/order/domain/entities/order.entity.ts

import { OrderStatus } from '../enums/order-status.enum';

import { PaymentStatus } from '../enums/payment-status.enum';

import { InvalidOrderOperationException } from '../exceptions/invalid-order-operation.exception';

import { OrderAlreadyCompletedException } from '../exceptions/order-already-completed.exception';

import { OrderAlreadyDeliveredException } from '../exceptions/order-already-delivered.exception';

import { OrderAlreadyShippedException } from '../exceptions/order-already-shipped.exception';

import { OrderCancelledException } from '../exceptions/order-cancelled.exception';

export class Order {
  constructor(
    public readonly id: string,

    public orderNumber: string,

    public cartId?: string,

    public checkoutSessionId?: string,

    public userId: string = '',

    public status: OrderStatus = OrderStatus.PENDING_PAYMENT,

    public paymentStatus: PaymentStatus = PaymentStatus.PENDING,

    public couponCode?: string,

    public subtotal: number = 0,

    public couponDiscount: number = 0,

    public shippingCharge: number = 0,

    public tax: number = 0,

    public grandTotal: number = 0,

    public totalSavings: number = 0,

    // =======================
    // 🪙 COINS
    // =======================

    public earnedCoins: number = 0,

    public redeemedCoins: number = 0,

    public redeemedAmount: number = 0,

    public shippingAddress: Record<string, any> = {},

    public billingAddress: Record<string, any> = {},

    public trackingId?: string,

public courierName?: string,

    public shippedAt?: Date,

    public deliveredAt?: Date,

    public cancelledAt?: Date,

    public rewardRefunded: boolean = false,
    public refundedAt?: Date,

    public customerNote?: string,

    public adminNote?: string,

    public metadata: Record<string, any> = {},

    public readonly createdAt: Date = new Date(),

    public updatedAt: Date = new Date(),

    public deletedAt?: Date,
  ) {}

  // =======================
  // 🧠 STATE
  // =======================

  isPendingPayment(): boolean {
    return this.status === OrderStatus.PENDING_PAYMENT;
  }

  isConfirmed(): boolean {
    return this.status === OrderStatus.CONFIRMED;
  }

  isCancelled(): boolean {
    return this.status === OrderStatus.CANCELLED;
  }

  isProcessing(): boolean {
    return this.status === OrderStatus.PROCESSING;
  }

  isShipped(): boolean {
    return this.status === OrderStatus.SHIPPED;
  }

  isDelivered(): boolean {
    return this.status === OrderStatus.DELIVERED;
  }

  isPaid(): boolean {
    return (
      this.paymentStatus === PaymentStatus.SUCCESS ||
      this.paymentStatus === PaymentStatus.CAPTURED
    );
  }

  isRefunded(): boolean {
    return (
      this.paymentStatus === PaymentStatus.REFUNDED ||
      this.paymentStatus === PaymentStatus.PARTIALLY_REFUNDED
    );
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  // =======================
  // 🪙 COINS
  // =======================

  applyCoinRedemption(params: {
    redeemedCoins: number;
    redeemedAmount: number;
  }) {
    this.redeemedCoins = params.redeemedCoins;

    this.redeemedAmount = params.redeemedAmount;

    this.touch();
  }

  applyEarnedCoins(coins: number) {
    this.earnedCoins = coins;

    this.touch();
  }

  clearCoinRedemption() {
    this.redeemedCoins = 0;

    this.redeemedAmount = 0;

    this.touch();
  }

  // =======================
  // 💳 PAYMENT
  // =======================

  markPaymentSuccess() {
    if (this.isCancelled()) {
      throw new OrderCancelledException({
        orderId: this.id,
      });
    }

    this.paymentStatus = PaymentStatus.SUCCESS;

    this.touch();
  }

  markPaymentFailed() {
    if (this.isPaid()) {
      throw new OrderAlreadyCompletedException({
        orderId: this.id,
      });
    }

    this.paymentStatus = PaymentStatus.FAILED;

    this.touch();
  }

  markRewardRefunded() {
  this.rewardRefunded = true;

  this.touch();
}

isRewardRefunded(): boolean {
  return this.rewardRefunded;
}

  // =======================
  // 📦 ORDER STATUS
  // =======================

  confirm() {
    if (this.isCancelled()) {
      throw new OrderCancelledException({
        orderId: this.id,
      });
    }

    if (!this.isPaid()) {
      throw new InvalidOrderOperationException({
        orderId: this.id,

        operation: 'confirm',

        reason: 'Order payment is not completed',
      });
    }

    this.status = OrderStatus.CONFIRMED;

    this.touch();
  }

  process() {
    if (!this.isConfirmed()) {
      throw new InvalidOrderOperationException({
        orderId: this.id,

        operation: 'process',

        reason: 'Only confirmed orders can be processed',
      });
    }

    this.status = OrderStatus.PROCESSING;

    this.touch();
  }

  ship(params?: {
  trackingId?: string;

  courierName?: string;
}) {
  if (this.isCancelled()) {
    throw new OrderCancelledException({
      orderId: this.id,
    });
  }

  if (this.status !== OrderStatus.PROCESSING) {
    throw new InvalidOrderOperationException({
      orderId: this.id,

      operation: 'ship',

      reason: 'Only processing orders can be shipped',
    });
  }

  if (this.isShipped()) {
    throw new OrderAlreadyShippedException({
      orderId: this.id,
    });
  }

  this.status = OrderStatus.SHIPPED;

  this.trackingId = params?.trackingId;

  this.courierName = params?.courierName;

  this.shippedAt = new Date();

  this.touch();
}

  deliver() {
    if (this.isDelivered()) {
      throw new OrderAlreadyDeliveredException({
        orderId: this.id,
      });
    }

    if (!this.isShipped()) {
      throw new InvalidOrderOperationException({
        orderId: this.id,

        operation: 'deliver',

        reason: 'Order must be shipped before delivery',
      });
    }

    this.status = OrderStatus.DELIVERED;

    this.deliveredAt = new Date();

    this.touch();
  }

  cancel(reason?: string) {
    this.status = OrderStatus.CANCELLED;

    this.cancelledAt = new Date();

    if (reason) {
        this.metadata = {
            ...this.metadata,
            cancellationReason: reason,
        };
    }

    this.touch();
}

  refund() {
    this.paymentStatus = PaymentStatus.REFUNDED;

    this.status = OrderStatus.REFUNDED;

    this.refundedAt = new Date();

    this.touch();
  }

  // =======================
  // ♻️ DELETE
  // =======================

  softDelete() {
    if (this.isDeleted()) {
      return;
    }

    this.deletedAt = new Date();

    this.touch();
  }

  restore() {
    this.deletedAt = undefined;

    this.touch();
  }

  // =======================
  // 🕒 INTERNAL
  // =======================

  private touch() {
    this.updatedAt = new Date();
  }
}