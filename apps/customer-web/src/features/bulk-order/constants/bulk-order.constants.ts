/**
 * Maximum quantity allowed for a single product or variant through the normal website cart.
 * Quantities of 6 or more must be placed as a bulk order via WhatsApp.
 */
export const MAX_CART_ITEM_QUANTITY = 5;

/**
 * Default quantity suggested when opening the Bulk Order dialog (must be > MAX_CART_ITEM_QUANTITY).
 */
export const DEFAULT_BULK_ORDER_QUANTITY = 10;

/**
 * WhatsApp phone number configured for JPL Medwin bulk orders.
 * Reads from NEXT_PUBLIC_BULK_ORDER_WHATSAPP_NUMBER or defaults to the verified support number.
 */
export const BULK_ORDER_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_BULK_ORDER_WHATSAPP_NUMBER?.trim() || "919187969350";
