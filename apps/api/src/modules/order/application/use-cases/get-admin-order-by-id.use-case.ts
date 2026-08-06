// src/modules/order/application/use-cases/get-order-by-id.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { OrderRepository } from '../../domain/repositories/order.repository';
import { ReturnRepository } from '@/modules/return/domain/repositories/return.repository';
import { OrderItemRepository } from '../../domain/repositories/order-item.repository';

import { OrderNotFoundException } from '../../domain/exceptions/order-not-found.exception';

import { OrderSummaryService } from '../services/order-summary.service';

import { OrderAddressResponseMapper } from '../mappers/order-address-response.mapper';

@Injectable()
export class GetOrderByIdUseCase {
  constructor(
    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,

    @Inject(TOKENS.ORDER_ITEM_REPO)
    private readonly orderItemRepo: OrderItemRepository,

    @Inject(TOKENS.RETURN_REPO)
    private readonly returnRepo: ReturnRepository,

    private readonly summaryService: OrderSummaryService,
  ) {}

  async execute(input: { orderId: string }) {
    const order = await this.orderRepo.findById(input.orderId);

    if (!order) {
      throw new OrderNotFoundException({
        orderId: input.orderId,
      });
    }

    const latestReturn = await this.returnRepo.findLatestReturnByOrderId(order.id);

    const replacementOrder = latestReturn?.replacementOrderId
      ? await this.orderRepo.findById(latestReturn.replacementOrderId)
      : null;

    const items = await this.orderItemRepo.findByOrderId(order.id);

    const summary = this.summaryService.build({
      items,

      couponDiscount: order.couponDiscount,

      shippingCharge: order.shippingCharge,

      tax: order.tax,
    });

    return {
      id: order.id,

      userId: order.userId,

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

      shipment: {
        trackingId: order.trackingId,

        courierName: order.courierName,

        shippedAt: order.shippedAt,

        deliveredAt: order.deliveredAt,
      },

      cancellation: {
        cancelledAt: order.cancelledAt,
      },

      refund:
        order.status === 'REFUNDED'
          ? {
              refundedAt: order.refundedAt,
            }
          : {},

      notes: {
        customerNote: order.customerNote,

        adminNote: order.adminNote,
      },

      items: items.map((item) => {
        const mrp = item.mrp ?? item.price;

        const mrpTotal = item.totalMrp ?? mrp * item.quantity;

        const discount = item.totalSavings ?? mrpTotal - item.totalPrice;

        return {
          id: item.id,

          orderId: item.orderId,

          productId: item.productId,

          variantId: item.variantId,

          productName: item.productName,

          variant: {
            id: item.variantId,

            name: item.variantName,

            sku: item.sku,

            quantity: item.quantity,

            pricing: {
              sellingPrice: item.price,

              mrp,
            },

            images: {
              main: item.imageUrl,
            },
          },

          totals: {
            subtotal: item.totalPrice,

            mrpTotal,

            discount,
          },
        };
      }),

      summary,

      metadata:
        order.status === 'REFUNDED'
          ? order.metadata
          : {
              checkoutSessionId: order.checkoutSessionId,
            },

      timeline: {
        createdAt: order.createdAt,

        updatedAt: order.updatedAt,

        shippedAt: order.shippedAt,

        deliveredAt: order.deliveredAt,

        cancelledAt: order.cancelledAt,

        refundedAt: order.status === 'REFUNDED' ? order.refundedAt : undefined,
      },

      createdAt: order.createdAt,

      updatedAt: order.updatedAt,
    };
  }
}
