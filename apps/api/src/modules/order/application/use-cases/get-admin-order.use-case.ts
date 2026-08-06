// src/modules/order/application/use-cases/get-orders.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { OrderRepository } from '../../domain/repositories/order.repository';
import { ReturnRepository } from '@/modules/return/domain/repositories/return.repository';

import { OrderAddressResponseMapper } from '../mappers/order-address-response.mapper';

import { OrderStatus } from '../../domain/enums/order-status.enum';

import { PaymentStatus } from '../../domain/enums/payment-status.enum';

@Injectable()
export class GetOrdersUseCase {
  constructor(
    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,

    @Inject(TOKENS.RETURN_REPO)
    private readonly returnRepo: ReturnRepository,
  ) {}

  async execute(query: {
    page?: number;

    limit?: number;

    search?: string;

    status?: OrderStatus;

    paymentStatus?: PaymentStatus;

    from?: string;

    to?: string;

    sortBy?: string;

    sortOrder?: 'asc' | 'desc';
  }) {
    const page = Number(query.page ?? 1);

    const limit = Number(query.limit ?? 10);

    const result = await this.orderRepo.findMany({
      page,

      limit,

      search: query.search,

      status: query.status,

      paymentStatus: query.paymentStatus,

      from: query.from ? new Date(query.from) : undefined,

      to: query.to ? new Date(query.to) : undefined,

      sortBy: query.sortBy,

      sortOrder: query.sortOrder,
    });

    const data = await Promise.all(
      result.data.map(async (order) => {
        const latestReturn = await this.returnRepo.findLatestReturnByOrderId(order.id);

        const replacementOrder = latestReturn?.replacementOrderId
          ? await this.orderRepo.findById(latestReturn.replacementOrderId)
          : null;

        return {
          id: order.id,

          userId: order.userId,

          orderNumber: order.orderNumber,

          status: order.status,

          paymentStatus: order.paymentStatus,

          cartId: order.cartId,

          checkoutSessionId: order.checkoutSessionId,

          couponCode: order.couponCode,

          totals: {
            subtotal: order.subtotal,

            couponDiscount: order.couponDiscount,

            shippingCharge: order.shippingCharge,

            tax: order.tax,

            grandTotal: order.grandTotal,

            totalSavings: order.totalSavings,

            redeemedCoins: order.redeemedCoins,

            redeemedAmount: order.redeemedAmount,

            earnedCoins: order.earnedCoins,
          },

          ...OrderAddressResponseMapper.toOrderAddressFields(order),

          returnRequest: latestReturn
            ? {
                id: latestReturn.id,

                status: latestReturn.status,

                type: latestReturn.type,

                reason: latestReturn.reason,

                requestedAt: latestReturn.createdAt,

                replacementOrder: replacementOrder
                  ? {
                      id: replacementOrder.id,

                      orderNumber: replacementOrder.orderNumber,

                      status: replacementOrder.status,

                      createdAt: replacementOrder.createdAt,
                    }
                  : null,
              }
            : null,

          refund:
            order.status === OrderStatus.REFUNDED
              ? {
                  refundedAt: order.refundedAt,
                }
              : {},

          metadata:
            order.status === OrderStatus.REFUNDED
              ? order.metadata
              : {
                  checkoutSessionId: order.checkoutSessionId,
                },
        };
      }),
    );

    return {
      data,

      pagination: {
        total: result.total,

        page,

        limit,

        totalPages: Math.ceil(result.total / limit),
      },
    };
  }
}
