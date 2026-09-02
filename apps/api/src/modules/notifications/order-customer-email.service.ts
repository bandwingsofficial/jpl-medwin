import { Injectable } from '@nestjs/common';

export interface OrderEmailItem {
  productName: string;
  variantName?: string | null;
  quantity: number;
  totalPrice: number | string;
}

export interface OrderEmailData {
  customerName: string;
  orderNumber: string;
  orderDate: Date | string;

  paymentMethod?: string | null;

  subtotal: number | string;
  shippingCharge: number | string;
  couponDiscount: number | string;
  rewardDiscount?: number | string;
  grandTotal: number | string;

  estimatedDelivery?: string | null;

  items: OrderEmailItem[];

  shippingAddress?: {
    name?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    phone?: string | null;
  } | null;

  earnedCoins?: number | null;

  orderUrl?: string | null;
}

export type OrderEmailStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

@Injectable()
export class OrderEmailTemplateService {
  /**
   * Keep the logo URL configurable.
   *
   * Example:
   * https://your-domain.com/images/jpl-medwin-logo.png
   */
  private readonly logoUrl =
    process.env.ORDER_EMAIL_LOGO_URL ??
    '';

  private readonly brandColor = '#008fa8';

  private formatMoney(value: number | string): string {
    const amount = Number(value ?? 0);

    return `Rs. ${amount.toLocaleString('en-IN')}`;
  }

