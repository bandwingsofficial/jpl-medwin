// src/modules/payment/infrastructure/persistence/prisma/repositories/prisma-payment.repository.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { PaymentRepository } from '@/modules/payment/domain/repositories/payment.repository';

import { Payment } from '@/modules/payment/domain/entities/payment.entity';

import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum';

import { PaymentMapper } from '../mappers/payment.mapper';

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // ✨ CREATE
  // =======================

  async create(payment: Payment): Promise<Payment> {
    const created = await this.prisma.payment.create({
      data: PaymentMapper.toPersistence(payment),
    });

    return PaymentMapper.toDomain(created);
  }

  // =======================
  // 💾 UPDATE
  // =======================

  async update(payment: Payment): Promise<Payment> {
    const updated = await this.prisma.payment.update({
      where: {
        id: payment.id,
      },

      data: PaymentMapper.toPersistence(payment),
    });

    return PaymentMapper.toDomain(updated);
  }

  // =======================
  // 🔍 FIND BY ID
  // =======================

  async findById(id: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findFirst({
      where: {
        id,

        deletedAt: null,
      },
    });

    return payment ? PaymentMapper.toDomain(payment) : null;
  }

  // =======================
  // 🔍 FIND BY ORDER ID
  // =======================

  async findByOrderId(orderId: string): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany({
      where: {
        orderId,

        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return payments.map(PaymentMapper.toDomain);
  }

  // =======================
  // 🔍 FIND SUCCESSFUL PAYMENT
  // =======================

  async findSuccessfulPaymentByOrderId(orderId: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findFirst({
      where: {
        orderId,

        deletedAt: null,

        status: PaymentStatus.SUCCESS,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return payment ? PaymentMapper.toDomain(payment) : null;
  }

  // =======================
  // 🔍 FIND BY PROVIDER PAYMENT ID
  // =======================

  async findByProviderPaymentId(providerPaymentId: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findFirst({
      where: {
        providerPaymentId,

        deletedAt: null,
      },
    });

    return payment ? PaymentMapper.toDomain(payment) : null;
  }

  // =======================
  // 🔍 FIND BY PROVIDER ORDER ID
  // =======================

  async findByProviderOrderId(providerOrderId: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findFirst({
      where: {
        providerOrderId,

        deletedAt: null,
      },
    });

    return payment ? PaymentMapper.toDomain(payment) : null;
  }

  // =======================
  // 📦 FIND BY STATUS
  // =======================

  async findByStatus(status: PaymentStatus): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany({
      where: {
        status,

        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return payments.map(PaymentMapper.toDomain);
  }

  // =======================
  // 🗑 SOFT DELETE
  // =======================

  async softDelete(id: string): Promise<void> {
    await this.prisma.payment.update({
      where: { id },

      data: {
        deletedAt: new Date(),
      },
    });
  }
}
