// src/modules/checkout-session/application/use-cases/get-admin-abandoned-checkout-by-id.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { CheckoutSessionNotFoundException } from '../../domain/exceptions/checkout-session-not-found.exception';
import { CheckoutSessionStatus } from '../../domain/enums/checkout-session-status.enum';
import { ProductS3ImageResolverService } from '@/modules/product/application/services/product-s3-image-resolver.service';
import { TOKENS } from '@/common/constants/tokens';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';

@Injectable()
export class GetAdminAbandonedCheckoutByIdUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productS3ImageResolver: ProductS3ImageResolverService,
    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(input: { checkoutSessionId: string }) {
    const session = await this.prisma.checkoutSession.findFirst({
      where: {
        id: input.checkoutSessionId,
        deletedAt: null,
      },
      include: {
        items: true,
        orders: {
          where: {
            deletedAt: null,
          },
        },
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
    });

    if (!session) {
      throw new CheckoutSessionNotFoundException({
        checkoutSessionId: input.checkoutSessionId,
      });
    }

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

    const items = session.items ?? [];
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    const now = Date.now();
    const isExpired = session.expiresAt ? session.expiresAt.getTime() < now : false;

    let effectiveStatus = session.status;
    if (session.status === CheckoutSessionStatus.ACTIVE && isExpired) {
      effectiveStatus = CheckoutSessionStatus.EXPIRED;
    }

    // Resolve images and product details (e.g. weights) for each item
    const itemsWithDetails = await Promise.all(
      items.map(async (item) => {
        const product = await this.productRepo.findById(item.productId);

        let resolvedImage = item.imageUrl || null;
        try {
          const s3Images = await this.productS3ImageResolver.resolveProductImages(item.productName);
          if (item.variantName) {
            const variantImages = await this.productS3ImageResolver.resolveVariantImages(
              item.productName,
              item.variantName,
              s3Images,
            );
            resolvedImage = variantImages?.mainImage || s3Images.mainImage || item.imageUrl || null;
          } else {
            resolvedImage = s3Images.mainImage || item.imageUrl || null;
          }
        } catch {
          // Fallback to item.imageUrl if S3 resolver fails
          resolvedImage = item.imageUrl || null;
        }

        const mrp = Number(item.mrp ?? item.price);
        const price = Number(item.price);
        const totalPrice = Number(item.totalPrice ?? price * item.quantity);
        const mrpTotal = mrp * item.quantity;
        const discount = Math.max(mrpTotal - totalPrice, 0);

        return {
          id: item.id,
          checkoutSessionId: item.checkoutSessionId,
          productId: item.productId,
          variantId: item.variantId,
          productName: item.productName,
          variantName: item.variantName ?? null,
          sku: item.sku ?? null,
          imageUrl: resolvedImage,
          quantity: item.quantity,
          unitPrice: price,
          mrp,
          totalPrice,
          mrpTotal,
          discount,
          isOverweight: product?.isOverweight ?? false,
          weightKg: product?.weightKg ?? null,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      }),
    );

    return {
      id: session.id,
      cartId: session.cartId,
      userId: session.userId || user?.id || null,
      guestId: session.guestId || null,
      status: effectiveStatus,
      rawStatus: session.status,
      isExpired,
      couponCode: session.couponCode ?? null,

      customer: {
        id: user?.id || session.userId || session.guestId || 'GUEST',
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
      },

      items: itemsWithDetails,

      summary: {
        totalProducts: items.length,
        totalQuantity,
        subtotal: Number(session.subtotal ?? 0),
        shippingCharge: Number(session.shippingCharge ?? 0),
        overweightDeliveryCharge: Number(session.overweightDeliveryCharge ?? 0),
        couponDiscount: Number(session.couponDiscount ?? 0),
        rewardCoinsUsed: Number(session.rewardCoinsUsed ?? 0),
        rewardDiscount: Number(session.rewardDiscount ?? 0),
        tax: Number(session.tax ?? 0),
        totalSavings: Number(session.totalSavings ?? 0),
        grandTotal: Number(session.grandTotal ?? 0),
      },

      hasCompletedOrder: session.orders.length > 0,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      expiresAt: session.expiresAt,
    };
  }
}
