import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { PrismaService } from './../../infrastructure/prisma/prisma.service';

import { BrevoService } from './brevo.service';

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
      // GET ORDER
      // =========================================

      const order =
        await this.prisma.order.findUnique({
          where: {
            id: orderId,
          },

          include: {
            items: true,
          },
        });

      if (!order) {
        this.logger.warn(
          `Order not found for email notification: ${orderId}`,
        );

        return;
      }

      // =========================================
      // GET CUSTOMER
      // =========================================
      //
      // Order.userId is nullable in Prisma.
      // Therefore we MUST check it before
      // passing it to findUnique().
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
          // User.name is directly available
          // in your Prisma User model.

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
      // ORDER ITEMS HTML
      // =========================================

      const itemsHtml = order.items
        .map(
          (item) => `
            <tr>
              <td
                style="
                  padding: 12px;
                  border-bottom: 1px solid #e5e7eb;
                "
              >
                ${this.escapeHtml(
                  item.productName,
                )}

                ${
                  item.variantName
                    ? `
                      <br />

                      <span
                        style="
                          font-size: 12px;
                          color: #6b7280;
                        "
                      >
                        ${this.escapeHtml(
                          item.variantName,
                        )}
                      </span>
                    `
                    : ''
                }
              </td>

              <td
                style="
                  padding: 12px;
                  border-bottom: 1px solid #e5e7eb;
                  text-align: center;
                "
              >
                ${item.quantity}
              </td>

              <td
                style="
                  padding: 12px;
                  border-bottom: 1px solid #e5e7eb;
                  text-align: right;
                "
              >
                ₹${Number(
                  item.totalPrice,
                ).toLocaleString('en-IN')}
              </td>
            </tr>
          `,
        )
        .join('');

      // =========================================
      // SUBJECT
      // =========================================

      const subject =
        `🚨 New Order Received - ${order.orderNumber}`;

      // =========================================
      // HTML EMAIL
      // =========================================

      const htmlContent = `
        <!DOCTYPE html>

        <html>
          <head>
            <meta charset="UTF-8" />

            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />

            <title>
              New Order Received
            </title>
          </head>

          <body
            style="
              margin: 0;
              padding: 0;
              background: #f5f7fa;
              font-family: Arial, Helvetica, sans-serif;
            "
          >

            <div
              style="
                max-width: 680px;
                margin: 30px auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid #e5e7eb;
              "
            >

              <!-- HEADER -->

              <div
                style="
                  padding: 24px;
                  background: #0f766e;
                  color: #ffffff;
                "
              >
                <h1
                  style="
                    margin: 0;
                    font-size: 24px;
                  "
                >
                  🚨 New Order Received
                </h1>

                <p
                  style="
                    margin: 8px 0 0;
                    opacity: 0.9;
                    font-size: 14px;
                  "
                >
                  JPL Medwin Order Management
                </p>
              </div>

              <!-- CONTENT -->

              <div
                style="
                  padding: 24px;
                "
              >

                <p
                  style="
                    margin-top: 0;
                    font-size: 15px;
                    color: #374151;
                  "
                >
                  A new order has been successfully placed.
                </p>

                <!-- ORDER INFO -->

                <div
                  style="
                    margin-top: 20px;
                    padding: 16px;
                    background: #f9fafb;
                    border-radius: 8px;
                  "
                >

                  <p style="margin: 0 0 8px;">
                    <strong>
                      Order Number:
                    </strong>

                    ${this.escapeHtml(
                      order.orderNumber,
                    )}
                  </p>

                  <p style="margin: 0 0 8px;">
                    <strong>
                      Customer:
                    </strong>

                    ${this.escapeHtml(
                      customerName,
                    )}
                  </p>

                  ${
                    customerEmail
                      ? `
                        <p
                          style="
                            margin: 0 0 8px;
                          "
                        >
                          <strong>
                            Customer Email:
                          </strong>

                          ${this.escapeHtml(
                            customerEmail,
                          )}
                        </p>
                      `
                      : `
                        <p
                          style="
                            margin: 0 0 8px;
                            color: #6b7280;
                          "
                        >
                          <strong>
                            Customer Email:
                          </strong>

                          Not available
                        </p>
                      `
                  }

                  <p style="margin: 0 0 8px;">
                    <strong>
                      Status:
                    </strong>

                    ${this.escapeHtml(
                      String(order.status),
                    )}
                  </p>

                  <p style="margin: 0;">
                    <strong>
                      Payment:
                    </strong>

                    ${this.escapeHtml(
                      String(
                        order.paymentStatus,
                      ),
                    )}
                  </p>

                </div>

                <!-- ITEMS -->

                <h2
                  style="
                    margin: 28px 0 12px;
                    font-size: 18px;
                    color: #111827;
                  "
                >
                  Order Items
                </h2>

                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    border-collapse: collapse;
                    font-size: 14px;
                  "
                >

                  <thead>
                    <tr
                      style="
                        background: #f3f4f6;
                      "
                    >

                      <th
                        style="
                          padding: 12px;
                          text-align: left;
                        "
                      >
                        Product
                      </th>

                      <th
                        style="
                          padding: 12px;
                          text-align: center;
                        "
                      >
                        Qty
                      </th>

                      <th
                        style="
                          padding: 12px;
                          text-align: right;
                        "
                      >
                        Amount
                      </th>

                    </tr>
                  </thead>

                  <tbody>
                    ${itemsHtml}
                  </tbody>

                </table>

                <!-- TOTAL -->

                <div
                  style="
                    margin-top: 20px;
                    padding: 18px;
                    background: #ecfdf5;
                    border-radius: 8px;
                    text-align: right;
                  "
                >

                  <span
                    style="
                      font-size: 14px;
                      color: #374151;
                    "
                  >
                    Order Total
                  </span>

                  <div
                    style="
                      margin-top: 4px;
                      font-size: 24px;
                      font-weight: 700;
                      color: #047857;
                    "
                  >
                    ₹${Number(
                      order.grandTotal,
                    ).toLocaleString('en-IN')}
                  </div>

                </div>

                <p
                  style="
                    margin: 24px 0 0;
                    font-size: 13px;
                    color: #6b7280;
                  "
                >
                  Please open the JPL Medwin
                  admin dashboard to view the
                  complete order details.
                </p>

              </div>

              <!-- FOOTER -->

              <div
                style="
                  padding: 16px 24px;
                  background: #f9fafb;
                  border-top: 1px solid #e5e7eb;
                  color: #6b7280;
                  font-size: 12px;
                "
              >
                JPL Medwin — Automated Order Notification
              </div>

            </div>

          </body>
        </html>
      `;

      // =========================================
      // TEXT EMAIL
      // =========================================

      const textContent = `
New Order Received

Order Number: ${order.orderNumber}

Customer: ${customerName}

Customer Email: ${
        customerEmail ?? 'Not available'
      }

Status: ${order.status}

Payment: ${order.paymentStatus}

Order Total: ₹${Number(
        order.grandTotal,
      ).toLocaleString('en-IN')}

Items:

${order.items
  .map(
    (item) =>
      `- ${item.productName}${
        item.variantName
          ? ` (${item.variantName})`
          : ''
      } x ${item.quantity} = ₹${Number(
        item.totalPrice,
      ).toLocaleString('en-IN')}`,
  )
  .join('\n')}

Please check the JPL Medwin admin dashboard
for complete order details.
      `.trim();

      // =========================================
      // SEND EMAIL
      // =========================================

      await this.brevoService.sendEmail({
        to: [
          {
            email:
              this.notificationEmail,

            name: 'JPL Medwin',
          },
        ],

        subject,

        htmlContent,

        textContent,
      });

      this.logger.log(
        `New order notification sent for ${order.orderNumber}`,
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

  private escapeHtml(
    value: string,
  ): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
}