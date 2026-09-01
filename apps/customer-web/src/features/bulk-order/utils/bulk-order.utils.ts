import { BULK_ORDER_WHATSAPP_NUMBER } from "../constants/bulk-order.constants";
import { BulkOrderData } from "../types/bulk-order.types";

/**
 * Builds the structured prefilled text message for WhatsApp bulk orders.
 */
export function buildBulkOrderMessage(data: BulkOrderData & { requestedQuantity: number }): string {
  const lines: string[] = [
    "Hello JPL Medwin, I would like to place a bulk order.",
    "",
    `Product: ${data.productName || "Medical Product"}`,
  ];

  if (data.variantName && data.variantName !== data.productName) {
    lines.push(`Variant: ${data.variantName}`);
  }

  if (data.attributes) {
    let attrStr = "";
    if (Array.isArray(data.attributes)) {
      attrStr = data.attributes
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
    } else if (typeof data.attributes === "object") {
      attrStr = Object.entries(data.attributes)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
    }
    if (attrStr) {
      lines.push(`Specifications: ${attrStr}`);
    }
  }

  lines.push(`Requested Quantity: ${data.requestedQuantity} units`);

  if (data.sellingPrice && data.sellingPrice > 0) {
    lines.push(`Unit Website Price: ₹${data.sellingPrice.toLocaleString("en-IN")}`);
  }

  lines.push("");
  lines.push("Please provide bulk order pricing, discount slabs, and estimated delivery timeline.");

  if (typeof window !== "undefined" && data.productSlug) {
    const productUrl = `${window.location.origin}/products/${data.productSlug}`;
    lines.push(`Product Link: ${productUrl}`);
  }

  return lines.join("\n");
}

/**
 * Generates the full WhatsApp URL with encoded message.
 */
export function buildBulkOrderWhatsAppUrl(
  data: BulkOrderData & { requestedQuantity: number },
  customNumber?: string,
): string {
  const number = (customNumber || BULK_ORDER_WHATSAPP_NUMBER).replace(/\D/g, "");
  const message = buildBulkOrderMessage(data);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens WhatsApp in a new tab or app.
 */
export function openBulkOrderWhatsApp(
  data: BulkOrderData & { requestedQuantity: number },
  customNumber?: string,
): void {
  if (typeof window === "undefined") return;

  const url = buildBulkOrderWhatsAppUrl(data, customNumber);
  window.open(url, "_blank", "noopener,noreferrer");
}
