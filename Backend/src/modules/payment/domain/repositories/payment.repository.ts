// src/modules/payment/domain/repositories/payment.repository.ts

import { Payment } from '../entities/payment.entity';

import { PaymentStatus } from '../enums/payment-status.enum';

export abstract class PaymentRepository {
  // =======================
  // ✨ CREATE
  // =======================

  abstract create(payment: Payment): Promise<Payment>;

  // =======================
  // 💾 UPDATE
  // =======================

  abstract update(payment: Payment): Promise<Payment>;

  // =======================
  // 🔍 FIND BY ID
  // =======================

  abstract findById(id: string): Promise<Payment | null>;

  // =======================
  // 🔍 FIND BY ORDER
  // =======================

  abstract findByOrderId(orderId: string): Promise<Payment[]>;

  // =======================
  // 🔍 FIND SUCCESS PAYMENT
  // =======================

  abstract findSuccessfulPaymentByOrderId(orderId: string): Promise<Payment | null>;

  // =======================
  // 🔍 FIND BY PROVIDER PAYMENT ID
  // =======================

  abstract findByProviderPaymentId(providerPaymentId: string): Promise<Payment | null>;

  // =======================
  // 🔍 FIND BY PROVIDER ORDER ID
  // =======================

  abstract findByProviderOrderId(providerOrderId: string): Promise<Payment | null>;

  // =======================
  // 📦 FIND BY STATUS
  // =======================

  abstract findByStatus(status: PaymentStatus): Promise<Payment[]>;

  // =======================
  // 🗑 DELETE
  // =======================

  abstract softDelete(id: string): Promise<void>;
}
