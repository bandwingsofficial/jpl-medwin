import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const missingShippingSnapshot = await prisma.$queryRaw<
    { id: string; orderNumber: string; shippingAddressId: string }[]
  >`
    SELECT id, "orderNumber", "shippingAddressId"
    FROM "orders"
    WHERE "deletedAt" IS NULL
      AND "shippingAddressId" IS NOT NULL
      AND "shippingAddressSnapshot" IS NULL
  `;

  const missingBillingSnapshot = await prisma.$queryRaw<
    { id: string; orderNumber: string; billingAddressId: string }[]
  >`
    SELECT id, "orderNumber", "billingAddressId"
    FROM "orders"
    WHERE "deletedAt" IS NULL
      AND "billingAddressId" IS NOT NULL
      AND "billingAddressSnapshot" IS NULL
  `;

  const mismatchedSameAsShipping = await prisma.$queryRaw<
    { id: string; orderNumber: string }[]
  >`
    SELECT id, "orderNumber"
    FROM "orders"
    WHERE "deletedAt" IS NULL
      AND "isBillingSameAsShipping" = true
      AND "shippingAddressSnapshot" IS NOT NULL
      AND "billingAddressSnapshot" IS DISTINCT FROM "shippingAddressSnapshot"
  `;

  const coverage = await prisma.$queryRaw<
    {
      orders_with_shipping_fk: bigint;
      orders_with_shipping_snapshot: bigint;
      orders_with_billing_fk: bigint;
      orders_with_billing_snapshot: bigint;
    }[]
  >`
    SELECT
      COUNT(*) FILTER (WHERE "shippingAddressId" IS NOT NULL) AS orders_with_shipping_fk,
      COUNT(*) FILTER (WHERE "shippingAddressSnapshot" IS NOT NULL) AS orders_with_shipping_snapshot,
      COUNT(*) FILTER (WHERE "billingAddressId" IS NOT NULL) AS orders_with_billing_fk,
      COUNT(*) FILTER (WHERE "billingAddressSnapshot" IS NOT NULL) AS orders_with_billing_snapshot
    FROM "orders"
    WHERE "deletedAt" IS NULL
  `;

  const orphanShippingFk = await prisma.$queryRaw<
    { id: string; orderNumber: string; shippingAddressId: string }[]
  >`
    SELECT o.id, o."orderNumber", o."shippingAddressId"
    FROM "orders" o
    LEFT JOIN "SavedAddress" sa ON sa.id = o."shippingAddressId"
    WHERE o."deletedAt" IS NULL
      AND o."shippingAddressId" IS NOT NULL
      AND sa.id IS NULL
  `;

  const orphanBillingFk = await prisma.$queryRaw<
    { id: string; orderNumber: string; billingAddressId: string }[]
  >`
    SELECT o.id, o."orderNumber", o."billingAddressId"
    FROM "orders" o
    LEFT JOIN "SavedAddress" sa ON sa.id = o."billingAddressId"
    WHERE o."deletedAt" IS NULL
      AND o."billingAddressId" IS NOT NULL
      AND sa.id IS NULL
  `;

  const fkConstraints = await prisma.$queryRaw<
    { constraint_name: string; table_name: string }[]
  >`
    SELECT tc.constraint_name, tc.table_name
    FROM information_schema.table_constraints tc
    WHERE tc.table_name = 'orders'
      AND tc.constraint_type = 'FOREIGN KEY'
      AND tc.constraint_name LIKE '%Address%'
  `;

  const indexes = await prisma.$queryRaw<
    { indexname: string }[]
  >`
    SELECT indexname
    FROM pg_indexes
    WHERE tablename = 'orders'
      AND indexname LIKE '%Address%'
  `;

  const snapshotColumns = await prisma.$queryRaw<
    { column_name: string; data_type: string }[]
  >`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'orders'
      AND column_name IN (
        'shippingAddressId',
        'billingAddressId',
        'isBillingSameAsShipping',
        'shippingAddressSnapshot',
        'billingAddressSnapshot'
      )
    ORDER BY column_name
  `;

  const legacyJsonColumns = await prisma.$queryRaw<
    { column_name: string }[]
  >`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'orders'
      AND column_name IN ('shippingAddress', 'billingAddress')
  `;

  console.log(JSON.stringify({
    missingShippingSnapshot,
    missingBillingSnapshot,
    mismatchedSameAsShipping,
    coverage: coverage.map((row) => ({
      orders_with_shipping_fk: Number(row.orders_with_shipping_fk),
      orders_with_shipping_snapshot: Number(row.orders_with_shipping_snapshot),
      orders_with_billing_fk: Number(row.orders_with_billing_fk),
      orders_with_billing_snapshot: Number(row.orders_with_billing_snapshot),
    })),
    orphanShippingFk,
    orphanBillingFk,
    fkConstraints,
    indexes,
    snapshotColumns,
    legacyJsonColumns,
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
