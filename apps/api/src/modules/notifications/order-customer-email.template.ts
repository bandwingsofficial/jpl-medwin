
export type OrderCustomerEmailStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface CustomerOrderEmailItem {
  productName: string;
  variantName?: string | null;
  quantity: number;
  unitPrice?: string | number;
  totalPrice: string | number;
}

export interface CustomerOrderEmailAddress {
  name?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  phone?: string | null;
}

export interface CustomerOrderEmailData {
  customerName?: string | null;
  orderNumber: string;

  status: OrderCustomerEmailStatus;

  orderDate: string;

  paymentMethod?: string | null;
  paymentStatus?: string | null;

  subtotal?: string | number | null;
  couponDiscount?: string | number | null;
  shippingCharge?: string | number | null;
  overweightDeliveryCharge?: string | number | null;
  tax?: string | number | null;
  grandTotal: string | number;

  earnedCoins?: number | null;

  estimatedDelivery?: string | null;

  items: CustomerOrderEmailItem[];

  shippingAddress?: CustomerOrderEmailAddress | null;

  /**
   * Public URL of the JPL Medwin logo.
   *
   * Example:
   * https://your-domain.com/images/jpl-medwin-logo.png
   */
logoUrl: string;

  /**
   * Optional support information.
   */
  supportEmail?: string;
  supportPhone?: string;
  supportWhatsApp?: string;
  helpCenterUrl?: string;

  /**
   * Optional URL for "View your order".
   */
  orderUrl?: string;
}

interface StatusContent {
  label: string;
  title: string;
  message: string;
  activeStep: number;
}

const STATUS_CONTENT: Record<
  OrderCustomerEmailStatus,
  StatusContent
> = {
  PLACED: {
    label: 'ORDER PLACED',
    title: 'We’ve got your order.',
    message:
      'Your order has been placed successfully. We’ll keep you updated as it moves through our fulfillment process.',
    activeStep: 0,
  },

  CONFIRMED: {
    label: 'CONFIRMED',
    title: 'Your order is confirmed.',
    message:
      'Your order has been confirmed. Our team is preparing it for the next step.',
    activeStep: 0,
  },

  PACKED: {
    label: 'PACKED',
    title: 'Your order has been packed.',
    message:
      'Your order has been packed and is ready to be handed over to our delivery partner.',
    activeStep: 1,
  },

  SHIPPED: {
    label: 'SHIPPED',
    title: 'Your order is on its way.',
    message:
      'Your order has been shipped and is now on its way to you. We’ll email you when it reaches the next stage.',
    activeStep: 2,
  },



  DELIVERED: {
    label: 'DELIVERED',
    title: 'Your order has been delivered.',
    message:
      'Your order has been delivered successfully. Thank you for shopping with JPL Medwin.',
    activeStep: 4,
  },

  CANCELLED: {
    label: 'CANCELLED',
    title: 'Your order has been cancelled.',
    message:
      'Your order has been cancelled. If you believe this was unexpected, please contact our support team.',
    activeStep: -1,
  },
   REFUNDED: {
    label: 'REFUNDED',
    title: 'Your order has been refunded.',
    message:
      'Your order has been refunded. If you have any questions, please contact our support team.',
    activeStep: -1,
  }
};

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatMoney(value: string | number | null | undefined): string {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return 'Rs. 0';
  }

  const numericValue =
    typeof value === 'number'
      ? value
      : Number(value);

  if (Number.isNaN(numericValue)) {
    return `Rs. ${escapeHtml(value)}`;
  }

  return `Rs. ${numericValue.toLocaleString('en-IN')}`;
}

