// src/modules/checkout-session/infrastructure/persistence/prisma/repositories/prisma-checkout-session.repository.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { CheckoutSessionRepository } from '../../../../domain/repositories/checkout-session.repository';

import { CheckoutSession } from '../../../../domain/entities/checkout-session.entity';

import { CheckoutSessionStatus } from '../../../../domain/enums/checkout-session-status.enum';

import { CheckoutSessionMapper } from '../mappers/checkout-session.mapper';

@Injectable()
export class PrismaCheckoutSessionRepository implements CheckoutSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // 🔍 FIND
  // =======================

  async findById(id: string): Promise<CheckoutSession | null> {
    const data = await this.prisma.checkoutSession.findFirst({
      where: {
        id,

        deletedAt: null,
      },
    });

    return data ? CheckoutSessionMapper.toDomain(data) : null;
  }

  async findActiveByCartId(cartId: string): Promise<CheckoutSession | null> {
    const data = await this.prisma.checkoutSession.findFirst({
      where: {
        cartId,

        status: CheckoutSessionStatus.ACTIVE,

        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return data ? CheckoutSessionMapper.toDomain(data) : null;
  }

  async findByCartId(cartId: string): Promise<CheckoutSession[]> {
    const data = await this.prisma.checkoutSession.findMany({
      where: {
        cartId,

        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map((item) => CheckoutSessionMapper.toDomain(item));
  }

  async findByUserId(userId: string): Promise<CheckoutSession[]> {
    const data = await this.prisma.checkoutSession.findMany({
      where: {
        userId,

        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map((item) => CheckoutSessionMapper.toDomain(item));
  }

  async findByGuestId(guestId: string): Promise<CheckoutSession[]> {
    const data = await this.prisma.checkoutSession.findMany({
      where: {
        guestId,

        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map((item) => CheckoutSessionMapper.toDomain(item));
  }

  async findExpiredSessions(): Promise<CheckoutSession[]> {
    const data = await this.prisma.checkoutSession.findMany({
      where: {
        status: CheckoutSessionStatus.ACTIVE,

        expiresAt: {
          lt: new Date(),
        },

        deletedAt: null,
      },
    });

    return data.map((item) => CheckoutSessionMapper.toDomain(item));
  }

  // =======================
  // 🧠 CHECKS
  // =======================

  async existsActiveSessionByCartId(cartId: string): Promise<boolean> {
    const count = await this.prisma.checkoutSession.count({
      where: {
        cartId,

        status: CheckoutSessionStatus.ACTIVE,

        deletedAt: null,
      },
    });

    return count > 0;
  }

  // =======================
  // ✍️ WRITE
  // =======================

  async create(session: CheckoutSession): Promise<CheckoutSession> {
    const data = await this.prisma.checkoutSession.create({
      data: CheckoutSessionMapper.toPersistence(session),
    });

    return CheckoutSessionMapper.toDomain(data);
  }

  async update(session: CheckoutSession): Promise<CheckoutSession> {
    const data = await this.prisma.checkoutSession.update({
      where: {
        id: session.id,
      },

      data: CheckoutSessionMapper.toPersistence(session),
    });

    return CheckoutSessionMapper.toDomain(data);
  }

  // =======================
  // 🔄 STATUS
  // =======================

  async updateStatus(params: {
    checkoutSessionId: string;

    status: CheckoutSessionStatus;
  }): Promise<void> {
    await this.prisma.checkoutSession.update({
      where: {
        id: params.checkoutSessionId,
      },

      data: {
        status: params.status,
      },
    });
  }

  async complete(checkoutSessionId: string): Promise<void> {
    await this.prisma.checkoutSession.update({
      where: {
        id: checkoutSessionId,
      },

      data: {
        status: CheckoutSessionStatus.COMPLETED,

        completedAt: new Date(),
      },
    });
  }

  async fail(checkoutSessionId: string): Promise<void> {
    await this.prisma.checkoutSession.update({
      where: {
        id: checkoutSessionId,
      },

      data: {
        status: CheckoutSessionStatus.FAILED,

        failedAt: new Date(),
      },
    });
  }

  async expire(checkoutSessionId: string): Promise<void> {
    await this.prisma.checkoutSession.update({
      where: {
        id: checkoutSessionId,
      },

      data: {
        status: CheckoutSessionStatus.EXPIRED,
      },
    });
  }

  // =======================
  // ❌ DELETE
  // =======================

  async softDelete(checkoutSessionId: string): Promise<void> {
    await this.prisma.checkoutSession.update({
      where: {
        id: checkoutSessionId,
      },

      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(checkoutSessionId: string): Promise<void> {
    await this.prisma.checkoutSession.update({
      where: {
        id: checkoutSessionId,
      },

      data: {
        deletedAt: null,
      },
    });
  }
}
