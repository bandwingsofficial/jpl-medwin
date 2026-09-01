// src/modules/order/application/use-cases/get-order.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { OrderRepository } from '../../domain/repositories/order.repository';
import { ProductS3ImageResolverService } from '@/modules/product/application/services/product-s3-image-resolver.service';
import { OrderItemRepository } from '../../domain/repositories/order-item.repository';

import { OrderNotFoundException } from '../../domain/exceptions/order-not-found.exception';

import { InvalidOrderOperationException } from '../../domain/exceptions/invalid-order-operation.exception';

import { OrderOwnershipService } from '../services/order-ownership.service';

import { OrderSummaryService } from '../services/order-summary.service';

import { OrderAddressResponseMapper } from '../mappers/order-address-response.mapper';

import { ReturnRepository } from '@/modules/return/domain/repositories/return.repository';

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,

    @Inject(TOKENS.ORDER_ITEM_REPO)
    private readonly orderItemRepo: OrderItemRepository,

    @Inject(TOKENS.RETURN_REPO)
    private readonly returnRepo: ReturnRepository,

    private readonly ownershipService: OrderOwnershipService,
    private readonly productS3ImageResolver: ProductS3ImageResolverService,
    private readonly summaryService: OrderSummaryService,
  ) {}

  async execute(input: {
    orderId: string;

    userId: string;
  }) {
    // =======================
    // 🔍 FIND ORDER
    // =======================

    const order = await this.orderRepo.findById(input.orderId);

    if (!order) {
      throw new OrderNotFoundException({
        orderId: input.orderId,
      });
    }

    // =======================
    // 🔄 ACTIVE RETURN
    // =======================

    const latestReturn = await this.returnRepo.findLatestReturnByOrderId(order.id);

    // =======================
    // 🔄 REPLACEMENT ORDER DETAILS
    // =======================

    const replacementOrder = latestReturn?.replacementOrderId
      ? await this.orderRepo.findById(latestReturn.replacementOrderId)
      : null;

    // =======================
    // 🔐 OWNERSHIP
    // =======================

    const canAccess = this.ownershipService.canAccess({
      order,

      userId: input.userId,
    });

    if (!canAccess) {
      throw new InvalidOrderOperationException({
        orderId: order.id,

        operation: 'view',

        reason: 'Unauthorized access to order',
      });
    }

    // =======================
    // 📦 ITEMS
    // =======================

    const items = await this.orderItemRepo.findByOrderId(order.id);
    const itemsWithImages = await Promise.all(
  items.map(async (item) => {
    const productImages =
      await this.productS3ImageResolver.resolveProductImages(
        item.productName,
      );

    const variantImages =
      item.variantName
        ? await this.productS3ImageResolver.resolveVariantImages(
            item.productName,
            item.variantName,
            productImages,
          )
        : null;

    return {
      item,
      imageUrl:
        variantImages?.mainImage ||
        productImages.mainImage ||
        item.imageUrl ||
        null,
    };
  }),
);

    // =======================
    // 💰 SUMMARY
    // =======================

    const summary = this.summaryService.build({
      items,

      couponDiscount: order.couponDiscount,

      shippingCharge: order.shippingCharge,

      overweightDeliveryCharge: order.overweightDeliveryCharge,

      tax: order.tax,
    });

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: order.id,

      orderNumber: order.orderNumber,

      status: order.status,

      paymentStatus: order.paymentStatus,

      paymentMethod:
        (order.metadata as any)?.paymentMethod ??
        (order.paymentStatus === 'PENDING' ? 'COD' : 'ONLINE'),

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

      gstNumber: order.gstNumber ?? null,

      totals: {
        subtotal: order.subtotal,

        couponDiscount: order.couponDiscount,

        shippingCharge: order.shippingCharge,

        overweightDeliveryCharge: order.overweightDeliveryCharge,

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

      cancelledAt: order.cancelledAt,

      cancellationReason:
        order.cancellationReason ??
        (order.metadata as any)?.cancellationReason ??
        null,

      cancelledBy:
        order.cancelledBy ??
        (order.metadata as any)?.cancelledBy ??
        null,

      cancellation: {
        cancelledAt: order.cancelledAt,
        reason:
          order.cancellationReason ??
          (order.metadata as any)?.cancellationReason ??
          null,
        cancelledBy:
          order.cancelledBy ??
          (order.metadata as any)?.cancelledBy ??
          null,
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

        gstNumber: order.gstNumber ?? null,
      },

      items: itemsWithImages.map(({ item, imageUrl }) => {
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
  main: imageUrl,
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
              paymentMethod:
                (order.metadata as any)?.paymentMethod ??
                (order.paymentStatus === 'PENDING' ? 'COD' : 'ONLINE'),
              ...order.metadata,
            },

      createdAt: order.createdAt,

      updatedAt: order.updatedAt,
    };
  }
}