  private formatDate(value: Date | string): string {
    const date = new Date(value);

    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  private escapeHtml(value: unknown): string {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private getStatusContent(status: OrderEmailStatus) {
    switch (status) {
      case 'PLACED':
        return {
          label: 'ORDER PLACED',
          heading: 'We’ve got your order.',
          message:
            'Your order has been successfully placed. We’ll keep you updated as it moves through our warehouse and delivery process.',
        };

      case 'CONFIRMED':
        return {
          label: 'CONFIRMED',
          heading: 'We’ve got your order.',
          message:
            'Your order has been confirmed. Our warehouse team is preparing it now, and we’ll email you when it moves to the next stage.',
        };

      case 'PACKED':
        return {
          label: 'PACKED',
          heading: 'Your order is packed.',
          message:
            'Good news — your order has been packed and is ready to be handed over to our delivery partner.',
        };

      case 'SHIPPED':
        return {
          label: 'SHIPPED',
          heading: 'Your order is on its way.',
          message:
            'Your order has been shipped. We’ll keep you updated as it makes its way to you.',
        };

      case 'OUT_FOR_DELIVERY':
        return {
          label: 'OUT FOR DELIVERY',
          heading: 'Your order is out for delivery.',
          message:
            'Your order is on its way to your delivery address and should reach you soon.',
        };

      case 'DELIVERED':
        return {
          label: 'DELIVERED',
          heading: 'Your order has arrived.',
          message:
            'Your order has been delivered successfully. We hope you have a great experience with your purchase.',
        };

      case 'CANCELLED':
        return {
          label: 'CANCELLED',
          heading: 'Your order has been cancelled.',
          message:
            'Your order has been cancelled. If you believe this was unexpected, please contact our support team.',
        };

      default:
        return {
          label: 'ORDER UPDATE',
          heading: 'There’s an update on your order.',
          message:
            'Your order status has been updated. We’ll continue to keep you informed.',
        };
    }
  }

  private renderProgress(status: OrderEmailStatus): string {
    const steps: {
      key: OrderEmailStatus;
      label: string;
    }[] = [
      {
        key: 'PLACED',
        label: 'PLACED',
      },
      {
        key: 'PACKED',
        label: 'PACKED',
      },
      {
        key: 'SHIPPED',
        label: 'SHIPPED',
      },
      {
        key: 'OUT_FOR_DELIVERY',
        label: 'OUT FOR DELIVERY',
      },
      {
        key: 'DELIVERED',
        label: 'DELIVERED',
      },
    ];

    const currentIndex = steps.findIndex(
      (step) => step.key === status,
    );

    const activeIndex =
      currentIndex === -1 ? 0 : currentIndex;

    return `
      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="margin:32px 0 42px;"
      >
        <tr>
          ${steps
            .map((step, index) => {
              const active =
                index <= activeIndex &&
                status !== 'CANCELLED';

              return `
                <td
                  align="center"
                  valign="top"
                  style="width:20%;"
                >
                  <div
                    style="
                      width:18px;
                      height:18px;
                      margin:0 auto 10px;
                      border-radius:50%;
                      background:${active ? this.brandColor : '#d8d8d8'};
                    "
                  ></div>

                  <div
                    style="
                      font-family:Arial,Helvetica,sans-serif;
                      font-size:11px;
                      line-height:16px;
                      letter-spacing:1px;
                      color:${active ? this.brandColor : '#999999'};
                      font-weight:${active ? '700' : '400'};
                    "
                  >
                    ${step.label}
                  </div>
                </td>
              `;
            })
            .join('')}
        </tr>
      </table>
    `;
  }

  private renderItems(
    items: OrderEmailItem[],
  ): string {
    return items
      .map(
        (item) => `
          <tr>
            <td
              style="
                padding:16px 0;
                border-bottom:1px solid #e5e5e5;
                font-family:Georgia,'Times New Roman',serif;
                color:#292929;
                font-size:16px;
                line-height:24px;
              "
            >
              <strong>
                ${this.escapeHtml(item.productName)}
              </strong>

              ${
                item.variantName
                  ? `
                    <div
                      style="
                        color:#777;
                        font-family:Arial,Helvetica,sans-serif;
                        font-size:13px;
                        margin-top:4px;
                      "
                    >
                      ${this.escapeHtml(item.variantName)}
                    </div>
                  `
                  : ''
              }

              <div
                style="
                  color:#777;
                  font-family:Arial,Helvetica,sans-serif;
                  font-size:13px;
                  margin-top:5px;
                "
              >
                Qty ${item.quantity} ·
                ${this.formatMoney(
                  Number(item.totalPrice) /
                    Math.max(item.quantity, 1),
                )} each
              </div>
            </td>

            <td
              align="right"
              valign="top"
              style="
                padding:16px 0;
                border-bottom:1px solid #e5e5e5;
                font-family:Georgia,'Times New Roman',serif;
                color:#292929;
                font-size:16px;
                white-space:nowrap;
              "
            >
              ${this.formatMoney(item.totalPrice)}
            </td>
          </tr>
        `,
      )
      .join('');
  }

  private renderAddress(
    address: OrderEmailData['shippingAddress'],
  ): string {
    if (!address) {
      return '';
    }

    return `
      <div
        style="
          margin-top:38px;
        "
      >
        <div
          style="
            font-family:Georgia,'Times New Roman',serif;
            font-size:13px;
            letter-spacing:3px;
            color:#666;
            margin-bottom:14px;
          "
        >
          SHIPPING ADDRESS
        </div>

        <div
          style="
            font-family:Georgia,'Times New Roman',serif;
            font-size:16px;
            line-height:26px;
            color:#292929;
          "
        >
          ${
            address.name
              ? `<div>${this.escapeHtml(address.name)}</div>`
              : ''
          }

          ${
            address.addressLine1
              ? `<div>${this.escapeHtml(address.addressLine1)}</div>`
              : ''
          }

          ${
            address.addressLine2
              ? `<div>${this.escapeHtml(address.addressLine2)}</div>`
              : ''
          }

          ${
            address.city
              ? `<div>${this.escapeHtml(address.city)}</div>`
              : ''
          }

          ${
            address.state || address.postalCode
              ? `
                <div>
                  ${this.escapeHtml(address.state ?? '')}
                  ${
                    address.state && address.postalCode
                      ? ' - '
                      : ''
                  }
                  ${this.escapeHtml(
                    address.postalCode ?? '',
                  )}
                </div>
              `
              : ''
          }

          ${
            address.phone
              ? `
                <div style="margin-top:4px;">
                  Phone:
                  ${this.escapeHtml(address.phone)}
                </div>
              `
              : ''
          }
        </div>
      </div>
    `;
  }

  generate(
    status: OrderEmailStatus,
    data: OrderEmailData,
  ): {
    subject: string;
    htmlContent: string;
    textContent: string;
  } {
    const content = this.getStatusContent(status);

    const subjectMap: Record<
      OrderEmailStatus,
      string
    > = {
      PLACED: `Order placed — ${data.orderNumber}`,
      CONFIRMED: `Order confirmed — ${data.orderNumber}`,
      PACKED: `Order packed — ${data.orderNumber}`,
      SHIPPED: `Order shipped — ${data.orderNumber}`,
      OUT_FOR_DELIVERY:
        `Out for delivery — ${data.orderNumber}`,
      DELIVERED: `Order delivered — ${data.orderNumber}`,
      CANCELLED: `Order cancelled — ${data.orderNumber}`,
    };

    const itemsHtml = this.renderItems(
      data.items ?? [],
    );

    const progressHtml =
      status === 'CANCELLED'
        ? ''
        : this.renderProgress(status);

    const orderButton = data.orderUrl
      ? `
        <div style="text-align:center;margin:36px 0;">
          <a
            href="${this.escapeHtml(data.orderUrl)}"
            style="
              display:inline-block;
              background:${this.brandColor};
              color:#ffffff;
              text-decoration:none;
              padding:16px 44px;
              font-family:Georgia,'Times New Roman',serif;
              font-size:17px;
              font-weight:bold;
            "
          >
            View your order
          </a>
        </div>
      `
      : '';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width,initial-scale=1.0"
  />

  <title>${this.escapeHtml(subjectMap[status])}</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f5f5f5;
  "
>
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background:#f5f5f5;"
  >
    <tr>
      <td align="center">

        <table
          width="650"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width:650px;
            width:100%;
            background:#ffffff;
          "
        >

          <!-- LOGO -->
          <tr>
            <td
              align="center"
              style="padding:48px 30px 42px;"
            >
              ${
                this.logoUrl
                  ? `
                    <img
                      src="${this.escapeHtml(
                        this.logoUrl,
                      )}"
                      alt="JPL Medwin"
                      style="
                        max-width:330px;
                        width:auto;
                        height:auto;
                        display:block;
                      "
                    />
                  `
                  : `
                    <div
                      style="
                        font-family:Arial,Helvetica,sans-serif;
                        font-size:30px;
                        font-weight:700;
                        color:#008fa8;
                      "
                    >
                      JPL MEDWIN
                    </div>
                  `
              }
            </td>
          </tr>

          <!-- TOP LINE -->
          <tr>
            <td style="padding:0 42px;">
              <div
                style="
                  border-top:3px solid #292929;
                "
              ></div>
            </td>
          </tr>

          <!-- ORDER META -->
          <tr>
            <td style="padding:22px 42px 20px;">
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr>
                  <td
                    style="
                      font-family:Georgia,'Times New Roman',serif;
                      font-size:14px;
                      letter-spacing:3px;
                      color:#292929;
                    "
                  >
                    ORDER UPDATE
                  </td>

                  <td
                    align="center"
                    style="
                      font-family:Georgia,'Times New Roman',serif;
                      font-size:14px;
                      color:#666;
                    "
                  >
                    ${this.formatDate(data.orderDate)}
                  </td>

                  <td
                    align="right"
                    style="
                      font-family:Georgia,'Times New Roman',serif;
                      font-size:14px;
                      color:#292929;
                      white-space:nowrap;
                    "
                  >
                    Order ID
                    ${this.escapeHtml(
                      data.orderNumber,
                    )}
                  </td>
                </tr>
              </table>

              <div
                style="
                  border-bottom:1px solid #292929;
                  margin-top:16px;
                "
              ></div>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding:42px;">

              <!-- STATUS -->
              <div
                style="
                  font-family:Georgia,'Times New Roman',serif;
                  font-size:18px;
                  font-weight:bold;
                  letter-spacing:5px;
                  color:#e4007c;
                  margin-bottom:22px;
                "
              >
                ${content.label}
              </div>

              <!-- HEADING -->
              <div
                style="
                  font-family:Georgia,'Times New Roman',serif;
                  font-size:48px;
                  line-height:56px;
                  font-weight:bold;
                  color:#242424;
                  margin-bottom:28px;
                "
              >
                ${content.heading}
              </div>

              <!-- CUSTOMER MESSAGE -->
              <div
                style="
                  font-family:Georgia,'Times New Roman',serif;
                  font-size:18px;
                  line-height:30px;
                  color:#292929;
                "
              >
                Dear ${this.escapeHtml(
                  data.customerName,
                )},
                <br /><br />

                ${content.message}
              </div>

              ${progressHtml}

              <!-- ORDER DATE -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr>
                  <td
                    width="42%"
                    style="
                      font-family:Georgia,'Times New Roman',serif;
                      font-size:13px;
                      letter-spacing:3px;
                      color:#666;
                      padding-bottom:18px;
                    "
                  >
                    ORDER PLACED
                  </td>

                  <td
                    style="
                      font-family:Georgia,'Times New Roman',serif;
                      font-size:17px;
                      color:#292929;
                      padding-bottom:18px;
                    "
                  >
                    ${this.formatDate(data.orderDate)}
                  </td>
                </tr>

                ${
                  data.paymentMethod
                    ? `
                      <tr>
                        <td
                          style="
                            font-family:Georgia,'Times New Roman',serif;
                            font-size:13px;
                            letter-spacing:3px;
                            color:#666;
                            padding-bottom:18px;
                          "
                        >
                          PAYMENT
                        </td>

                        <td
                          style="
                            font-family:Georgia,'Times New Roman',serif;
                            font-size:17px;
                            color:#292929;
                            padding-bottom:18px;
                          "
                        >
                          ${this.escapeHtml(
                            data.paymentMethod,
                          )}
                        </td>
                      </tr>
                    `
                    : ''
                }

                ${
                  data.estimatedDelivery
                    ? `
                      <tr>
                        <td
                          style="
                            font-family:Georgia,'Times New Roman',serif;
                            font-size:13px;
                            letter-spacing:3px;
                            color:#666;
                          "
                        >
                          ESTIMATED DELIVERY
                        </td>

                        <td
                          style="
                            font-family:Georgia,'Times New Roman',serif;
                            font-size:17px;
                            color:#292929;
                          "
                        >
                          ${this.escapeHtml(
                            data.estimatedDelivery,
                          )}
                        </td>
                      </tr>
                    `
                    : ''
                }
              </table>

              ${orderButton}

              <!-- ORDER DETAILS -->
              <div
                style="
                  font-family:Georgia,'Times New Roman',serif;
                  font-size:14px;
                  letter-spacing:3px;
                  color:#666;
                  margin-top:38px;
                  margin-bottom:18px;
                "
              >
                ORDER DETAILS —
                ${data.items.length} ITEMS
              </div>

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                ${itemsHtml}
              </table>

              <!-- TOTALS -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="margin-top:20px;"
              >
                <tr>
                  <td
                    style="
                      padding:7px 0;
                      font-family:Georgia,'Times New Roman',serif;
                      font-size:15px;
                      color:#666;
                    "
                  >
                    Item total
                  </td>

                  <td
                    align="right"
                    style="
                      padding:7px 0;
                      font-family:Georgia,'Times New Roman',serif;
                      font-size:15px;
                      color:#292929;
                    "
                  >
                    ${this.formatMoney(
                      data.subtotal,
                    )}
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding:7px 0;
                      font-family:Georgia,'Times New Roman',serif;
                      font-size:15px;
                      color:#666;
                    "
                  >
                    Delivery partner fee
                  </td>

                  <td
                    align="right"
                    style="
                      padding:7px 0;
                      font-family:Georgia,'Times New Roman',serif;
                      font-size:15px;
                      color:#292929;
                    "
                  >
                    ${this.formatMoney(
                      data.shippingCharge,
                    )}
                  </td>
                </tr>

                ${
                  Number(data.couponDiscount) > 0
                    ? `
                      <tr>
                        <td
                          style="
                            padding:7px 0;
                            font-family:Georgia,'Times New Roman',serif;
                            font-size:15px;
                            color:#666;
                          "
                        >
                          Coupon discount
                        </td>

                        <td
                          align="right"
                          style="
                            padding:7px 0;
                            font-family:Georgia,'Times New Roman',serif;
                            font-size:15px;
                            color:#292929;
                          "
                        >
                          − ${this.formatMoney(
                            data.couponDiscount,
                          )}
                        </td>
                      </tr>
                    `
                    : ''
                }

                ${
                  Number(data.rewardDiscount ?? 0) > 0
                    ? `
                      <tr>
                        <td
                          style="
                            padding:7px 0;
                            font-family:Georgia,'Times New Roman',serif;
                            font-size:15px;
                            color:#666;
                          "
                        >
                          Reward discount
                        </td>

                        <td
                          align="right"
                          style="
                            padding:7px 0;
                            font-family:Georgia,'Times New Roman',serif;
                            font-size:15px;
                            color:#292929;
                          "
                        >
                          − ${this.formatMoney(
                            data.rewardDiscount ?? 0,
                          )}
                        </td>
                      </tr>
                    `
                    : ''
                }

                <tr>
                  <td
                    style="
                      padding:18px 0 0;
                      font-family:Georgia,'Times New Roman',serif;
                      font-size:20px;
                      font-weight:bold;
                      color:#292929;
                    "
                  >
                    Grand total
                  </td>

                  <td
                    align="right"
                    style="
                      padding:18px 0 0;
                      font-family:Georgia,'Times New Roman',serif;
                      font-size:20px;
                      font-weight:bold;
                      color:#292929;
                    "
                  >
                    ${this.formatMoney(
                      data.grandTotal,
                    )}
                  </td>
                </tr>
              </table>

              ${this.renderAddress(
                data.shippingAddress,
              )}

              ${
                data.earnedCoins !== undefined &&
                data.earnedCoins !== null
                  ? `
                    <div
                      style="
                        margin-top:38px;
                      "
                    >
                      <div
                        style="
                          font-family:Georgia,'Times New Roman',serif;
                          font-size:15px;
                          font-weight:bold;
                          letter-spacing:3px;
                          color:#e4007c;
                          margin-bottom:10px;
                        "
                      >
                        REWARDS
                      </div>

                      <div
                        style="
                          font-family:Georgia,'Times New Roman',serif;
                          font-size:17px;
                          color:#292929;
                        "
                      >
                        You’ve earned
                        ${data.earnedCoins}
                        reward coins with this order.
                      </div>
                    </div>
                  `
                  : ''
              }

              <!-- SUPPORT -->
              <div
                style="
                  margin-top:48px;
                  padding-top:30px;
                  border-top:1px solid #292929;
                  text-align:center;
                "
              >
                <div
                  style="
                    font-family:Georgia,'Times New Roman',serif;
                    font-size:18px;
                    color:#292929;
                    margin-bottom:20px;
                  "
                >
                  Questions about your order?
                </div>

                <div
                  style="
                    font-family:Arial,Helvetica,sans-serif;
                    font-size:14px;
                    line-height:26px;
                    color:${this.brandColor};
                  "
                >
                  Help Center
                  &nbsp;·&nbsp;
                  support@jplmedwin.com
                  &nbsp;·&nbsp;
                  +91-728-9999-456
                </div>
              </div>

              <div
                style="
                  margin-top:34px;
                  text-align:center;
                  font-family:Georgia,'Times New Roman',serif;
                  font-size:13px;
                  font-style:italic;
                  color:#777;
                "
              >
                This is an auto-generated email —
                please do not reply directly to it.
              </div>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;

    const textContent = `
${content.label}

${content.heading}

Dear ${data.customerName},

${content.message}

Order ID: ${data.orderNumber}

Order placed: ${this.formatDate(data.orderDate)}

${data.paymentMethod ? `Payment: ${data.paymentMethod}` : ''}

${
  data.estimatedDelivery
    ? `Estimated delivery: ${data.estimatedDelivery}`
    : ''
}

ORDER DETAILS

${data.items
  .map(
    (item) =>
      `${item.productName}${
        item.variantName
          ? ` - ${item.variantName}`
          : ''
      } | Qty: ${item.quantity} | ${this.formatMoney(
        item.totalPrice,
      )}`,
  )
  .join('\n')}

Item total: ${this.formatMoney(data.subtotal)}
Delivery partner fee: ${this.formatMoney(data.shippingCharge)}
Coupon discount: - ${this.formatMoney(data.couponDiscount)}
Reward discount: - ${this.formatMoney(data.rewardDiscount ?? 0)}

Grand total: ${this.formatMoney(data.grandTotal)}

${
  data.earnedCoins !== undefined &&
  data.earnedCoins !== null
    ? `You’ve earned ${data.earnedCoins} reward coins with this order.`
    : ''
}

Questions about your order?
support@jplmedwin.com
`;

    return {
      subject: subjectMap[status],
      htmlContent,
      textContent,
    };
  }
}