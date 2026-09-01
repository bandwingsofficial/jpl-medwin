import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

// ==========================================================================
// Design tokens — pulled from the JPL Medwin website palette
// ==========================================================================
const COLOR = {
  primary: '#0f766e', // teal-700 — brand / header band
  primaryDark: '#0c5c56', // teal-800 — headings
  primarySoft: '#f0fdfa', // teal-50 — table header / highlight fill
  accent: '#059669', // emerald-600 — grand total
  accentSoft: '#ecfdf5', // emerald-50 — grand total fill
  text: '#111827', // gray-900 — primary text
  textMuted: '#6b7280', // gray-500 — labels / secondary text
  textFaint: '#9ca3af', // gray-400 — footer
  border: '#e5e7eb', // gray-200 — hairlines
  rowAlt: '#f9fafb', // gray-50 — zebra rows
  white: '#ffffff',
};

const FONT = { bold: 'Helvetica-Bold', regular: 'Helvetica' };

type Pair = [string, unknown];

@Injectable()
export class OrderDetailsPdfService {
  async generateOrderDetailsPdf(
    order: any,
    customerName: string,
    customerEmail?: string,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 36, left: 36, right: 36, bottom: 0 },
        bufferPages: true,
        info: {
          Title: `Order ${order?.orderNumber ?? ''}`,
          Author: 'JPL Medwin',
          Subject: 'Order Details',
        },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // ---------------------------------------------------------------
      // Layout constants
      // ---------------------------------------------------------------
      const M = doc.page.margins.left;
      const pageWidth =
        doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const footerHeight = 26;
      const bottomLimit = doc.page.height - footerHeight - 10;

      const totals = order?.totals ?? {};
      const summary = order?.summary ?? {};
      const metadata = order?.metadata ?? {};
      const items = Array.isArray(order?.items) ? order.items : [];

      // ---------------------------------------------------------------
      // Small utilities
      // ---------------------------------------------------------------
      const money = (value: unknown) => {
        const n = Number(value ?? 0);
        const sign = n < 0 ? '-' : '';
        return `${sign}Rs. ${Math.abs(n).toLocaleString('en-IN')}`;
      };

      const safe = (value: unknown, fallback = '-'): string => {
        if (value === null || value === undefined || value === '') {
          return fallback;
        }
        return String(value);
      };

      const hasValue = (value: unknown) =>
        value !== null && value !== undefined && value !== '';

      const formatDate = (value: unknown): string => {
        if (!value) return '-';
        try {
          return new Date(value as string | Date).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        } catch {
          return String(value);
        }
      };

      /** Ensures `needed` vertical space is available, adding a page if not. */
      const ensureSpace = (needed: number) => {
        if (doc.y + needed > bottomLimit) {
          doc.addPage();
          doc.y = M;
        }
      };

      /** Section heading with a thin brand-colored rule underneath. */
      const sectionHeader = (title: string) => {
        ensureSpace(26);
        doc
          .font(FONT.bold)
          .fontSize(10.5)
          .fillColor(COLOR.primaryDark)
          .text(title.toUpperCase(), M, doc.y, { characterSpacing: 0.4 });
        const lineY = doc.y + 3;
        doc
          .moveTo(M, lineY)
          .lineTo(M + pageWidth, lineY)
          .lineWidth(0.75)
          .strokeColor(COLOR.border)
          .stroke();
        doc.y = lineY + 8;
      };

      /** Compact two-column label/value grid. Skips pairs with no value. */
      const infoGrid = (pairs: Pair[]) => {
        const rows = pairs.filter(([, v]) => hasValue(v));
        if (!rows.length) return;

        const gap = 18;
        const colWidth = (pageWidth - gap) / 2;
        const rowHeight = 26;
        const rowCount = Math.ceil(rows.length / 2);

        ensureSpace(rowCount * rowHeight + 4);
        const startY = doc.y;

        rows.forEach(([label, value], i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = M + col * (colWidth + gap);
          const y = startY + row * rowHeight;

          doc
            .font(FONT.bold)
            .fontSize(8)
            .fillColor(COLOR.textMuted)
            .text(label.toUpperCase(), x, y, {
              width: colWidth,
              characterSpacing: 0.2,
            });
          doc
            .font(FONT.regular)
            .fontSize(9.5)
            .fillColor(COLOR.text)
            .text(safe(value), x, y + 10, { width: colWidth });
        });

        doc.y = startY + rowCount * rowHeight + 6;
      };