function formatPaymentMethod(
  value?: string | null,
): string {
  if (!value) {
    return 'Payment at delivery';
  }

  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function renderProgressTracker(
  status: OrderCustomerEmailStatus,
): string {
  const statusInfo = STATUS_CONTENT[status];

  const steps = [
    'PLACED',
    'PACKED',
    'SHIPPED',
    'OUT FOR DELIVERY',
    'DELIVERED',
  ];

  const activeStep = statusInfo.activeStep;

  return `
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="margin: 30px 0 20px;"
    >
      <tr>
        ${steps
          .map((step, index) => {
            const isActive =
              activeStep >= index &&
              status !== 'CANCELLED';

            const isCurrent =
              activeStep === index &&
              status !== 'CANCELLED';

            return `
              <td
                width="20%"
                align="center"
                valign="top"
                style="padding: 0 3px;"
              >
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tr>
                    <td
                      align="center"
                      style="
                        height: 20px;
                        font-size: 0;
                      "
                    >
                      <span
                        style="
                          display: inline-block;
                          width: 20px;
                          height: 20px;
                          line-height: 20px;
                          border-radius: 50%;
                          background: ${
                            isActive
                              ? '#0798b5'
                              : '#d7d7d7'
                          };
                          color: ${
                            isActive
                              ? '#ffffff'
                              : '#999999'
                          };
                          font-size: 10px;
                          font-weight: bold;
                        "
                      >
                        ${
                          isCurrent
                            ? '●'
                            : ''
                        }
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td
                      align="center"
                      style="
                        padding-top: 8px;
                        font-family: Georgia, 'Times New Roman', serif;
                        font-size: 12px;
                        line-height: 16px;
                        letter-spacing: 1px;
                        color: ${
                          isActive
                            ? '#087fa0'
                            : '#999999'
                        };
                        font-weight: ${
                          isActive
                            ? 'bold'
                            : 'normal'
                        };
                      "
                    >
                      ${escapeHtml(step)}
                    </td>
                  </tr>
                </table>
              </td>
            `;
          })
          .join('')}
      </tr>
    </table>
  `;
}

function renderItems(
  items: CustomerOrderEmailItem[],
): string {
  return items
    .map(
      (item) => `
        <tr>
          <td
            style="
              padding: 16px 0;
              border-bottom: 1px solid #e5e5e5;
              font-family: Georgia, 'Times New Roman', serif;
              color: #262626;
            "
          >
            <div
              style="
                font-size: 17px;
                line-height: 23px;
                font-weight: 500;
              "
            >
              ${escapeHtml(item.productName)}
            </div>

            ${
              item.variantName
                ? `
                  <div
                    style="
                      margin-top: 5px;
                      color: #777777;
                      font-size: 14px;
                      line-height: 20px;
                    "
                  >
                    ${escapeHtml(item.variantName)}
                  </div>
                `
                : ''
            }

            <div
              style="
                margin-top: 5px;
                color: #777777;
                font-size: 13px;
                line-height: 18px;
              "
            >
              Qty ${escapeHtml(item.quantity)}
              ${
                item.unitPrice !==
                undefined
                  ? ` · ${formatMoney(item.unitPrice)} each`
                  : ''
              }
            </div>
          </td>

          <td
            align="right"
            valign="top"
            style="
              padding: 16px 0;
              border-bottom: 1px solid #e5e5e5;
              font-family: Georgia, 'Times New Roman', serif;
              color: #262626;
              font-size: 16px;
              white-space: nowrap;
            "
          >
            ${formatMoney(item.totalPrice)}
          </td>
        </tr>
      `,
    )
    .join('');
}

function renderAddress(
  address?: CustomerOrderEmailAddress | null,
): string {
  if (!address) {
    return `
      <div
        style="
          font-family: Georgia, 'Times New Roman', serif;
          color: #555555;
          font-size: 15px;
          line-height: 24px;
        "
      >
        Shipping address unavailable.
      </div>
    `;
  }

  const lines = [
    address.name,
    address.addressLine1,
    address.addressLine2,
    [address.city, address.state]
      .filter(Boolean)
      .join(', '),
    address.pincode,
    address.phone
      ? `Phone: ${address.phone}`
      : null,
  ].filter(Boolean);

  return `
    <div
      style="
        font-family: Georgia, 'Times New Roman', serif;
        color: #262626;
        font-size: 15px;
        line-height: 24px;
      "
    >
      ${lines
        .map((line) => escapeHtml(line))
        .join('<br />')}
    </div>
  `;
}

function renderSummary(
  data: CustomerOrderEmailData,
): string {
  return `
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="
        margin-top: 10px;
        font-family: Georgia, 'Times New Roman', serif;
      "
    >
      <tr>
        <td
          style="
            padding: 7px 0;
            color: #666666;
            font-size: 15px;
          "
        >
          Item total
        </td>

        <td
          align="right"
          style="
            padding: 7px 0;
            color: #333333;
            font-size: 15px;
          "
        >
          ${formatMoney(data.subtotal)}
        </td>
      </tr>

      ${
        data.shippingCharge !==
        undefined
          ? `
            <tr>
              <td
                style="
                  padding: 7px 0;
                  color: #666666;
                  font-size: 15px;
                "
              >
                Delivery partner fee
              </td>

              <td
                align="right"
                style="
                  padding: 7px 0;
                  color: #333333;
                  font-size: 15px;
                "
              >
                ${formatMoney(
                  data.shippingCharge,
                )}
              </td>
            </tr>
          `
          : ''
      }

      ${
        data.couponDiscount
          ? `
            <tr>
              <td
                style="
                  padding: 7px 0;
                  color: #666666;
                  font-size: 15px;
                "
              >
                Coupon discount
              </td>

              <td
                align="right"
                style="
                  padding: 7px 0;
                  color: #333333;
                  font-size: 15px;
                "
              >
                − ${formatMoney(
                  data.couponDiscount,
                )}
              </td>
            </tr>
          `
          : ''
      }

      ${
        data.overweightDeliveryCharge
          ? `
            <tr>
              <td
                style="
                  padding: 7px 0;
                  color: #666666;
                  font-size: 15px;
                "
              >
                Additional delivery charge
              </td>

              <td
                align="right"
                style="
                  padding: 7px 0;
                  color: #333333;
                  font-size: 15px;
                "
              >
                ${formatMoney(
                  data.overweightDeliveryCharge,
                )}
              </td>
            </tr>
          `
          : ''
      }

      ${
        data.tax
          ? `
            <tr>
              <td
                style="
                  padding: 7px 0;
                  color: #666666;
                  font-size: 15px;
                "
              >
                Tax
              </td>

              <td
                align="right"
                style="
                  padding: 7px 0;
                  color: #333333;
                  font-size: 15px;
                "
              >
                ${formatMoney(data.tax)}
              </td>
            </tr>
          `
          : ''
      }

      <tr>
        <td
          style="
            padding: 14px 0 0;
            border-top: 1px solid #222222;
            font-size: 20px;
            font-weight: bold;
            color: #222222;
          "
        >
          Grand total
        </td>

        <td
          align="right"
          style="
            padding: 14px 0 0;
            border-top: 1px solid #222222;
            font-size: 20px;
            font-weight: bold;
            color: #222222;
          "
        >
          ${formatMoney(data.grandTotal)}
        </td>
      </tr>
    </table>
  `;
}

function renderSupport(
  data: CustomerOrderEmailData,
): string {
  const links: string[] = [];

  if (data.helpCenterUrl) {
    links.push(`
      <a
        href="${escapeHtml(data.helpCenterUrl)}"
        style="
          color: #0084a3;
          text-decoration: underline;
        "
      >
        Help Center
      </a>
    `);
  }

  if (data.supportEmail) {
    links.push(`
      <a
        href="mailto:${escapeHtml(data.supportEmail)}"
        style="
          color: #0084a3;
          text-decoration: underline;
        "
      >
        ${escapeHtml(data.supportEmail)}
      </a>
    `);
  }

  if (data.supportPhone) {
    links.push(`
      <a
        href="tel:${escapeHtml(data.supportPhone)}"
        style="
          color: #0084a3;
          text-decoration: underline;
        "
      >
        ${escapeHtml(data.supportPhone)}
      </a>
    `);
  }

  if (data.supportWhatsApp) {
    links.push(`
      <a
        href="${escapeHtml(data.supportWhatsApp)}"
        style="
          color: #0084a3;
          text-decoration: underline;
        "
      >
        WhatsApp
      </a>
    `);
  }

  return `
    <div
      style="
        text-align: center;
        padding-top: 20px;
      "
    >
      <div
        style="
          font-family: Georgia, 'Times New Roman', serif;
          color: #262626;
          font-size: 20px;
          line-height: 28px;
        "
      >
        Questions about your order?
      </div>

      ${
        links.length
          ? `
            <div
              style="
                margin-top: 20px;
                font-family: Georgia, 'Times New Roman', serif;
                font-size: 15px;
                line-height: 25px;
              "
            >
              ${links.join(
                '<span style="color:#999999; padding:0 8px;">·</span>',
              )}
            </div>
          `
          : ''
      }
    </div>
  `;
}

export function buildCustomerOrderEmail(
  data: CustomerOrderEmailData,
): string {
  const statusInfo =
    STATUS_CONTENT[data.status];

  const customerName =
    data.customerName?.trim() || 'Customer';

  const paymentMethod =
    formatPaymentMethod(
      data.paymentMethod,
    );

  const paymentText = data.paymentStatus
    ? `${paymentMethod} — ${formatPaymentMethod(
        data.paymentStatus,
      )}`
    : paymentMethod;

  const cancelled =
    data.status === 'CANCELLED';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta
    http-equiv="Content-Type"
    content="text/html; charset=UTF-8"
  />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    ${escapeHtml(statusInfo.label)} —
    Order ${escapeHtml(data.orderNumber)}
  </title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
  "
>
  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    "
  >
    <tr>
      <td
        align="center"
        style="padding: 35px 15px;"
      >

        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width: 900px;
            background-color: #ffffff;
          "
        >

          <!-- ========================= -->
          <!-- LOGO -->
          <!-- ========================= -->

          <tr>
            <td
              align="center"
              style="
                padding: 55px 30px 45px;
                background-color: #ffffff;
              "
            >
              <img
                src="${escapeHtml(data.logoUrl)}"
                alt="JPL Medwin"
                width="300"
                style="
                  display: block;
                  width: 300px;
                  max-width: 100%;
                  height: auto;
                  border: 0;
                  outline: none;
                  text-decoration: none;
                "
              />
            </td>
          </tr>

          <!-- ========================= -->
          <!-- ORDER HEADER -->
          <!-- ========================= -->

          <tr>
            <td
              style="
                padding: 0 70px;
              "
            >
              <div
                style="
                  height: 3px;
                  background-color: #222222;
                  width: 100%;
                "
              ></div>

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr>
                  <td
                    style="
                      padding: 18px 0;
                      font-family: Georgia, 'Times New Roman', serif;
                      font-size: 14px;
                      letter-spacing: 3px;
                      color: #333333;
                    "
                  >
                    ORDER UPDATE
                  </td>

                  <td
                    align="center"
                    style="
                      padding: 18px 10px;
                      font-family: Georgia, 'Times New Roman', serif;
                      font-size: 14px;
                      letter-spacing: 2px;
                      color: #777777;
                      white-space: nowrap;
                    "
                  >
                    ${escapeHtml(data.orderDate)}
                  </td>

                  <td
                    align="right"
                    style="
                      padding: 18px 0;
                      font-family: Georgia, 'Times New Roman', serif;
                      font-size: 14px;
                      letter-spacing: 2px;
                      color: #333333;
                      white-space: nowrap;
                    "
                  >
                    Order ID
                    ${escapeHtml(data.orderNumber)}
                  </td>
                </tr>
              </table>

              <div
                style="
                  height: 1px;
                  background-color: #222222;
                  width: 100%;
                "
              ></div>
            </td>
          </tr>

          <!-- ========================= -->
          <!-- STATUS -->
          <!-- ========================= -->

          <tr>
            <td
              style="
                padding: 55px 70px 25px;
              "
            >
              <div
                style="
                  font-family: Georgia, 'Times New Roman', serif;
                  font-size: 18px;
                  line-height: 25px;
                  letter-spacing: 5px;
                  color: ${
                    cancelled
                      ? '#d62828'
                      : '#e6007e'
                  };
                  font-weight: bold;
                "
              >
                ${escapeHtml(statusInfo.label)}
              </div>

              <div
                style="
                  margin-top: 25px;
                  font-family: Georgia, 'Times New Roman', serif;
                  font-size: 46px;
                  line-height: 54px;
                  color: #222222;
                  font-weight: bold;
                "
              >
                ${escapeHtml(statusInfo.title)}
              </div>

              <div
                style="
                  margin-top: 22px;
                  font-family: Georgia, 'Times New Roman', serif;
                  font-size: 18px;
                  line-height: 30px;
                  color: #444444;
                "
              >
                Dear ${escapeHtml(customerName)},<br /><br />

                ${escapeHtml(statusInfo.message)}
              </div>
            </td>
          </tr>

          <!-- ========================= -->
          <!-- PROGRESS -->
          <!-- ========================= -->

          ${
            !cancelled
              ? `
                <tr>
                  <td
                    style="
                      padding: 0 70px;
                    "
                  >
                    ${renderProgressTracker(
                      data.status,
                    )}
                  </td>
                </tr>
              `
              : ''
          }

          <!-- ========================= -->
          <!-- ORDER PLACED -->
          <!-- ========================= -->

          <tr>
            <td
              style="
                padding: 25px 70px 0;
              "
            >
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr>
                  <td
                    width="38%"
                    valign="top"
                    style="
                      padding: 10px 0;
                      font-family: Georgia, 'Times New Roman', serif;
                      font-size: 14px;
                      letter-spacing: 3px;
                      color: #666666;
                    "
                  >
                    ORDER PLACED
                  </td>

                  <td
                    valign="top"
                    style="
                      padding: 10px 0;
                      font-family: Georgia, 'Times New Roman', serif;
                      font-size: 17px;
                      color: #262626;
                    "
                  >
                    ${escapeHtml(data.orderDate)}
                  </td>
                </tr>

                <tr>
                  <td
                    width="38%"
                    valign="top"
                    style="
                      padding: 10px 0;
                      font-family: Georgia, 'Times New Roman', serif;
                      font-size: 14px;
                      letter-spacing: 3px;
                      color: #666666;
                    "
                  >
                    PAYMENT
                  </td>

                  <td
                    valign="top"
                    style="
                      padding: 10px 0;
                      font-family: Georgia, 'Times New Roman', serif;
                      font-size: 17px;
                      line-height: 26px;
                      color: #262626;
                    "
                  >
                    ${escapeHtml(paymentText)}
                  </td>
                </tr>

                ${
                  data.estimatedDelivery
                    ? `
                      <tr>
                        <td
                          width="38%"
                          valign="top"
                          style="
                            padding: 10px 0;
                            font-family: Georgia, 'Times New Roman', serif;
                            font-size: 14px;
                            letter-spacing: 3px;
                            color: #666666;
                          "
                        >
                          ESTIMATED DELIVERY
                        </td>

                        <td
                          valign="top"
                          style="
                            padding: 10px 0;
                            font-family: Georgia, 'Times New Roman', serif;
                            font-size: 17px;
                            color: #262626;
                          "
                        >
                          ${escapeHtml(
                            data.estimatedDelivery,
                          )}
                        </td>
                      </tr>
                    `
                    : ''
                }
              </table>
            </td>
          </tr>

          <!-- ========================= -->
          <!-- VIEW ORDER BUTTON -->
          <!-- ========================= -->

          ${
            data.orderUrl
              ? `
                <tr>
                  <td
                    align="center"
                    style="
                      padding: 35px 70px;
                    "
                  >
                    <a
                      href="${escapeHtml(data.orderUrl)}"
                      style="
                        display: inline-block;
                        background-color: #078caf;
                        color: #ffffff;
                        text-decoration: none;
                        font-family: Georgia, 'Times New Roman', serif;
                        font-size: 18px;
                        font-weight: bold;
                        padding: 17px 48px;
                      "
                    >
                      View your order
                    </a>
                  </td>
                </tr>
              `
              : ''
          }

          <!-- ========================= -->
          <!-- ORDER DETAILS -->
          <!-- ========================= -->

          <tr>
            <td
              style="
                padding: 30px 70px 0;
              "
            >
              <div
                style="
                  font-family: Georgia, 'Times New Roman', serif;
                  font-size: 15px;
                  letter-spacing: 3px;
                  color: #666666;
                  padding-bottom: 18px;
                "
              >
                ORDER DETAILS —
                ${escapeHtml(data.items.length)}
                ITEMS
              </div>

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                ${renderItems(data.items)}
              </table>
            </td>
          </tr>

          <!-- ========================= -->
          <!-- TOTALS -->
          <!-- ========================= -->

          <tr>
            <td
              style="
                padding: 20px 70px 30px;
              "
            >
              ${renderSummary(data)}
            </td>
          </tr>

          <!-- ========================= -->
          <!-- SHIPPING ADDRESS -->
          <!-- ========================= -->

          <tr>
            <td
              style="
                padding: 20px 70px 35px;
              "
            >
              <div
                style="
                  font-family: Georgia, 'Times New Roman', serif;
                  font-size: 15px;
                  letter-spacing: 3px;
                  color: #666666;
                  margin-bottom: 18px;
                "
              >
                SHIPPING ADDRESS
              </div>

              ${renderAddress(
                data.shippingAddress,
              )}
            </td>
          </tr>

          <!-- ========================= -->
          <!-- REWARDS -->
          <!-- ========================= -->

          ${
            data.earnedCoins !==
            undefined
              ? `
                <tr>
                  <td
                    style="
                      padding: 20px 70px 35px;
                    "
                  >
                    <div
                      style="
                        font-family: Georgia, 'Times New Roman', serif;
                        font-size: 16px;
                        letter-spacing: 4px;
                        color: #e6007e;
                        font-weight: bold;
                        margin-bottom: 14px;
                      "
                    >
                      REWARDS
                    </div>

                    <div
                      style="
                        font-family: Georgia, 'Times New Roman', serif;
                        font-size: 17px;
                        line-height: 27px;
                        color: #333333;
                      "
                    >
                      You’ve earned
                      <strong>
                        ${escapeHtml(
                          data.earnedCoins,
                        )}
                      </strong>
                      reward coins with this order.
                    </div>
                  </td>
                </tr>
              `
              : ''
          }

          <!-- ========================= -->
          <!-- SUPPORT -->
          <!-- ========================= -->

          <tr>
            <td
              style="
                padding: 20px 70px 45px;
              "
            >
              <div
                style="
                  height: 1px;
                  background-color: #222222;
                  margin-bottom: 40px;
                "
              ></div>

              ${renderSupport(data)}
            </td>
          </tr>

          <!-- ========================= -->
          <!-- FOOTER -->
          <!-- ========================= -->

          <tr>
            <td
              align="center"
              style="
                padding: 0 70px 50px;
              "
            >
              <div
                style="
                  height: 1px;
                  background-color: #222222;
                  margin-bottom: 30px;
                "
              ></div>

              <div
                style="
                  font-family: Georgia, 'Times New Roman', serif;
                  font-size: 14px;
                  line-height: 23px;
                  color: #777777;
                  font-style: italic;
                "
              >
                This is an auto-generated email —
                please do not reply directly to it.
              </div>

              <div
                style="
                  margin-top: 18px;
                  font-family: Arial, Helvetica, sans-serif;
                  font-size: 12px;
                  color: #999999;
                "
              >
                © ${new Date().getFullYear()}
                JPL Markwin. All rights reserved.
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}