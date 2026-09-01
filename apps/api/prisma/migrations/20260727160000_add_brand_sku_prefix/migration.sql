-- Add skuPrefix column (nullable first for backfill)
ALTER TABLE "Brand" ADD COLUMN "skuPrefix" TEXT;

-- Backfill from slug: uppercase alphanumeric, first 3 chars (min 2)
UPDATE "Brand"
SET "skuPrefix" = UPPER(
  LEFT(
    REGEXP_REPLACE("slug", '[^a-zA-Z0-9]', '', 'g'),
    3
  )
)
WHERE "skuPrefix" IS NULL
  AND LENGTH(REGEXP_REPLACE("slug", '[^a-zA-Z0-9]', '', 'g')) >= 2;

-- Fallback for very short slugs: use up to 6 chars
UPDATE "Brand"
SET "skuPrefix" = UPPER(
  LEFT(
    REGEXP_REPLACE("slug", '[^a-zA-Z0-9]', '', 'g'),
    6
  )
)
WHERE "skuPrefix" IS NULL OR LENGTH("skuPrefix") < 2;

-- Resolve duplicate prefixes by appending row number
WITH ranked AS (
  SELECT
    id,
    "skuPrefix" AS base,
    ROW_NUMBER() OVER (PARTITION BY "skuPrefix" ORDER BY "createdAt", id) AS rn
  FROM "Brand"
  WHERE "skuPrefix" IS NOT NULL
)
UPDATE "Brand" b
SET "skuPrefix" = CASE
  WHEN r.rn = 1 THEN r.base
  ELSE LEFT(r.base, GREATEST(2, 6 - LENGTH(r.rn::text))) || r.rn::text
END
FROM ranked r
WHERE b.id = r.id;

-- Enforce constraints
ALTER TABLE "Brand" ALTER COLUMN "skuPrefix" SET NOT NULL;
CREATE UNIQUE INDEX "Brand_skuPrefix_key" ON "Brand"("skuPrefix");
CREATE INDEX "Brand_skuPrefix_idx" ON "Brand"("skuPrefix");
