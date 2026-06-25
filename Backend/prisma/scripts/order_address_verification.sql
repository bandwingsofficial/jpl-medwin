-- Post-migration verification queries for Order + SavedAddress integration.
-- Run manually after applying migrations 20260616120000 and 20260616130000.

-- 1) Orders missing shipping snapshot while FK exists
SELECT id, "orderNumber", "shippingAddressId"
FROM "orders"
WHERE "deletedAt" IS NULL
  AND "shippingAddressId" IS NOT NULL
  AND "shippingAddressSnapshot" IS NULL;

-- 2) Orders missing billing snapshot while FK exists
SELECT id, "orderNumber", "billingAddressId"
FROM "orders"
WHERE "deletedAt" IS NULL
  AND "billingAddressId" IS NOT NULL
  AND "billingAddressSnapshot" IS NULL;

-- 3) Same-as-shipping orders with mismatched billing snapshot
SELECT id, "orderNumber"
FROM "orders"
WHERE "deletedAt" IS NULL
  AND "isBillingSameAsShipping" = true
  AND "shippingAddressSnapshot" IS NOT NULL
  AND "billingAddressSnapshot" IS DISTINCT FROM "shippingAddressSnapshot";

-- 4) Snapshot coverage summary
SELECT
  COUNT(*) FILTER (WHERE "shippingAddressId" IS NOT NULL) AS orders_with_shipping_fk,
  COUNT(*) FILTER (WHERE "shippingAddressSnapshot" IS NOT NULL) AS orders_with_shipping_snapshot,
  COUNT(*) FILTER (WHERE "billingAddressId" IS NOT NULL) AS orders_with_billing_fk,
  COUNT(*) FILTER (WHERE "billingAddressSnapshot" IS NOT NULL) AS orders_with_billing_snapshot
FROM "orders"
WHERE "deletedAt" IS NULL;

-- 5) Orphan FK references (address row missing)
SELECT o.id, o."orderNumber", o."shippingAddressId"
FROM "orders" o
LEFT JOIN "SavedAddress" sa ON sa.id = o."shippingAddressId"
WHERE o."deletedAt" IS NULL
  AND o."shippingAddressId" IS NOT NULL
  AND sa.id IS NULL;

SELECT o.id, o."orderNumber", o."billingAddressId"
FROM "orders" o
LEFT JOIN "SavedAddress" sa ON sa.id = o."billingAddressId"
WHERE o."deletedAt" IS NULL
  AND o."billingAddressId" IS NOT NULL
  AND sa.id IS NULL;
