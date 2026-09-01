import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { PrismaService } from './../../infrastructure/prisma/prisma.service';

import {
  renderOrderDetailsEmail,
} from './order-details-email.template';

import { BrevoService } from './brevo.service';

import { OrderDetailsPdfService } from './order-details-pdf.service';

@Injectable()
export class OrderNotificationService {
  private readonly logger = new Logger(
    OrderNotificationService.name,
  );

  private readonly notificationEmail: string;

  constructor(
    private readonly brevoService: BrevoService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly orderDetailsPdfService: OrderDetailsPdfService,
  ) {
    this.notificationEmail =
      this.configService.get<string>(
        'ORDER_NOTIFICATION_EMAIL',
      ) ?? 'connect@jplmedwin.com';
  }

  async sendNewOrderNotification(
    orderId: string,
  ): Promise<void> {
    try {
      // =========================================
      // GET COMPLETE ORDER
      // =========================================

      const order =
        await this.prisma.order.findUnique({
          where: {
            id: orderId,
          },
          include: {
            items: true,
            shippingAddress: true,
            billingAddress: true,
            payments: true,
          },
        });

      if (!order) {
        this.logger.warn(
          `Order not found for email notification: ${orderId}`,
        );

        return;
      }

      // =========================================
      // CUSTOMER
      // =========================================

      let customerName = 'Customer';
      let customerEmail: string | undefined;

      if (order.userId) {
        const customer =
          await this.prisma.user.findUnique({
            where: {
              id: order.userId,
            },
            include: {
              profile: true,
              identities: {
                where: {
                  deletedAt: null,
                },
              },
            },
          });

        if (customer) {
          customerName =
            customer.name ??
            customer.profile?.name ??
            'Customer';

          customerEmail =
            customer.profile?.email ??
            customer.identities?.find(
              (identity) =>
                identity.type === 'EMAIL',
            )?.value;
        }
      }

      // =========================================
      // PAYMENT METHOD
      // =========================================
      // Payment method is stored in order.metadata
      // by CreateOrderFromCheckoutUseCase.
      //
      // For additional safety, check actual Payment
      // records as fallback.
      // =========================================

      const metadata =
        order.metadata &&
        typeof order.metadata === 'object' &&
        !Array.isArray(order.metadata)
          ? (order.metadata as Record<string, unknown>)
          : {};

      const paymentMethodFromMetadata =
        typeof metadata.paymentMethod === 'string'
          ? metadata.paymentMethod
          : undefined;

      const paymentMethodFromPayment =
        order.payments?.find(
          (payment) => payment.method,
        )?.method ?? undefined;

      const paymentMethod =
        paymentMethodFromMetadata ??
        paymentMethodFromPayment ??
        'N/A';

      // =========================================
      // GST NUMBER
      // =========================================

      const gstNumber =
        order.gstNumber?.trim() || 'N/A';

      // =========================================
      // ORDER TOTALS
      // =========================================

      const subtotal =
        Number(order.subtotal ?? 0);

      const couponDiscount =
        Number(order.couponDiscount ?? 0);

      const shippingCharge =
        Number(order.shippingCharge ?? 0);

      const overweightDeliveryCharge =
        Number(
          order.overweightDeliveryCharge ?? 0,
        );

      const tax =
        Number(order.tax ?? 0);

      const grandTotal =
        Number(order.grandTotal ?? 0);

      const totalSavings =
        Number(order.totalSavings ?? 0);

      const redeemedCoins =
        Number(order.redeemedCoins ?? 0);

      const redeemedAmount =
        Number(order.redeemedAmount ?? 0);

      const earnedCoins =
        Number(order.earnedCoins ?? 0);

      // =========================================
      // ORDER ITEMS
      // =========================================
      // IMPORTANT:
      // Use OrderItem snapshot fields directly.
      // Do NOT expect variant/pricing/images nested
      // inside OrderItem.
      // =========================================

      const items = order.items.map((item) => {
        const quantity =
          Number(item.quantity ?? 0);

        const price =
          Number(item.price ?? 0);

        const mrp =
          Number(item.mrp ?? item.price ?? 0);

        const totalPrice =
          Number(
            item.totalPrice ??
              price * quantity,
          );

        const totalMrp =
          Number(
            item.totalMrp ??
              mrp * quantity,
          );

        const itemSavings =
          Number(
            item.totalSavings ??
              Math.max(
                totalMrp - totalPrice,
                0,
              ),
          );

        return {
          id: item.id,

          orderId: item.orderId,

          productId: item.productId,

          variantId: item.variantId,

          productName:
            item.productName,

          variantName:
            item.variantName ?? null,

          sku:
            item.sku ?? null,

          imageUrl:
            item.imageUrl ?? null,

          quantity,

          price,

          mrp,

          totalPrice,

          totalMrp,

          totalSavings:
            itemSavings,
        };
      });

      // =========================================
      // ITEM SUMMARY
      // =========================================

      const totalProducts =
        items.length;

      const totalQuantity =
        items.reduce(
          (total, item) =>
            total + item.quantity,
          0,
        );

      const mrpTotal =
        items.reduce(
          (total, item) =>
            total + item.totalMrp,
          0,
        );

      const productDiscount =
        items.reduce(
          (total, item) =>
            total + item.totalSavings,
          0,
        );

      // =========================================
      // FREE SHIPPING
      // =========================================

      const shippingConfiguration =
        await this.prisma.shippingConfiguration.findFirst({
          where: {
            isActive: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

      const isFreeShipping =
        Number(shippingCharge) === 0;

      // =========================================
      // NORMALIZED DATA FOR TEMPLATE + PDF
      // =========================================

      const orderDetails = {
        id: order.id,

        orderNumber:
          order.orderNumber,

        status:
          order.status,

        paymentStatus:
          order.paymentStatus,

        paymentMethod,

        cartId:
          order.cartId,

        checkoutSessionId:
          order.checkoutSessionId,

        gstNumber:
          order.gstNumber,

        customerNote:
          order.customerNote,

        adminNote:
          order.adminNote,

        metadata:
          metadata,

        shippingAddress:
          order.shippingAddress,

        billingAddress:
          order.billingAddress,

        shippingAddressSnapshot:
          order.shippingAddressSnapshot,

        billingAddressSnapshot:
          order.billingAddressSnapshot,

        createdAt:
          order.createdAt,

        updatedAt:
          order.updatedAt,

        grandTotal,

        items: items.map((item) => ({
          id: item.id,

          orderId: item.orderId,

          productId: item.productId,

          variantId: item.variantId,

          productName:
            item.productName,

          variant: {
            id: item.variantId,

            name:
              item.variantName,

            sku:
              item.sku,

            quantity:
              item.quantity,

            pricing: {
              sellingPrice:
                item.price,

              mrp:
                item.mrp,
            },

            images: {
              main:
                item.imageUrl,
            },
          },

          quantity:
            item.quantity,

          variantName:
            item.variantName,

          totalPrice:
            item.totalPrice,

          totals: {
            subtotal:
              item.totalPrice,

            mrpTotal:
              item.totalMrp,

            discount:
              item.totalSavings,
          },
        })),

        totals: {
          subtotal,

          couponDiscount,

          shippingCharge,

          overweightDeliveryCharge,

          tax,

          grandTotal,

          totalSavings,

          redeemedCoins,

          redeemedAmount,

          earnedCoins,
        },

        summary: {
          totalProducts,

          totalQuantity,

          subtotal,

          mrpTotal,

          productDiscount,

          couponDiscount,

          rewardDiscount:
            redeemedAmount,

          totalSavings,

          shipping:
            shippingCharge,

          overweightDeliveryCharge,

          tax,

          grandTotal,

          isFreeShipping,
        },
      };

      // =========================================
      // EMAIL SUBJECT
      // =========================================

      const subject =
        `New Order Received - ${order.orderNumber}`;

      // =========================================
      // HTML EMAIL
      // =========================================

      const htmlContent =
        renderOrderDetailsEmail({
          order:
            orderDetails as any,

          customerName,

          customerEmail,
        });

      // =========================================
      // TEXT EMAIL
      // =========================================

      const textContent = `
New Order Received

========================================
ORDER INFORMATION
========================================

Order Number:
${order.orderNumber}

Order ID:
${order.id}

Status:
${order.status}

Payment Status:
${order.paymentStatus}

Payment Method:
${paymentMethod}

GST Number:
${gstNumber}

Created At:
${new Date(
  order.createdAt,
).toLocaleString('en-IN')}

========================================
CUSTOMER INFORMATION
========================================

Customer:
${customerName}

Customer Email:
${customerEmail ?? 'Not available'}

========================================
SHIPPING ADDRESS
========================================

${
  order.shippingAddress
    ? `
Name:
${order.shippingAddress.fullName ?? ''}

Phone:
${order.shippingAddress.phoneNumber ?? ''}

Address Type:
${order.shippingAddress.type ?? ''}

Address Title:
${order.shippingAddress.alias ?? ''}

Address Line 1:
${order.shippingAddress.addressLine1 ?? ''}

Address Line 2:
${order.shippingAddress.addressLine2 ?? ''}

Landmark:
${order.shippingAddress.landmark ?? ''}

City:
${order.shippingAddress.city ?? ''}

State:
${order.shippingAddress.state ?? ''}

Country:
${order.shippingAddress.country ?? ''}

Postal Code:
${order.shippingAddress.postalCode ?? ''}

Latitude:
${order.shippingAddress.latitude ?? ''}

Longitude:
${order.shippingAddress.longitude ?? ''}
`
    : 'Shipping address not available.'
}

========================================
BILLING ADDRESS
========================================

${
  order.billingAddress
    ? `
Name:
${order.billingAddress.fullName ?? ''}

Phone:
${order.billingAddress.phoneNumber ?? ''}

Address Type:
${order.billingAddress.type ?? ''}

Address Title:
${order.billingAddress.alias ?? ''}

Address Line 1:
${order.billingAddress.addressLine1 ?? ''}

Address Line 2:
${order.billingAddress.addressLine2 ?? ''}

Landmark:
${order.billingAddress.landmark ?? ''}

City:
${order.billingAddress.city ?? ''}

State:
${order.billingAddress.state ?? ''}

Country:
${order.billingAddress.country ?? ''}

Postal Code:
${order.billingAddress.postalCode ?? ''}

Latitude:
${order.billingAddress.latitude ?? ''}

Longitude:
${order.billingAddress.longitude ?? ''}
`
    : 'Billing address not available.'
}

========================================
ORDER ITEMS
========================================

${items
  .map(
    (item, index) => `
Item ${index + 1}

Product:
${item.productName}

Variant:
${item.variantName ?? 'N/A'}

SKU:
${item.sku ?? 'N/A'}

Product ID:
${item.productId}

Variant ID:
${item.variantId}

Quantity:
${item.quantity}

MRP:
₹${item.mrp.toLocaleString('en-IN')}

Selling Price:
₹${item.price.toLocaleString('en-IN')}

Discount:
₹${item.totalSavings.toLocaleString('en-IN')}

Subtotal:
₹${item.totalPrice.toLocaleString('en-IN')}

Image:
${item.imageUrl ?? 'N/A'}

----------------------------------------
`,
  )
  .join('\n')}

========================================
ORDER SUMMARY
========================================

Total Products:
${totalProducts}

Total Quantity:
${totalQuantity}

Subtotal:
₹${subtotal.toLocaleString('en-IN')}

MRP Total:
₹${mrpTotal.toLocaleString('en-IN')}

Product Discount:
₹${productDiscount.toLocaleString('en-IN')}

Coupon Discount:
₹${couponDiscount.toLocaleString('en-IN')}

Reward Discount:
₹${redeemedAmount.toLocaleString('en-IN')}

Shipping:
₹${shippingCharge.toLocaleString('en-IN')}

Overweight Delivery Charge:
₹${overweightDeliveryCharge.toLocaleString('en-IN')}

Tax:
₹${tax.toLocaleString('en-IN')}

Total Savings:
₹${totalSavings.toLocaleString('en-IN')}

Redeemed Coins:
${redeemedCoins}

Redeemed Amount:
₹${redeemedAmount.toLocaleString('en-IN')}

Earned Coins:
${earnedCoins}

Free Shipping:
${isFreeShipping ? 'Yes' : 'No'}

========================================
GRAND TOTAL
========================================

₹${grandTotal.toLocaleString('en-IN')}

========================================

Please check the JPL Medwin admin dashboard for complete order details.
      `.trim();

      // =========================================
      // GENERATE PDF
      // =========================================

      const pdfBuffer =
        await this.orderDetailsPdfService.generateOrderDetailsPdf(
          orderDetails as any,
          customerName,
          customerEmail,
        );

      // =========================================
      // PDF FILE NAME
      // =========================================

      const pdfFileName =
        `order-${order.orderNumber}.pdf`;

      // =========================================
      // SEND EMAIL
      // =========================================

      await this.brevoService.sendEmail({
        to: [
          {
            email:
              this.notificationEmail,

            name:
              'JPL Medwin',
          },
        ],

        subject,

        htmlContent,

        textContent,

        attachment: [
          {
            content:
              pdfBuffer.toString(
                'base64',
              ),

            name:
              pdfFileName,
          },
        ],
      });

      // =========================================
      // SUCCESS
      // =========================================

      this.logger.log(
        `New order notification sent successfully for ${order.orderNumber} with PDF attachment: ${pdfFileName}`,
      );
    } catch (error) {
      // =========================================
      // EMAIL FAILURE MUST NOT FAIL ORDER
      // =========================================

      this.logger.error(
        `New order email notification failed for order ${orderId}`,

        error instanceof Error
          ? error.stack
          : String(error),
      );
    }
  }

  // =========================================
  // HTML ESCAPE
  // =========================================

  private escapeHtml(
    value: string,
  ): string {
    return value
      .replaceAll(
        '&',
        '&amp;',
      )
      .replaceAll(
        '<',
        '&lt;',
      )
      .replaceAll(
        '>',
        '&gt;',
      )
      .replaceAll(
        '"',
        '&quot;',
      )
      .replaceAll(
        "'",
        '&#039;',
      );
  }
}