-- Add immutable address snapshots to orders
ALTER TABLE "orders"
ADD COLUMN "shippingAddressSnapshot" JSONB,
ADD COLUMN "billingAddressSnapshot" JSONB;

-- Backfill shipping snapshots from linked SavedAddress records
UPDATE "orders" o
SET "shippingAddressSnapshot" = jsonb_build_object(
  'id', sa.id,
  'fullName', sa."fullName",
  'phoneNumber', sa."phoneNumber",
  'type', sa.type::text,
  'alias', sa.alias,
  'addressLine1', sa."addressLine1",
  'addressLine2', sa."addressLine2",
  'landmark', sa.landmark,
  'city', sa.city,
  'state', sa.state,
  'country', sa.country,
  'postalCode', sa."postalCode",
  'latitude', CASE WHEN sa.latitude IS NULL THEN NULL ELSE sa.latitude::float END,
  'longitude', CASE WHEN sa.longitude IS NULL THEN NULL ELSE sa.longitude::float END,
  'isDefault', sa."isDefault"
)
FROM "SavedAddress" sa
WHERE o."shippingAddressId" = sa.id
  AND o."shippingAddressSnapshot" IS NULL;

-- Backfill billing snapshots from linked SavedAddress records
UPDATE "orders" o
SET "billingAddressSnapshot" = jsonb_build_object(
  'id', sa.id,
  'fullName', sa."fullName",
  'phoneNumber', sa."phoneNumber",
  'type', sa.type::text,
  'alias', sa.alias,
  'addressLine1', sa."addressLine1",
  'addressLine2', sa."addressLine2",
  'landmark', sa.landmark,
  'city', sa.city,
  'state', sa.state,
  'country', sa.country,
  'postalCode', sa."postalCode",
  'latitude', CASE WHEN sa.latitude IS NULL THEN NULL ELSE sa.latitude::float END,
  'longitude', CASE WHEN sa.longitude IS NULL THEN NULL ELSE sa.longitude::float END,
  'isDefault', sa."isDefault"
)
FROM "SavedAddress" sa
WHERE o."billingAddressId" = sa.id
  AND o."billingAddressSnapshot" IS NULL;

-- Mirror shipping snapshot for same-as-shipping billing when billing snapshot is missing
UPDATE "orders"
SET "billingAddressSnapshot" = "shippingAddressSnapshot"
WHERE "isBillingSameAsShipping" = true
  AND "billingAddressSnapshot" IS NULL
  AND "shippingAddressSnapshot" IS NOT NULL;
