export interface OrderDetailsEmailData {
  order: any;
  customerName: string;
  customerEmail?: string;
}

// ==========================================================================
// Brand tokens — matches the JPL Medwin website / order PDF
// ==========================================================================
const COLOR = {
  primary: '#0f766e',
  primaryDark: '#0c5c56',
  primarySoft: '#f0fdfa',
  accent: '#059669',
  accentSoft: '#ecfdf5',
  text: '#111827',
  textMuted: '#6b7280',
  border: '#e5e7eb',
  rowAlt: '#f9fafb',
};

function escapeHtml(input: unknown): string {
  return String(input ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function money(input: unknown): string {
  return `Rs. ${Number(input ?? 0).toLocaleString('en-IN')}`;
}

function text(input: unknown, fallback = '-'): string {
  if (input === null || input === undefined || input === '') return fallback;
  return escapeHtml(input);
}

function hasValue(input: unknown): boolean {
  return input !== null && input !== undefined && input !== '';
}

function formatDate(input: unknown): string {
  if (!input) return '-';
  try {
    return new Date(input as string | Date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(input);
  }
}

// ==========================================================================
// Address — compact, table-based (no flexbox, for email-client support)
// ==========================================================================
function addressCard(title: string, address: any, side: 'left' | 'right'): string {
  const pad = side === 'left' ? '0 8px 0 0' : '0 0 0 8px';
  const body = !address
    ? `<div style="font-size:13px;color:${COLOR.textMuted};">Not available</div>`
    : `
      <div style="font-size:13.5px;font-weight:700;color:${COLOR.text};margin-bottom:4px;">
        ${text(address.fullName)}
      </div>
      <div style="font-size:12.5px;line-height:1.6;color:${COLOR.textMuted};">
        ${text(address.phoneNumber)}<br/>
        ${[address.addressLine1, address.addressLine2].filter(hasValue).map((v) => text(v)).join(', ')}
        ${address.landmark ? `<br/>Near ${text(address.landmark)}` : ''}<br/>
        ${[address.city, address.state, address.postalCode].filter(hasValue).map((v) => text(v)).join(', ')}<br/>
        ${text(address.country)}
      </div>
    `;

  return `
    <td width="50%" valign="top" style="padding:${pad};">
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${COLOR.border};border-radius:8px;">
        <tr>
          <td style="padding:14px;">
            <div style="font-size:10.5px;font-weight:700;letter-spacing:.3px;color:${COLOR.primaryDark};margin-bottom:8px;text-transform:uppercase;">
              ${escapeHtml(title)}
            </div>
            ${body}
          </td>
        </tr>
      </table>
    </td>
  `;
}

// ==========================================================================
// Items table
// ==========================================================================
function itemsRows(items: any[]): string {
  if (!items.length) {
    return `
      <tr>
        <td colspan="4" style="padding:18px;text-align:center;color:${COLOR.textMuted};font-size:13px;">
          No order items found
        </td>
      </tr>
    `;
  }

  return items
    .map((item, index) => {
      const variant = item?.variant ?? {};
      const itemTotals = item?.totals ?? {};
      const quantity = Number(item?.quantity ?? variant?.quantity ?? 0);
      const sellingPrice = Number(variant?.pricing?.sellingPrice ?? 0);
      const subtotal = Number(itemTotals?.subtotal ?? sellingPrice * quantity);
      const subLine = [variant?.name ?? item?.variantName, variant?.sku ? `SKU: ${variant.sku}` : null]
        .filter(hasValue)
        .map((v) => text(v))
        .join(' &middot; ');
      const rowBg = index % 2 === 1 ? COLOR.rowAlt : '#ffffff';

      return `
        <tr style="background:${rowBg};">
          <td style="padding:12px 14px;border-bottom:1px solid ${COLOR.border};vertical-align:top;">
            <div style="font-size:13px;font-weight:700;color:${COLOR.text};">${text(item?.productName)}</div>
            ${subLine ? `<div style="margin-top:2px;font-size:11px;color:${COLOR.textMuted};">${subLine}</div>` : ''}
          </td>
          <td style="padding:12px 14px;border-bottom:1px solid ${COLOR.border};text-align:center;vertical-align:top;font-size:13px;color:${COLOR.text};">
            ${quantity}
          </td>
          <td style="padding:12px 14px;border-bottom:1px solid ${COLOR.border};text-align:right;vertical-align:top;font-size:13px;color:${COLOR.text};white-space:nowrap;">
            ${money(sellingPrice)}
          </td>
          <td style="padding:12px 14px;border-bottom:1px solid ${COLOR.border};text-align:right;vertical-align:top;font-size:13px;font-weight:700;color:${COLOR.text};white-space:nowrap;">
            ${money(subtotal)}
          </td>
        </tr>
      `;
    })
    .join('');
}

// ==========================================================================
// Summary row
// ==========================================================================
function summaryRow(label: string, amount: number, opts?: { grand?: boolean }): string {
  if (opts?.grand) {
    return `
      <tr>
        <td colspan="2" style="padding-top:8px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:${COLOR.accentSoft};border-radius:8px;">
            <tr>
              <td style="padding:12px 14px;font-size:14px;font-weight:700;color:${COLOR.accent};">Grand Total</td>
              <td style="padding:12px 14px;text-align:right;font-size:15px;font-weight:700;color:${COLOR.accent};">${money(amount)}</td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }

  return `
    <tr>
      <td style="padding:5px 0;font-size:12.5px;color:${COLOR.textMuted};">${escapeHtml(label)}</td>
      <td style="padding:5px 0;text-align:right;font-size:12.5px;color:${COLOR.text};">${money(amount)}</td>
    </tr>
  `;
}

// ==========================================================================
// Main template — main content only (full detail lives in the PDF)
// ==========================================================================
export function renderOrderDetailsEmail(data: OrderDetailsEmailData): string {
  const { order, customerName, customerEmail } = data;

  const totals = order?.totals ?? {};
  const summary = order?.summary ?? {};
  const items = Array.isArray(order?.items) ? order.items : [];

  const subtotal = Number(summary?.subtotal ?? totals?.subtotal ?? 0);
  const productDiscount = Number(
    summary?.productDiscount ??
      items.reduce((sum: number, item: any) => sum + Number(item?.totals?.discount ?? 0), 0),
  );
  const shipping = Number(summary?.shipping ?? totals?.shippingCharge ?? 0);
  const tax = Number(summary?.tax ?? totals?.tax ?? 0);
  const grandTotal = Number(summary?.grandTotal ?? totals?.grandTotal ?? order?.grandTotal ?? 0);
  const isFreeShipping = summary?.isFreeShipping ?? shipping === 0;
  const sameAsShipping = Boolean(order?.isBillingSameAsShipping);

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Order ${escapeHtml(order?.orderNumber)}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 0;">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid ${COLOR.border};border-radius:12px;overflow:hidden;">

  <!-- HEADER -->
  <tr>
    <td style="background:${COLOR.primary};padding:22px 28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:18px;font-weight:700;color:#ffffff;">New Order Received</td>
          <td style="text-align:right;font-size:15px;font-weight:700;color:#ffffff;">${text(order?.orderNumber)}</td>
        </tr>
        <tr>
          <td style="font-size:11.5px;color:#ffffff;opacity:.85;padding-top:2px;">JPL Medwin Order Management</td>
          <td style="text-align:right;font-size:11px;color:#ffffff;opacity:.85;padding-top:2px;">${formatDate(order?.createdAt)}</td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- BODY -->
  <tr>
    <td style="padding:24px 28px;">

      <!-- OVERVIEW -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
        <tr>
          <td width="50%" style="font-size:12px;color:${COLOR.textMuted};padding-bottom:2px;">Customer</td>
          <td width="50%" style="font-size:12px;color:${COLOR.textMuted};padding-bottom:2px;">Status</td>
        </tr>
        <tr>
          <td style="font-size:13.5px;font-weight:700;color:${COLOR.text};padding-bottom:10px;">${text(customerName)}</td>
          <td style="font-size:13.5px;font-weight:700;color:${COLOR.text};padding-bottom:10px;">${text(order?.status)}</td>
        </tr>
        <tr>
          <td style="font-size:12px;color:${COLOR.textMuted};padding-bottom:2px;">Email</td>
          <td style="font-size:12px;color:${COLOR.textMuted};padding-bottom:2px;">Payment</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:${COLOR.text};">${text(customerEmail, 'Not available')}</td>
          <td style="font-size:13px;color:${COLOR.text};">${text(order?.paymentStatus)} &middot; ${text(order?.paymentMethod, '')}</td>
        </tr>
      </table>

      <!-- ADDRESSES -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;">
        <tr>
          ${addressCard('Shipping Address', order?.shippingAddress, 'left')}
          ${
            sameAsShipping
              ? `<td width="50%" valign="top" style="padding:0 0 0 8px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${COLOR.border};border-radius:8px;">
                    <tr><td style="padding:14px;">
                      <div style="font-size:10.5px;font-weight:700;letter-spacing:.3px;color:${COLOR.primaryDark};margin-bottom:8px;text-transform:uppercase;">Billing Address</div>
                      <div style="font-size:12.5px;color:${COLOR.textMuted};">Same as shipping address</div>
                    </td></tr>
                  </table>
                </td>`
              : addressCard('Billing Address', order?.billingAddress, 'right')
          }
        </tr>
      </table>

      <!-- ITEMS -->
      <div style="font-size:10.5px;font-weight:700;letter-spacing:.3px;color:${COLOR.primaryDark};margin-bottom:8px;text-transform:uppercase;">
        Order Items (${items.length})
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${COLOR.border};border-radius:8px;overflow:hidden;margin-bottom:22px;">
        <tr style="background:${COLOR.primarySoft};">
          <th align="left" style="padding:10px 14px;font-size:10.5px;color:${COLOR.primaryDark};text-transform:uppercase;">Product</th>
          <th align="center" style="padding:10px 14px;font-size:10.5px;color:${COLOR.primaryDark};text-transform:uppercase;">Qty</th>
          <th align="right" style="padding:10px 14px;font-size:10.5px;color:${COLOR.primaryDark};text-transform:uppercase;">Price</th>
          <th align="right" style="padding:10px 14px;font-size:10.5px;color:${COLOR.primaryDark};text-transform:uppercase;">Subtotal</th>
        </tr>
        ${itemsRows(items)}
      </table>

      <!-- SUMMARY -->
      <div style="font-size:10.5px;font-weight:700;letter-spacing:.3px;color:${COLOR.primaryDark};margin-bottom:8px;text-transform:uppercase;">
        Order Summary
      </div>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${summaryRow('Subtotal', subtotal)}
        ${productDiscount ? summaryRow('Product Discount', -productDiscount) : ''}
        ${summaryRow('Shipping', shipping)}
        ${tax ? summaryRow('Tax', tax) : ''}
        ${summaryRow('Grand Total', grandTotal, { grand: true })}
      </table>

      ${
        isFreeShipping
          ? `<div style="margin-top:14px;font-size:12px;font-weight:700;color:${COLOR.accent};">&#10003; Free Shipping</div>`
          : ''
      }

    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="padding:16px 28px;background:${COLOR.rowAlt};border-top:1px solid ${COLOR.border};text-align:center;">
      <div style="font-size:11px;color:${COLOR.textMuted};">JPL Medwin &mdash; Automated Order Notification</div>
    </td>
  </tr>

</table>
</td>
</tr>
</table>
</body>
</html>
`;
}