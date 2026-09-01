// src/modules/payment/domain/services/payment-domain.service.ts

import { Injectable } from '@nestjs/common';

import { Payment } from '../entities/payment.entity';

import { PaymentStatus } from '../enums/payment-status.enum';

import { InvalidPaymentOperationException } from '../exceptions/invalid-payment-operation.exception';

import { PaymentFailedException } from '../exceptions/payment-failed.exception';

@Injectable()
export class PaymentDomainService {
  // =======================
  // 🛡 ENSURE USABLE
  // =======================

  ensurePaymentUsable(payment: Payment) {
    if (payment.isDeleted()) {
      throw new InvalidPaymentOperationException({
        paymentId: payment.id,

        operation: 'use',

        reason: 'Payment has been deleted',
      });
    }
  }

  // =======================
  // 🏗 ENSURE CREATABLE
  // =======================

  ensureCanCreate(payment: Payment) {
    if (payment.amount <= 0) {
      throw new InvalidPaymentOperationException({
        paymentId: payment.id,

        operation: 'create',

        reason: 'Payment amount must be greater than zero',
      });
    }
  }

  // =======================
  // 🔐 ENSURE AUTHORIZABLE
  // =======================

  ensureCanAuthorize(payment: Payment) {
    if (payment.status !== PaymentStatus.PENDING && payment.status !== PaymentStatus.CREATED) {
      throw new InvalidPaymentOperationException({
        paymentId: payment.id,

        operation: 'authorize',

        reason: 'Only pending or created payments can be authorized',
      });
    }
  }

  // =======================
  // 💰 ENSURE CAPTURABLE
  // =======================

  ensureCanCapture(payment: Payment) {
    if (payment.status !== PaymentStatus.AUTHORIZED && payment.status !== PaymentStatus.CREATED) {
      throw new InvalidPaymentOperationException({
        paymentId: payment.id,

        operation: 'capture',

        reason: 'Only authorized or created payments can be captured',
      });
    }
  }

  // =======================
  // ❌ ENSURE FAILABLE
  // =======================

  ensureCanFail(payment: Payment) {
    if (payment.status === PaymentStatus.SUCCESS || payment.status === PaymentStatus.REFUNDED) {
      throw new PaymentFailedException({
        paymentId: payment.id,

        reason: 'Successful or refunded payments cannot fail',
      });
    }
  }

  // =======================
  // 💸 ENSURE REFUNDABLE
  // =======================

  ensureCanRefund(payment: Payment, amount: number) {
    if (
      payment.status !== PaymentStatus.SUCCESS &&
      payment.status !== PaymentStatus.PARTIALLY_REFUNDED
    ) {
      throw new InvalidPaymentOperationException({
        paymentId: payment.id,

        operation: 'refund',

        reason: 'Only successful payments can be refunded',
      });
    }

    const remaining = payment.amount - payment.refundedAmount;

    if (amount > remaining) {
      throw new InvalidPaymentOperationException({
        paymentId: payment.id,

        operation: 'refund',

        reason: 'Refund amount exceeds remaining refundable amount',
      });
    }
  }

  // =======================
  // 🚫 ENSURE CANCELLABLE
  // =======================

  ensureCanCancel(payment: Payment) {
    if (payment.status === PaymentStatus.SUCCESS || payment.status === PaymentStatus.REFUNDED) {
      throw new InvalidPaymentOperationException({
        paymentId: payment.id,

        operation: 'cancel',

        reason: 'Successful or refunded payments cannot be cancelled',
      });
    }
  }
}
