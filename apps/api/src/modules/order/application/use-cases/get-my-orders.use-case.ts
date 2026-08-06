// src/modules/order/application/use-cases/get-my-orders.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { OrderRepository } from '../../domain/repositories/order.repository';

import { OrderItemRepository } from '../../domain/repositories/order-item.repository';

import { InvalidOrderOperationException } from '../../domain/exceptions/invalid-order-operation.exception';

import { ReturnRepository } from '@/modules/return/domain/repositories/return.repository';

import { OrderAddressResponseMapper } from '../mappers/order-address-response.mapper';

@Injectable()
export class GetMyOrdersUseCase {
  constructor(
    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,

    @Inject(TOKENS.ORDER_ITEM_REPO)
    private readonly orderItemRepo: OrderItemRepository,

    @Inject(TOKENS.RETURN_REPO)
    private readonly returnRepo: ReturnRepository,
  ) {}

  async execute(input: { userId: string }) {
    // =======================
    // ❌ INVALID REQUEST
    // =======================

    if (!input.userId) {
      throw new InvalidOrderOperationException({
        operation: 'get_my_orders',

        reason: 'userId is required',
      });
    }

    // =======================
    // 🔍 FIND ORDERS
    // =======================

    const orders = await this.orderRepo.findByUserId(input.userId);

    // =======================
    // 📦 LOAD ITEMS + RETURNS
    // =======================

    const data = await Promise.all(
      orders.map(async (order) => {
        const items = await this.orderItemRepo.findByOrderId(order.id);

        const latestReturn = await this.returnRepo.findLatestReturnByOrderId(order.id);

        const replacementOrder = latestReturn?.replacementOrderId
          ? await this.orderRepo.findById(latestReturn.replacementOrderId)
          : null;

        return {
          id: order.id,

          orderNumber: order.orderNumber,

          status: order.status,

          paymentStatus: order.paymentStatus,

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

          itemCount: items.length,

          totalQuantity: items.reduce((total, item) => total + item.quantity, 0),

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

          shipment: {
            shippedAt: order.shippedAt,

            deliveredAt: order.deliveredAt,
          },

          previewItems: items.slice(0, 3).map((item) => ({
            id: item.id,

            productName: item.productName,

            variantName: item.variantName,

            imageUrl: item.imageUrl,

            quantity: item.quantity,

            totalPrice: item.totalPrice,
          })),

          createdAt: order.createdAt,

          updatedAt: order.updatedAt,
        };
      }),
    );

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      success: true,

      data: {
        totalOrders: data.length,

        orders: data,
      },
    };
  }
}
