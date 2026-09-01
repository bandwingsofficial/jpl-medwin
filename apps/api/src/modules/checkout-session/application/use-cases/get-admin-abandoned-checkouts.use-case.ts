// src/modules/checkout-session/application/use-cases/get-admin-abandoned-checkouts.use-case.ts

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { CheckoutSessionStatus } from '../../domain/enums/checkout-session-status.enum';
import { OrderStatus } from '@/modules/order/domain/enums/order-status.enum';

@Injectable()
export class GetAdminAbandonedCheckoutsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    from?: string;
    to?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = Math.max(Number(query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(query.limit ?? 10), 1), 100);
    const search = query.search?.trim();
    const status = query.status?.trim()?.toUpperCase();

    // =========================================
    // BASE FILTER: Abandoned Checkouts
    // =========================================
    // 1. Checkout session exists and is not soft deleted
    // 2. Status is not COMPLETED
    // 3. Has checkout items
    // 4. No successful/active order associated with this checkout session
    // =========================================
    const where: Prisma.CheckoutSessionWhereInput = {
      deletedAt: null,
      status: {
        not: CheckoutSessionStatus.COMPLETED,
      },
      items: {
        some: {},
      },
      orders: {
        none: {
          deletedAt: null,
          status: {
            notIn: [OrderStatus.CANCELLED],
          },
        },
      },
    };

    // =========================================
    // STATUS FILTER
    // =========================================
    if (status && Object.values(CheckoutSessionStatus).includes(status as CheckoutSessionStatus)) {
      where.status = status as CheckoutSessionStatus;
    }

    // =========================================
    // SEARCH FILTER
    // =========================================
    if (search) {
      where.OR = [
        {
          id: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          cart: {
            user: {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  profile: {
                    name: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                },
                {
                  profile: {
                    email: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                },
                {
                  profile: {
                    phoneNumber: {
                      contains: search,
                    },
                  },
                },
                {
                  identities: {
                    some: {
                      value: {
                        contains: search,
                        mode: 'insensitive',
                      },
                      deletedAt: null,
                    },
                  },
                },
              ],
            },
          },
        },
      ];
    }

    // =========================================
    // DATE FILTER
    // =========================================
    if (query.from || query.to) {
      where.createdAt = {
        ...(query.from && {
          gte: new Date(query.from),
        }),
        ...(query.to && {
          lte: new Date(query.to),
        }),
      };
    }

    // =========================================
    // SORTING
    // =========================================
    const allowedSortFields = ['createdAt', 'updatedAt', 'grandTotal', 'status'];
    const sortField = query.sortBy && allowedSortFields.includes(query.sortBy)
      ? query.sortBy
      : 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

    // =========================================
    // DB QUERY
    // =========================================
    const [sessions, total] = await Promise.all([
      this.prisma.checkoutSession.findMany({
        where,
        include: {
          items: true,
          cart: {
            include: {
              user: {
                include: {
                  profile: true,
                  identities: {
                    where: { deletedAt: null },
                  },
                },
              },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortField]: sortOrder,
        },
      }),
      this.prisma.checkoutSession.count({ where }),
    ]);

    // =========================================
    // DATA MAPPING
    // =========================================
    const now = Date.now();
    const data = sessions.map((session) => {
      const user = session.cart?.user;
      const customerName =
        user?.profile?.name || user?.name || (session.guestId ? 'Guest Customer' : 'Customer');
      const customerEmail =
        user?.profile?.email ||
        user?.identities?.find((i) => i.type === 'EMAIL')?.value ||
        null;
      const customerPhone =
        user?.profile?.phoneNumber ||
        user?.identities?.find((i) => i.type === 'PHONE')?.value ||
        'No phone';

      const totalQuantity = (session.items ?? []).reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      const totalProducts = (session.items ?? []).length;

      const isExpired = session.expiresAt ? session.expiresAt.getTime() < now : false;

      // Determine effective status: if ACTIVE but expired time passed, can reflect status
      let effectiveStatus = session.status;
      if (session.status === CheckoutSessionStatus.ACTIVE && isExpired) {
        effectiveStatus = CheckoutSessionStatus.EXPIRED;
      }

      return {
        id: session.id,
        cartId: session.cartId,
        userId: session.userId || user?.id || null,
        guestId: session.guestId || null,
        status: effectiveStatus,
        rawStatus: session.status,
        isExpired,
        couponCode: session.couponCode,
        customer: {
          id: user?.id || session.userId || session.guestId || 'GUEST',
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
        },
        totalProducts,
        totalQuantity,
        totals: {
          subtotal: Number(session.subtotal ?? 0),
          shippingCharge: Number(session.shippingCharge ?? 0),
          overweightDeliveryCharge: Number(session.overweightDeliveryCharge ?? 0),
          couponDiscount: Number(session.couponDiscount ?? 0),
          rewardDiscount: Number(session.rewardDiscount ?? 0),
          rewardCoinsUsed: Number(session.rewardCoinsUsed ?? 0),
          tax: Number(session.tax ?? 0),
          grandTotal: Number(session.grandTotal ?? 0),
          totalSavings: Number(session.totalSavings ?? 0),
        },
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        expiresAt: session.expiresAt,
      };
    });

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}