      /** One compact address card used inside the two-up address row. */
      const addressBlock = (x: number, width: number, address: any) => {
        const startY = doc.y;

        if (!address) {
          doc
            .font(FONT.regular)
            .fontSize(9)
            .fillColor(COLOR.textMuted)
            .text('Not available', x, startY, { width });
          return doc.y;
        }

        const lines: string[] = [];
        if (hasValue(address.fullName)) lines.push(address.fullName);
        if (hasValue(address.phoneNumber)) lines.push(address.phoneNumber);

        const addr1 = [address.addressLine1, address.addressLine2]
          .filter(hasValue)
          .join(', ');
        if (addr1) lines.push(addr1);
        if (hasValue(address.landmark)) lines.push(`Near ${address.landmark}`);

        const cityLine = [address.city, address.state, address.postalCode]
          .filter(hasValue)
          .join(', ');
        if (cityLine) lines.push(cityLine);
        if (hasValue(address.country)) lines.push(address.country);

        let y = startY;
        doc.font(FONT.bold).fontSize(9.5).fillColor(COLOR.text);
        doc.text(lines[0] ?? 'Not available', x, y, { width });
        y = doc.y + 1;

        doc.font(FONT.regular).fontSize(8.5).fillColor(COLOR.textMuted);
        lines.slice(1).forEach((line) => {
          doc.text(line, x, y, { width });
          y = doc.y + 1;
        });

        if (address.type || address.alias) {
          const tag = [address.type, address.alias].filter(hasValue).join(' · ');
          doc.font(FONT.regular).fontSize(7.5).fillColor(COLOR.textFaint);
          doc.text(tag, x, y + 2, { width });
          y = doc.y;
        }

        return y;
      };

      const addressRow = (
        shipping: any,
        billing: any,
        sameAsShipping: boolean,
      ) => {
        ensureSpace(90);
        const gap = 16;
        const colWidth = (pageWidth - gap) / 2;
        const startY = doc.y;

        doc
          .font(FONT.bold)
          .fontSize(8.5)
          .fillColor(COLOR.primaryDark)
          .text('SHIPPING ADDRESS', M, startY, { characterSpacing: 0.3 });
        doc
          .font(FONT.bold)
          .fontSize(8.5)
          .fillColor(COLOR.primaryDark)
          .text('BILLING ADDRESS', M + colWidth + gap, startY, {
            characterSpacing: 0.3,
          });

        doc.y = startY + 13;
        const blockTop = doc.y;

        doc.y = blockTop;
        const yLeft = addressBlock(M, colWidth, shipping);

        doc.y = blockTop;
        const yRight = sameAsShipping
          ? (() => {
              doc
                .font(FONT.regular)
                .fontSize(8.5)
                .fillColor(COLOR.textMuted)
                .text('Same as shipping address', M + colWidth + gap, blockTop, {
                  width: colWidth,
                });
              return doc.y;
            })()
          : addressBlock(M + colWidth + gap, colWidth, billing);

        doc.y = Math.max(yLeft, yRight) + 10;
      };

