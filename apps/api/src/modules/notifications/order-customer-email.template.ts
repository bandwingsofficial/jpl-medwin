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

const COLORS = {
  accent: '#0798b5',
  accentDark: '#087fa0',
  accentText: '#e6007e',
  danger: '#d62828',
  ink: '#222222',
  body: '#262626',
  muted: '#666666',
  faint: '#999999',
  border: '#e5e5e5',
  track: '#d7d7d7',
  bg: '#f4f4f4',
};

const FONT = "Georgia, 'Times New Roman', serif";

const STATUS_CONTENT: Record<OrderCustomerEmailStatus, StatusContent> = {
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
  },
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
  if (value === null || value === undefined || value === '') {
    return 'Rs. 0';
  }

  const numericValue = typeof value === 'number' ? value : Number(value);

  if (Number.isNaN(numericValue)) {
    return `Rs. ${escapeHtml(value)}`;
  }

  return `Rs. ${numericValue.toLocaleString('en-IN')}`;
}

function formatPaymentMethod(value?: string | null): string {
  if (!value) {
    return 'Payment at delivery';
  }

  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/**
 * Renders the step tracker as dots connected by a horizontal line,
 * using a single email-safe table (no absolute positioning).
 *
 * Layout per row:  dot - connector - dot - connector - dot - connector - dot - connector - dot
 * The connector cell is a 2px-tall bar that is colored solid once the
 * flanking step has been completed, giving the appearance of one
 * continuous progress line running through the circles.
 */
function renderProgressTracker(status: OrderCustomerEmailStatus): string {
  const statusInfo = STATUS_CONTENT[status];
  const activeStep = statusInfo.activeStep;
  const isCancelledLike = status === 'CANCELLED';

  const steps = ['PLACED', 'PACKED', 'SHIPPED', 'DELIVERED'];

  const dotCell = (index: number) => {
    const isDone = !isCancelledLike && activeStep > index;
    const isCurrent = !isCancelledLike && activeStep === index;
    const isActive = isDone || isCurrent;

    return `
      <td width="26" style="width:26px; padding:0;">
        <table role="presentation" width="26" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="height:26px; font-size:0;">
              <div
                style="
                  width: 22px;
                  height: 22px;
                  line-height: 22px;
                  border-radius: 50%;
                  background: ${isActive ? COLORS.accent : '#ffffff'};
                  border: 2px solid ${isActive ? COLORS.accent : COLORS.track};
                  color: #ffffff;
                  font-family: Arial, Helvetica, sans-serif;
                  font-size: 12px;
                  text-align: center;
                "
              >
                ${isDone ? '&#10003;' : ''}
              </div>
            </td>
          </tr>
        </table>
      </td>
    `;
  };

  const connectorCell = (index: number) => {
    // Connector sits between step `index` and step `index + 1`.
    const isActive = !isCancelledLike && activeStep > index;

    return `
      <td style="padding: 0 2px;">
        <div
          style="
            height: 2px;
            line-height: 2px;
            font-size: 0;
            background-color: ${isActive ? COLORS.accent : COLORS.track};
          "
        >&nbsp;</div>
      </td>
    `;
  };

  const labelCell = (index: number) => {
    const isActive = !isCancelledLike && activeStep >= index;

    return `
      <td
        align="center"
        style="
          padding-top: 9px;
          font-family: ${FONT};
          font-size: 11px;
          line-height: 15px;
          letter-spacing: 0.5px;
          color: ${isActive ? COLORS.accentDark : COLORS.faint};
          font-weight: ${isActive ? 'bold' : 'normal'};
        "
      >
        ${escapeHtml(steps[index])}
      </td>
    `;
  };

  // Build the row of dots + connectors.
  let trackRow = '';
  let labelRow = '';

  steps.forEach((_step, index) => {
    trackRow += dotCell(index);
    labelRow += labelCell(index);

    if (index < steps.length - 1) {
      trackRow += connectorCell(index);
      labelRow += `<td></td>`;
    }
  });

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0 20px;">
      <tr>${trackRow}</tr>
      <tr>${labelRow}</tr>
    </table>
  `;
}

function renderItems(items: CustomerOrderEmailItem[]): string {
  return items
    .map(
      (item) => `
        <tr>
          <td
            style="
              padding: 16px 0;
              border-bottom: 1px solid ${COLORS.border};
              font-family: ${FONT};
              color: ${COLORS.body};
            "
          >
            <div style="font-size: 17px; line-height: 23px; font-weight: 500;">
              ${escapeHtml(item.productName)}
            </div>

            ${
              item.variantName
                ? `
                  <div style="margin-top: 5px; color: #777777; font-size: 14px; line-height: 20px;">
                    ${escapeHtml(item.variantName)}
                  </div>
                `
                : ''
            }

            <div style="margin-top: 5px; color: #777777; font-size: 13px; line-height: 18px;">
              Qty ${escapeHtml(item.quantity)}
              ${item.unitPrice !== undefined ? ` &middot; ${formatMoney(item.unitPrice)} each` : ''}
            </div>
          </td>

          <td
            align="right"
            valign="top"
            style="
              padding: 16px 0;
              border-bottom: 1px solid ${COLORS.border};
              font-family: ${FONT};
              color: ${COLORS.body};
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

function renderAddress(address?: CustomerOrderEmailAddress | null): string {
  if (!address) {
    return `
      <div style="font-family: ${FONT}; color: #555555; font-size: 15px; line-height: 24px;">
        Shipping address unavailable.
      </div>
    `;
  }

  const lines = [
    address.name,
    address.addressLine1,
    address.addressLine2,
    [address.city, address.state].filter(Boolean).join(', '),
    address.pincode,
    address.phone ? `Phone: ${address.phone}` : null,
  ].filter(Boolean);

  return `
    <div style="font-family: ${FONT}; color: ${COLORS.body}; font-size: 15px; line-height: 24px;">
      ${lines.map((line) => escapeHtml(line)).join('<br />')}
    </div>
  `;
}

function renderSummary(data: CustomerOrderEmailData): string {
  const row = (label: string, value: string, opts?: { prefix?: string }) => `
    <tr>
      <td style="padding: 7px 0; color: #666666; font-size: 15px; font-family: ${FONT};">
        ${label}
      </td>
      <td align="right" style="padding: 7px 0; color: #333333; font-size: 15px; font-family: ${FONT};">
        ${opts?.prefix ?? ''}${value}
      </td>
    </tr>
  `;

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 10px; font-family: ${FONT};">
      ${row('Item total', formatMoney(data.subtotal))}
      ${
        data.shippingCharge !== undefined
          ? row('Delivery partner fee', formatMoney(data.shippingCharge))
          : ''
      }
      ${
        data.couponDiscount
          ? row('Coupon discount', formatMoney(data.couponDiscount), { prefix: '&minus; ' })
          : ''
      }
      ${
        data.overweightDeliveryCharge
          ? row('Additional delivery charge', formatMoney(data.overweightDeliveryCharge))
          : ''
      }
      ${data.tax ? row('Tax', formatMoney(data.tax)) : ''}

      <tr>
        <td
          style="
            padding: 14px 0 0;
            border-top: 1px solid ${COLORS.ink};
            font-size: 20px;
            font-weight: bold;
            color: ${COLORS.ink};
            font-family: ${FONT};
          "
        >
          Grand total
        </td>
        <td
          align="right"
          style="
            padding: 14px 0 0;
            border-top: 1px solid ${COLORS.ink};
            font-size: 20px;
            font-weight: bold;
            color: ${COLORS.ink};
            font-family: ${FONT};
          "
        >
          ${formatMoney(data.grandTotal)}
        </td>
      </tr>
    </table>
  `;
}

function renderSupport(data: CustomerOrderEmailData): string {
  const linkStyle = 'color:#0084a3; text-decoration: underline;';
  const links: string[] = [];

  if (data.helpCenterUrl) {
    links.push(`<a href="${escapeHtml(data.helpCenterUrl)}" style="${linkStyle}">Help Center</a>`);
  }
  if (data.supportEmail) {
    links.push(
      `<a href="mailto:${escapeHtml(data.supportEmail)}" style="${linkStyle}">${escapeHtml(data.supportEmail)}</a>`,
    );
  }
  if (data.supportPhone) {
    links.push(`<a href="tel:${escapeHtml(data.supportPhone)}" style="${linkStyle}">${escapeHtml(data.supportPhone)}</a>`);
  }
  if (data.supportWhatsApp) {
    links.push(`<a href="${escapeHtml(data.supportWhatsApp)}" style="${linkStyle}">WhatsApp</a>`);
  }

  return `
    <div style="text-align: center; padding-top: 20px;">
      <div style="font-family: ${FONT}; color: ${COLORS.body}; font-size: 20px; line-height: 28px;">
        Questions about your order?
      </div>

      ${
        links.length
          ? `
            <div style="margin-top: 20px; font-family: ${FONT}; font-size: 15px; line-height: 25px;">
              ${links.join('<span style="color:#999999; padding:0 8px;">&middot;</span>')}
            </div>
          `
          : ''
      }
    </div>
  `;
}

export function buildCustomerOrderEmail(data: CustomerOrderEmailData): string {
  const statusInfo = STATUS_CONTENT[data.status];
  const customerName = data.customerName?.trim() || 'Customer';
  const paymentMethod = formatPaymentMethod(data.paymentMethod);
  const paymentText = data.paymentStatus
    ? `${paymentMethod} &mdash; ${formatPaymentMethod(data.paymentStatus)}`
    : paymentMethod;
  const cancelled = data.status === 'CANCELLED';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(statusInfo.label)} — Order ${escapeHtml(data.orderNumber)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.bg};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${COLORS.bg}; margin: 0; padding: 0;">
    <tr>
      <td align="center" style="padding: 35px 15px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 640px; background-color: #ffffff;">

          <!-- LOGO -->
          <tr>
            <td align="center" style="padding: 45px 40px 35px; background-color: #ffffff;">
              <img
                src="${escapeHtml(data.logoUrl)}"
                alt="JPL Medwin"
                width="220"
                style="display: block; width: 220px; max-width: 100%; height: auto; border: 0; outline: none; text-decoration: none;"
              />
            </td>
          </tr>

          <!-- ORDER HEADER -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 3px; background-color: ${COLORS.ink}; width: 100%;"></div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 16px 0; font-family: ${FONT}; font-size: 12px; letter-spacing: 3px; color: #333333;">
                    ORDER UPDATE
                  </td>
                  <td align="center" style="padding: 16px 10px; font-family: ${FONT}; font-size: 12px; letter-spacing: 2px; color: #777777; white-space: nowrap;">
                    ${escapeHtml(data.orderDate)}
                  </td>
                  <td align="right" style="padding: 16px 0; font-family: ${FONT}; font-size: 12px; letter-spacing: 2px; color: #333333; white-space: nowrap;">
                    Order ID ${escapeHtml(data.orderNumber)}
                  </td>
                </tr>
              </table>
              <div style="height: 1px; background-color: ${COLORS.ink}; width: 100%;"></div>
            </td>
          </tr>

          <!-- STATUS -->
          <tr>
            <td style="padding: 45px 40px 20px;">
              <div style="font-family: ${FONT}; font-size: 14px; line-height: 20px; letter-spacing: 4px; color: ${cancelled ? COLORS.danger : COLORS.accentText}; font-weight: bold;">
                ${escapeHtml(statusInfo.label)}
              </div>
              <div style="margin-top: 18px; font-family: ${FONT}; font-size: 32px; line-height: 40px; color: ${COLORS.ink}; font-weight: bold;">
                ${escapeHtml(statusInfo.title)}
              </div>
              <div style="margin-top: 16px; font-family: ${FONT}; font-size: 16px; line-height: 26px; color: #444444;">
                Dear ${escapeHtml(customerName)},<br /><br />
                ${escapeHtml(statusInfo.message)}
              </div>
            </td>
          </tr>

          <!-- PROGRESS -->
          ${
            !cancelled
              ? `
                <tr>
                  <td style="padding: 0 40px;">
                    ${renderProgressTracker(data.status)}
                  </td>
                </tr>
              `
              : ''
          }

          <!-- ORDER META -->
          <tr>
            <td style="padding: 20px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="38%" valign="top" style="padding: 9px 0; font-family: ${FONT}; font-size: 12px; letter-spacing: 2px; color: ${COLORS.muted};">
                    ORDER PLACED
                  </td>
                  <td valign="top" style="padding: 9px 0; font-family: ${FONT}; font-size: 15px; color: ${COLORS.body};">
                    ${escapeHtml(data.orderDate)}
                  </td>
                </tr>
                <tr>
                  <td width="38%" valign="top" style="padding: 9px 0; font-family: ${FONT}; font-size: 12px; letter-spacing: 2px; color: ${COLORS.muted};">
                    PAYMENT
                  </td>
                  <td valign="top" style="padding: 9px 0; font-family: ${FONT}; font-size: 15px; line-height: 24px; color: ${COLORS.body};">
                    ${paymentText}
                  </td>
                </tr>
                ${
                  data.estimatedDelivery
                    ? `
                      <tr>
                        <td width="38%" valign="top" style="padding: 9px 0; font-family: ${FONT}; font-size: 12px; letter-spacing: 2px; color: ${COLORS.muted};">
                          ESTIMATED DELIVERY
                        </td>
                        <td valign="top" style="padding: 9px 0; font-family: ${FONT}; font-size: 15px; color: ${COLORS.body};">
                          ${escapeHtml(data.estimatedDelivery)}
                        </td>
                      </tr>
                    `
                    : ''
                }
              </table>
            </td>
          </tr>

          <!-- VIEW ORDER BUTTON -->
          ${
            data.orderUrl
              ? `
                <tr>
                  <td align="center" style="padding: 30px 40px;">
                    <a
                      href="${escapeHtml(data.orderUrl)}"
                      style="
                        display: inline-block;
                        background-color: ${COLORS.accent};
                        color: #ffffff;
                        text-decoration: none;
                        font-family: ${FONT};
                        font-size: 16px;
                        font-weight: bold;
                        padding: 15px 42px;
                        border-radius: 2px;
                      "
                    >
                      View your order
                    </a>
                  </td>
                </tr>
              `
              : ''
          }

          <!-- ORDER DETAILS -->
          <tr>
            <td style="padding: 25px 40px 0;">
              <div style="font-family: ${FONT}; font-size: 13px; letter-spacing: 2px; color: ${COLORS.muted}; padding-bottom: 16px;">
                ORDER DETAILS &mdash; ${escapeHtml(data.items.length)} ITEM${data.items.length === 1 ? '' : 'S'}
              </div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${renderItems(data.items)}
              </table>
            </td>
          </tr>

          <!-- TOTALS -->
          <tr>
            <td style="padding: 18px 40px 28px;">
              ${renderSummary(data)}
            </td>
          </tr>

          <!-- SHIPPING ADDRESS -->
          <tr>
            <td style="padding: 18px 40px 32px;">
              <div style="font-family: ${FONT}; font-size: 13px; letter-spacing: 2px; color: ${COLORS.muted}; margin-bottom: 16px;">
                SHIPPING ADDRESS
              </div>
              ${renderAddress(data.shippingAddress)}
            </td>
          </tr>

          <!-- REWARDS -->
          ${
            data.earnedCoins !== undefined && data.earnedCoins !== null
              ? `
                <tr>
                  <td style="padding: 18px 40px 32px;">
                    <div style="font-family: ${FONT}; font-size: 14px; letter-spacing: 3px; color: ${COLORS.accentText}; font-weight: bold; margin-bottom: 12px;">
                      REWARDS
                    </div>
                    <div style="font-family: ${FONT}; font-size: 15px; line-height: 25px; color: #333333;">
                      You've earned <strong>${escapeHtml(data.earnedCoins)}</strong> reward coins with this order.
                    </div>
                  </td>
                </tr>
              `
              : ''
          }

          <!-- SUPPORT -->
          <tr>
            <td style="padding: 18px 40px 40px;">
              <div style="height: 1px; background-color: ${COLORS.ink}; margin-bottom: 36px;"></div>
              ${renderSupport(data)}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding: 0 40px 45px;">
              <div style="height: 1px; background-color: ${COLORS.ink}; margin-bottom: 26px;"></div>
              <div style="font-family: ${FONT}; font-size: 13px; line-height: 21px; color: #777777; font-style: italic;">
                This is an auto-generated email — please do not reply directly to it.
              </div>
              <div style="margin-top: 16px; font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #999999;">
                © ${new Date().getFullYear()} JPL Medwin. All rights reserved.
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