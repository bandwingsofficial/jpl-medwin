// src/modules/payment/infrastructure/persistence/prisma/mappers/payment.mapper.ts

import { Payment as PrismaPayment } from '@prisma/client';

import { Payment } from '@/modules/payment/domain/entities/payment.entity';
import { PaymentProvider } from '@/modules/payment/domain/enums/payment-provider.enum';
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum';
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum';

export class PaymentMapper {
  // =======================
  // 🗄 TO DOMAIN
  // =======================

  static toDomain(prisma: PrismaPayment): Payment {
    return new Payment({
      id: prisma.id,

      orderId: prisma.orderId,

      provider: prisma.provider as PaymentProvider,

      method: prisma.method as PaymentMethod | undefined,

      status: prisma.status as PaymentStatus,

      amount: Number(prisma.amount),

      currency: prisma.currency,

      refundedAmount: Number(prisma.refundedAmount),

      providerOrderId: prisma.providerOrderId ?? undefined,

      providerPaymentId: prisma.providerPaymentId ?? undefined,

      providerRefundId: prisma.providerRefundId ?? undefined,

      providerSignature: prisma.providerSignature ?? undefined,

      webhookEvent: prisma.webhookEvent ?? undefined,

      webhookPayload: prisma.webhookPayload as Record<string, any> | undefined,

      failureCode: prisma.failureCode ?? undefined,

      failureReason: prisma.failureReason ?? undefined,

      retryCount: prisma.retryCount,

      metadata: prisma.metadata as Record<string, any> | undefined,

      authorizedAt: prisma.authorizedAt ?? undefined,

      capturedAt: prisma.capturedAt ?? undefined,

      failedAt: prisma.failedAt ?? undefined,

      refundedAt: prisma.refundedAt ?? undefined,

      createdAt: prisma.createdAt,

      updatedAt: prisma.updatedAt,

      deletedAt: prisma.deletedAt ?? undefined,
    });
  }

  // =======================
  // 🧠 TO PERSISTENCE
  // =======================

  static toPersistence(payment: Payment) {
    return {
      id: payment.id,

      orderId: payment.orderId,

      provider: payment.provider,

      method: payment.method,

      status: payment.status,

      amount: payment.amount,

      currency: payment.currency,

      refundedAmount: payment.refundedAmount,

      providerOrderId: payment.providerOrderId,

      providerPaymentId: payment.providerPaymentId,

      providerRefundId: payment.providerRefundId,

      providerSignature: payment.providerSignature,

      webhookEvent: payment.webhookEvent,

      webhookPayload: payment.webhookPayload,

      failureCode: payment.failureCode,

      failureReason: payment.failureReason,

      retryCount: payment.retryCount,

      metadata: payment.metadata,

      authorizedAt: payment.authorizedAt,

      capturedAt: payment.capturedAt,

      failedAt: payment.failedAt,

      refundedAt: payment.refundedAt,

      createdAt: payment.createdAt,

      updatedAt: payment.updatedAt,

      deletedAt: payment.deletedAt,
    };
  }
}