      /** Items table with a shaded header row and zebra striping. */
      const itemsTable = (rows: any[]) => {
        const cols = {
          idx: 20,
          product: 224,
          qty: 34,
          price: 68,
          discount: 68,
          subtotal: 78,
        };
        const colX = {
          idx: M,
          product: M + cols.idx,
          qty: M + cols.idx + cols.product,
          price: M + cols.idx + cols.product + cols.qty,
          discount: M + cols.idx + cols.product + cols.qty + cols.price,
          subtotal:
            M + cols.idx + cols.product + cols.qty + cols.price + cols.discount,
        };

        const drawHeaderRow = () => {
          ensureSpace(22);
          const y = doc.y;
          doc.rect(M, y, pageWidth, 20).fill(COLOR.primarySoft);
          doc.font(FONT.bold).fontSize(8).fillColor(COLOR.primaryDark);
          doc.text('#', colX.idx + 4, y + 6, { width: cols.idx - 4 });
          doc.text('PRODUCT', colX.product + 4, y + 6, { width: cols.product - 8 });
          doc.text('QTY', colX.qty, y + 6, { width: cols.qty, align: 'center' });
          doc.text('PRICE', colX.price, y + 6, {
            width: cols.price - 6,
            align: 'right',
          });
          doc.text('DISCOUNT', colX.discount, y + 6, {
            width: cols.discount - 6,
            align: 'right',
          });
          doc.text('SUBTOTAL', colX.subtotal, y + 6, {
            width: cols.subtotal - 4,
            align: 'right',
          });
          doc.y = y + 20;
        };

        if (!rows.length) {
          drawHeaderRow();
          ensureSpace(20);
          doc
            .font(FONT.regular)
            .fontSize(9)
            .fillColor(COLOR.textMuted)
            .text('No order items found', M, doc.y + 6);
          doc.y += 20;
          return;
        }

        drawHeaderRow();

        rows.forEach((item: any, index: number) => {
          const variant = item?.variant ?? {};
          const itemTotals = item?.totals ?? {};
          const quantity = Number(item?.quantity ?? variant?.quantity ?? 0);
          const sellingPrice = Number(variant?.pricing?.sellingPrice ?? 0);
          const mrp = Number(variant?.pricing?.mrp ?? 0);
          const subtotal = Number(
            itemTotals?.subtotal ?? sellingPrice * quantity,
          );
          const discount = Number(
            itemTotals?.discount ?? mrp * quantity - subtotal,
          );

          const productName = safe(item?.productName);
          const subLine = [
            variant?.name ?? item?.variantName,
            variant?.sku ? `SKU: ${variant.sku}` : null,
          ]
            .filter(hasValue)
            .join(' · ');

          const nameHeight = doc
            .font(FONT.bold)
            .fontSize(9)
            .heightOfString(productName, { width: cols.product - 8 });
          const subHeight = subLine
            ? doc
                .font(FONT.regular)
                .fontSize(7.5)
                .heightOfString(subLine, { width: cols.product - 8 })
            : 0;
          const rowHeight = Math.max(28, 10 + nameHeight + subHeight + 6);

          ensureSpace(rowHeight);
          const y = doc.y;

          if (index % 2 === 1) {
            doc.rect(M, y, pageWidth, rowHeight).fill(COLOR.rowAlt);
          }

          doc
            .font(FONT.regular)
            .fontSize(8.5)
            .fillColor(COLOR.textMuted)
            .text(String(index + 1), colX.idx + 4, y + 8, { width: cols.idx - 4 });

          doc
            .font(FONT.bold)
            .fontSize(9)
            .fillColor(COLOR.text)
            .text(productName, colX.product + 4, y + 7, {
              width: cols.product - 8,
            });
          if (subLine) {
            doc
              .font(FONT.regular)
              .fontSize(7.5)
              .fillColor(COLOR.textMuted)
              .text(subLine, colX.product + 4, y + 7 + nameHeight + 1, {
                width: cols.product - 8,
              });
          }

          doc
            .font(FONT.regular)
            .fontSize(8.5)
            .fillColor(COLOR.text)
            .text(String(quantity), colX.qty, y + 8, {
              width: cols.qty,
              align: 'center',
            });
          doc.text(money(sellingPrice), colX.price, y + 8, {
            width: cols.price - 6,
            align: 'right',
          });
          doc.text(discount > 0 ? money(discount) : '-', colX.discount, y + 8, {
            width: cols.discount - 6,
            align: 'right',
          });
          doc
            .font(FONT.bold)
            .text(money(subtotal), colX.subtotal, y + 8, {
              width: cols.subtotal - 4,
              align: 'right',
            });

          doc.y = y + rowHeight;
          doc
            .moveTo(M, doc.y)
            .lineTo(M + pageWidth, doc.y)
            .lineWidth(0.5)
            .strokeColor(COLOR.border)
            .stroke();
        });

        doc.y += 8;
      };

