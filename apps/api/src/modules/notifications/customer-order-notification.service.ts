import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { PrismaService } from './../../infrastructure/prisma/prisma.service';

import { BrevoService } from './brevo.service';

import {
  buildCustomerOrderEmail,
  OrderCustomerEmailStatus,
  CustomerOrderEmailData,
} from './order-customer-email.template';

@Injectable()
export class CustomerOrderNotificationService {
  private readonly logger = new Logger(
    CustomerOrderNotificationService.name,
  );

  private readonly logoUrl: string;

  private readonly supportEmail: string;

  private readonly supportPhone: string;

  private readonly supportWhatsApp: string;

  private readonly helpCenterUrl: string;

  private readonly orderBaseUrl: string;

  constructor(
    private readonly brevoService: BrevoService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.logoUrl =
      this.configService.get<string>(
        'ORDER_EMAIL_LOGO_URL',
      ) ?? '';

    this.supportEmail =
      this.configService.get<string>(
        'ORDER_SUPPORT_EMAIL',
      ) ?? 'connect@jplmedwin.com';

    this.supportPhone =
      this.configService.get<string>(
        'ORDER_SUPPORT_PHONE',
      ) ?? '+91-91879 69350';

    this.supportWhatsApp =
      this.configService.get<string>(
        'ORDER_SUPPORT_WHATSAPP',
      ) ?? '';

    this.helpCenterUrl =
      this.configService.get<string>(
        'ORDER_HELP_CENTER_URL',
      ) ?? '';

    this.orderBaseUrl =
      this.configService.get<string>(
        'CUSTOMER_ORDER_URL',
      ) ?? '';
  }

