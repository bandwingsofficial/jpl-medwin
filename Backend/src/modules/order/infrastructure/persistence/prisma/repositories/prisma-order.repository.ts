// src/modules/order/infrastructure/persistence/prisma/repositories/prisma-order.repository.ts

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { OrderRepository } from '../../../../domain/repositories/order.repository';

import { Order } from '../../../../domain/entities/order.entity';

import { OrderStatus } from '../../../../domain/enums/order-status.enum';

import { PaymentStatus } from '../../../../domain/enums/payment-status.enum';

import { OrderMapper } from '../mappers/order.mapper';

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // 🔍 FIND
  // =======================

  async findById(id: string, tx: Prisma.TransactionClient = this.prisma): Promise<Order | null> {
    const order = await tx.order.findFirst({
  where: {
    id,
    deletedAt: null,
  },
  include: {
    returns: true,
  },
});

    return order ? OrderMapper.toDomain(order) : null;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const order = await this.prisma.order.findFirst({
      where: {
        orderNumber,

        deletedAt: null,
      },
    });

    return order ? OrderMapper.toDomain(order) : null;
  }

  async findByCheckoutSessionId(checkoutSessionId: string): Promise<Order | null> {
    const order = await this.prisma.order.findFirst({
      where: {
        checkoutSessionId,

        deletedAt: null,
      },
    });

    return order ? OrderMapper.toDomain(order) : null;
  }

  async findByCartId(cartId: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        cartId,

        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((o) => OrderMapper.toDomain(o));
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,

        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((o) => OrderMapper.toDomain(o));
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        status,

        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((o) => OrderMapper.toDomain(o));
  }

  async findPendingPaymentOrders(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        paymentStatus: PaymentStatus.PENDING,

        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((o) => OrderMapper.toDomain(o));
  }

  async findMany(params: {
    page?: number;

    limit?: number;

    search?: string;

    status?: OrderStatus;

    paymentStatus?: PaymentStatus;

    userId?: string;

    from?: Date;

    to?: Date;

    sortBy?: string;

    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    data: Order[];

    total: number;
  }> {
    const page = params.page ?? 1;

    const limit = params.limit ?? 10;

    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      deletedAt: null,
    };

    // =======================
    // 🔍 SEARCH
    // =======================

    if (params.search) {
      where.OR = [
        {
          orderNumber: {
            contains: params.search,
            mode: 'insensitive',
          },
        },

        {
          user: {
            is: {
              name: {
                contains: params.search,
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }

    // =======================
    // 📦 STATUS
    // =======================

    if (params.status) {
      where.status = params.status;
    }

    // =======================
    // 💳 PAYMENT STATUS
    // =======================

    if (params.paymentStatus) {
      where.paymentStatus = params.paymentStatus;
    }

    // =======================
    // 👤 USER
    // =======================

    if (params.userId) {
      where.userId = params.userId;
    }

    // =======================
    // 📅 DATE FILTER
    // =======================

    if (params.from || params.to) {
      where.createdAt = {
        ...(params.from && {
          gte: params.from,
        }),

        ...(params.to && {
          lte: params.to,
        }),
      };
    }

    // =======================
    // ↕️ SORTING
    // =======================

    const allowedSortFields = [
      'createdAt',
      'updatedAt',
      'orderNumber',
      'status',
      'paymentStatus',
      'totalAmount',
    ];

    const sortBy = allowedSortFields.includes(params.sortBy ?? '') ? params.sortBy! : 'createdAt';

    const sortOrder = params.sortOrder ?? 'desc';

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          [sortBy]: sortOrder,
        },

        include: {
          user: true,
        },
      }),

      this.prisma.order.count({
        where,
      }),
    ]);

    return {
      data: orders.map((o) => OrderMapper.toDomain(o)),

      total,
    };
  }

  // =======================
  // 🧠 CHECKS
  // =======================

  async existsByOrderNumber(orderNumber: string): Promise<boolean> {
    const count = await this.prisma.order.count({
      where: {
        orderNumber,

        deletedAt: null,
      },
    });

    return count > 0;
  }

  async existsByCheckoutSessionId(checkoutSessionId: string): Promise<boolean> {
    const count = await this.prisma.order.count({
      where: {
        checkoutSessionId,

        deletedAt: null,
      },
    });

    return count > 0;
  }

  // =======================
  // ✍️ WRITE
  // =======================

  async create(order: Order): Promise<Order> {
    const created = await this.prisma.order.create({
      data: OrderMapper.toPersistence(order),
    });

    return OrderMapper.toDomain(created);
  }

  async update(order: Order): Promise<Order> {
    const updated = await this.prisma.order.update({
      where: {
        id: order.id,
      },

      data: OrderMapper.toPersistence(order),
    });

    return OrderMapper.toDomain(updated);
  }

  async createMany(orders: Order[]): Promise<void> {
    if (!orders.length) {
      return;
    }

    await this.prisma.order.createMany({
      data: orders.map(OrderMapper.toPersistence),
    });
  }

  async updateMany(orders: Order[]): Promise<void> {
    await Promise.all(
      orders.map((order) =>
        this.prisma.order.update({
          where: {
            id: order.id,
          },

          data: OrderMapper.toPersistence(order),
        }),
      ),
    );
  }

  // =======================
  // 📦 STATUS
  // =======================

  async updateStatus(params: {
    orderId: string;

    status: OrderStatus;
  }): Promise<void> {
    await this.prisma.order.update({
      where: {
        id: params.orderId,
      },

      data: {
        status: params.status,
      },
    });
  }

  async confirm(orderId: string): Promise<void> {
    await this.updateStatus({
      orderId,

      status: OrderStatus.CONFIRMED,
    });
  }

  async process(orderId: string): Promise<void> {
    await this.updateStatus({
      orderId,

      status: OrderStatus.PROCESSING,
    });
  }

  async ship(orderId: string): Promise<void> {
    await this.prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        status: OrderStatus.SHIPPED,

        shippedAt: new Date(),
      },
    });
  }

  async deliver(orderId: string): Promise<void> {
    await this.prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        status: OrderStatus.DELIVERED,

        deliveredAt: new Date(),
      },
    });
  }

  async cancel(params: {
    orderId: string;

    reason?: string;
  }): Promise<void> {
    await this.prisma.order.update({
      where: {
        id: params.orderId,
      },

      data: {
        status: OrderStatus.CANCELLED,

        cancelledAt: new Date(),
      },
    });
  }

  async refund(orderId: string): Promise<void> {
    await this.prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        status: OrderStatus.REFUNDED,

        paymentStatus: PaymentStatus.REFUNDED,

        refundedAt: new Date(),
      },
    });
  }

  // =======================
  // 💳 PAYMENT
  // =======================

  async updatePaymentStatus(params: {
    orderId: string;

    paymentStatus: PaymentStatus;
  }): Promise<void> {
    await this.prisma.order.update({
      where: {
        id: params.orderId,
      },

      data: {
        paymentStatus: params.paymentStatus,
      },
    });
  }

  async markPaymentSuccess(orderId: string): Promise<void> {
    await this.prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        paymentStatus: PaymentStatus.SUCCESS,
      },
    });
  }

  async markPaymentFailed(orderId: string): Promise<void> {
    await this.prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        paymentStatus: PaymentStatus.FAILED,
      },
    });
  }

  // =======================
  // ❌ DELETE
  // =======================

  async softDelete(orderId: string): Promise<void> {
    await this.prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(orderId: string): Promise<void> {
    await this.prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        deletedAt: null,
      },
    });
  }

  // =======================
// 📊 DASHBOARD
// =======================

async findByPeriod(params: {
  from?: Date;

  to?: Date;
}): Promise<Order[]> {
  const orders =
    await this.prisma.order.findMany({
      where: {
        deletedAt: null,

        createdAt: {
          ...(params.from && {
            gte: params.from,
          }),

          ...(params.to && {
            lte: params.to,
          }),
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

  return orders.map(
    OrderMapper.toDomain,
  );
}

async countByStatus(params: {
  status: OrderStatus;

  from?: Date;

  to?: Date;
}): Promise<number> {
  return this.prisma.order.count({
    where: {
      deletedAt: null,

      status: params.status,

      createdAt: {
        ...(params.from && {
          gte: params.from,
        }),

        ...(params.to && {
          lte: params.to,
        }),
      },
    },
  });
}
}