      /** Right-aligned totals card with a highlighted grand total row. */
      const summaryCard = (rows: Pair[], grandTotal: number) => {
        const visibleRows = rows.filter(([, v]) => hasValue(v) && v !== 0);
        const cardWidth = 240;
        const x = M + pageWidth - cardWidth;
        const rowHeight = 15;
        const totalHeight = visibleRows.length * rowHeight + 34;

        ensureSpace(totalHeight);
        let y = doc.y;

        visibleRows.forEach(([label, value]) => {
          doc
            .font(FONT.regular)
            .fontSize(8.5)
            .fillColor(COLOR.textMuted)
            .text(label, x, y, { width: cardWidth - 90 });
          doc
            .font(FONT.regular)
            .fontSize(8.5)
            .fillColor(COLOR.text)
            .text(typeof value === 'number' ? money(value) : String(value), x, y, {
              width: cardWidth,
              align: 'right',
            });
          y += rowHeight;
        });

        y += 4;
        doc.rect(x, y, cardWidth, 26).fill(COLOR.accentSoft);
        doc
          .font(FONT.bold)
          .fontSize(9.5)
          .fillColor(COLOR.accent)
          .text('GRAND TOTAL', x + 10, y + 8, { width: cardWidth - 110 });
        doc
          .font(FONT.bold)
          .fontSize(11)
          .fillColor(COLOR.accent)
          .text(money(grandTotal), x, y + 7, {
            width: cardWidth - 10,
            align: 'right',
          });

        doc.y = y + 34;
      };

      /** Compact single-line "Label: value" list used for notes/metadata. */
      const inlineList = (entries: [string, unknown][]) => {
        const rows = entries.filter(([, v]) => hasValue(v));
        if (!rows.length) return false;

        rows.forEach(([key, val]) => {
          ensureSpace(14);
          const text =
            typeof val === 'object' ? JSON.stringify(val) : String(val);
          doc
            .font(FONT.bold)
            .fontSize(8.5)
            .fillColor(COLOR.textMuted)
            .text(`${key}: `, M, doc.y, { continued: true, width: pageWidth });
          doc
            .font(FONT.regular)
            .fontSize(8.5)
            .fillColor(COLOR.text)
            .text(text, { width: pageWidth });
          doc.y += 2;
        });
        return true;
      };

      // ===================================================================
      // HEADER
      // ===================================================================
      const headerHeight = 58;
      doc.rect(0, 0, doc.page.width, headerHeight).fill(COLOR.primary);

      doc
        .font(FONT.bold)
        .fontSize(15)
        .fillColor(COLOR.white)
        .text('JPL MEDWIN', M, 16);
      doc
        .font(FONT.regular)
        .fontSize(8)
        .fillColor(COLOR.white)
        .opacity(0.85)
        .text('Order Management', M, 35)
        .opacity(1);

      doc
        .font(FONT.regular)
        .fontSize(8)
        .fillColor(COLOR.white)
        .opacity(0.85)
        .text('ORDER', M, 16, { width: pageWidth, align: 'right' })
        .opacity(1);
      doc
        .font(FONT.bold)
        .fontSize(13)
        .fillColor(COLOR.white)
        .text(safe(order?.orderNumber), M, 27, {
          width: pageWidth,
          align: 'right',
        });
      doc
        .font(FONT.regular)
        .fontSize(8)
        .fillColor(COLOR.white)
        .opacity(0.85)
        .text(formatDate(order?.createdAt), M, 44, {
          width: pageWidth,
          align: 'right',
        })
        .opacity(1);

      doc.y = headerHeight + 16;

      // ===================================================================
      // ORDER OVERVIEW
      // ===================================================================
      sectionHeader('Order Overview');
      infoGrid([
        ['Customer', customerName],
        ['Email', customerEmail ?? 'Not available'],
        ['Status', order?.status],
        ['Payment Status', order?.paymentStatus],
        ['Payment Method', order?.paymentMethod ?? metadata?.paymentMethod],
        ['GST Number', order?.gstNumber ?? order?.notes?.gstNumber],
        ['Order ID', order?.id],
        ['Updated At', formatDate(order?.updatedAt)],
      ]);

      // ===================================================================
      // ADDRESSES
      // ===================================================================
      sectionHeader('Delivery Details');
      addressRow(
        order?.shippingAddress,
        order?.billingAddress,
        Boolean(order?.isBillingSameAsShipping),
      );

      // ===================================================================
      // ORDER ITEMS
      // ===================================================================
      sectionHeader(`Order Items (${items.length})`);
      itemsTable(items);

      // ===================================================================
      // ORDER SUMMARY
      // ===================================================================
      sectionHeader('Order Summary');