  async sendCustomerOrderNotification(
    orderId: string,
    status?: OrderCustomerEmailStatus,
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
            payments: true,
          },
        });

      if (!order) {
        this.logger.warn(
          `Order not found for customer email: ${orderId}`,
        );

        return;
      }

      // =========================================
      // CUSTOMER
      // =========================================

      let customerName = 'Customer';

      let customerEmail:
        | string
        | undefined;

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
      // NO CUSTOMER EMAIL
      // =========================================

      if (!customerEmail) {
        this.logger.warn(
          `Customer email not available for order ${order.orderNumber}`,
        );

        return;
      }

      // =========================================
      // STATUS
      // =========================================

      const orderStatus =
        (status ??
          order.status) as OrderCustomerEmailStatus;

      // =========================================
      // PAYMENT METHOD
      // =========================================

      const metadata =
        order.metadata &&
        typeof order.metadata === 'object' &&
        !Array.isArray(order.metadata)
          ? (order.metadata as Record<
              string,
              unknown
            >)
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
        undefined;

      // =========================================
      // PAYMENT STATUS
      // =========================================

      const paymentStatus =
        order.paymentStatus
          ? String(order.paymentStatus)
          : undefined;

      // =========================================
      // ORDER ITEMS
      // =========================================

      const items =
        order.items.map((item) => ({
          productName:
            item.productName,

          variantName:
            item.variantName ?? null,

          quantity:
            Number(item.quantity ?? 0),

          unitPrice:
            Number(item.price ?? 0),

          totalPrice:
            Number(
              item.totalPrice ??
                Number(item.price ?? 0) *
                  Number(item.quantity ?? 0),
            ),
        }));

      // =========================================
      // SHIPPING ADDRESS
      // =========================================

      const shippingAddress =
        order.shippingAddress
          ? {
              name:
                order.shippingAddress
                  .fullName ?? null,

              addressLine1:
                order.shippingAddress
                  .addressLine1 ?? null,

              addressLine2:
                order.shippingAddress
                  .addressLine2 ?? null,

              city:
                order.shippingAddress
                  .city ?? null,

              state:
                order.shippingAddress
                  .state ?? null,

              pincode:
                order.shippingAddress
                  .postalCode ?? null,

              phone:
                order.shippingAddress
                  .phoneNumber ?? null,
            }
          : null;

      // =========================================
      // ORDER URL
      // =========================================

      const orderUrl = this.orderBaseUrl
        ? `${this.orderBaseUrl.replace(
            /\/$/,
            '',
          )}/${encodeURIComponent(
            order.orderNumber,
          )}`
        : undefined;

      // =========================================
      // EMAIL DATA
      // =========================================

      const emailData: CustomerOrderEmailData = {
        customerName,

        orderNumber:
          order.orderNumber,

        status: orderStatus,

        orderDate:
          order.createdAt.toISOString(),

        paymentMethod,

        paymentStatus,

        subtotal:
          Number(order.subtotal ?? 0),

        couponDiscount:
          Number(
            order.couponDiscount ?? 0,
          ),

        shippingCharge:
          Number(
            order.shippingCharge ?? 0,
          ),

        overweightDeliveryCharge:
          Number(
            order.overweightDeliveryCharge ??
              0,
          ),

        tax:
          Number(order.tax ?? 0),

        grandTotal:
          Number(order.grandTotal ?? 0),

        earnedCoins:
          order.earnedCoins !== null &&
          order.earnedCoins !== undefined
            ? Number(order.earnedCoins)
            : null,

        estimatedDelivery:
          metadata.estimatedDelivery
            ? String(
                metadata.estimatedDelivery,
              )
            : null,

        items,

        shippingAddress,

       logoUrl: `${process.env.NEXT_PUBLIC_APP_URL_LOGO}/Logo/jpl_logo.png`,

        supportEmail:
          this.supportEmail,

        supportPhone:
          this.supportPhone,

        supportWhatsApp:
          this.supportWhatsApp || undefined,

        helpCenterUrl:
          this.helpCenterUrl || undefined,

        orderUrl,
      };

      // =========================================
      // BUILD CUSTOMER EMAIL
      // =========================================

      const htmlContent =
        buildCustomerOrderEmail(
          emailData,
        );

      // =========================================
      // SUBJECT
      // =========================================

      const subjectMap: Record<
        OrderCustomerEmailStatus,
        string
      > = {
        PLACED:
          `Order placed — ${order.orderNumber}`,

        CONFIRMED:
          `Order confirmed — ${order.orderNumber}`,

        PACKED:
          `Order packed — ${order.orderNumber}`,

        SHIPPED:
          `Order shipped — ${order.orderNumber}`,

        DELIVERED:
          `Order delivered — ${order.orderNumber}`,

        CANCELLED:
          `Order cancelled — ${order.orderNumber}`,
        REFUNDED:
          `Order refunded — ${order.orderNumber}`,
      };

      const subject =
        subjectMap[orderStatus];

      // =========================================
      // TEXT VERSION
      // =========================================

      const textContent = `
${orderStatus}

Order ${order.orderNumber}

Dear ${customerName},

Your order status is: ${orderStatus}

Order Number: ${order.orderNumber}

Order Date: ${order.createdAt.toLocaleString(
        'en-IN',
      )}

Payment Method: ${
        paymentMethod ?? 'N/A'
      }

Payment Status: ${
        paymentStatus ?? 'N/A'
      }

ORDER DETAILS

${items
  .map(
    (item) =>
      `${item.productName}${
        item.variantName
          ? ` - ${item.variantName}`
          : ''
      } | Qty: ${item.quantity} | Rs. ${Number(
        item.totalPrice,
      ).toLocaleString('en-IN')}`,
  )
  .join('\n')}

Item total: Rs. ${Number(
        order.subtotal ?? 0,
      ).toLocaleString('en-IN')}

Delivery partner fee: Rs. ${Number(
        order.shippingCharge ?? 0,
      ).toLocaleString('en-IN')}

Coupon discount: Rs. ${Number(
        order.couponDiscount ?? 0,
      ).toLocaleString('en-IN')}

Additional delivery charge: Rs. ${Number(
        order.overweightDeliveryCharge ?? 0,
      ).toLocaleString('en-IN')}

Tax: Rs. ${Number(
        order.tax ?? 0,
      ).toLocaleString('en-IN')}

Grand total: Rs. ${Number(
        order.grandTotal ?? 0,
      ).toLocaleString('en-IN')}

${
  order.earnedCoins !== null &&
  order.earnedCoins !== undefined
    ? `You’ve earned ${Number(
        order.earnedCoins,
      )} reward coins with this order.`
    : ''
}

Questions about your order?

${this.supportEmail}

${this.supportPhone}
      `.trim();

      // =========================================
      // SEND CUSTOMER EMAIL
      // =========================================

      await this.brevoService.sendEmail({
        to: [
          {
            email: customerEmail,
            name: customerName,
          },
        ],

        subject,

        htmlContent,

        textContent,
      });

      // =========================================
      // SUCCESS
      // =========================================

      this.logger.log(
        `Customer order email sent successfully for ${order.orderNumber} to ${customerEmail} (${orderStatus})`,
      );
    } catch (error) {
      // =========================================
      // EMAIL FAILURE MUST NOT FAIL ORDER
      // =========================================

      this.logger.error(
        `Customer order email failed for order ${orderId}`,

        error instanceof Error
          ? error.stack
          : String(error),
      );
    }
  }
}