      const totalQuantity = Number(
        summary?.totalQuantity ??
          items.reduce(
            (sum: number, item: any) =>
              sum + Number(item?.quantity ?? item?.variant?.quantity ?? 0),
            0,
          ),
      );
      const mrpTotal = Number(
        summary?.mrpTotal ??
          items.reduce(
            (sum: number, item: any) => sum + Number(item?.totals?.mrpTotal ?? 0),
            0,
          ),
      );
      const productDiscount = Number(
        summary?.productDiscount ??
          items.reduce(
            (sum: number, item: any) => sum + Number(item?.totals?.discount ?? 0),
            0,
          ),
      );
      const subtotal = Number(summary?.subtotal ?? totals?.subtotal ?? 0);
      const couponDiscount = Number(
        summary?.couponDiscount ?? totals?.couponDiscount ?? 0,
      );
      const rewardDiscount = Number(
        summary?.rewardDiscount ?? totals?.redeemedAmount ?? 0,
      );
      const shipping = Number(summary?.shipping ?? totals?.shippingCharge ?? 0);
      const overweightDeliveryCharge = Number(
        summary?.overweightDeliveryCharge ??
          totals?.overweightDeliveryCharge ??
          0,
      );
      const tax = Number(summary?.tax ?? totals?.tax ?? 0);
      const grandTotal = Number(
        summary?.grandTotal ?? totals?.grandTotal ?? order?.grandTotal ?? 0,
      );
      const isFreeShipping = summary?.isFreeShipping ?? shipping === 0;

      infoGrid([
        ['Total Products', summary?.totalProducts ?? items.length],
        ['Total Quantity', totalQuantity],
        ['Free Shipping', isFreeShipping ? 'Yes' : 'No'],
        [
          'Redeemed Coins / Amount',
          hasValue(totals?.redeemedCoins)
            ? `${totals.redeemedCoins} (${money(totals?.redeemedAmount ?? 0)})`
            : null,
        ],
        ['Earned Coins', totals?.earnedCoins],
      ]);

      doc.moveDown(0.3);
      summaryCard(
        [
          ['MRP Total', mrpTotal],
          ['Product Discount', -productDiscount],
          ['Subtotal', subtotal],
          ['Coupon Discount', -couponDiscount],
          ['Reward Discount', -rewardDiscount],
          ['Shipping', shipping],
          ['Overweight Delivery Charge', overweightDeliveryCharge],
          ['Tax', tax],
        ],
        grandTotal,
      );

      // ===================================================================
      // NOTES & METADATA  (only rendered when data exists)
      // ===================================================================
      const notesEntries =
        order?.notes && typeof order.notes === 'object'
          ? Object.entries(order.notes)
          : [];
      if (notesEntries.length) {
        sectionHeader('Order Notes');
        inlineList(notesEntries as [string, unknown][]);
        doc.y += 6;
      }

      const metadataEntries =
        metadata && typeof metadata === 'object' ? Object.entries(metadata) : [];
      if (metadataEntries.length) {
        sectionHeader('Order Metadata');
        inlineList(metadataEntries as [string, unknown][]);
        doc.y += 6;
      }

      // ===================================================================
      // STATUS DETAILS (only rendered when relevant data exists)
      // ===================================================================
      const statusEntries: [string, unknown][] = [
        ['Return Request', order?.returnRequest],
        ['Cancellation Reason', order?.cancellationReason],
        ['Cancelled By', order?.cancelledBy],
        [
          'Shipment',
          order?.shipment && Object.keys(order.shipment).length
            ? JSON.stringify(order.shipment)
            : null,
        ],
        [
          'Refund',
          order?.refund && Object.keys(order.refund).length
            ? JSON.stringify(order.refund)
            : null,
        ],
      ];
      if (statusEntries.some(([, v]) => hasValue(v))) {
        sectionHeader('Status Details');
        inlineList(statusEntries);
      }

      // ===================================================================
      // FOOTER — printed on every buffered page
      // ===================================================================
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        const footerY = doc.page.height - 24;
        doc
          .moveTo(M, footerY - 6)
          .lineTo(doc.page.width - M, footerY - 6)
          .lineWidth(0.5)
          .strokeColor(COLOR.border)
          .stroke();
        doc
          .font(FONT.regular)
          .fontSize(7)
          .fillColor(COLOR.textFaint)
          .text(
            `JPL Medwin - Automated Order Notification   |   Page ${i + 1} of ${range.count}`,
            M,
            footerY,
            { width: pageWidth, align: 'center' },
          );
      }

      doc.end();
    });
  }
}