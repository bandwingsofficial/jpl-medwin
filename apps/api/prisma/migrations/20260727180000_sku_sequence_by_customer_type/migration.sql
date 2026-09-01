-- Product sequence is scoped by Customer Type only (not Brand).

ALTER TABLE "SkuSequence" DROP CONSTRAINT IF EXISTS "SkuSequence_brandId_fkey";
DROP INDEX IF EXISTS "SkuSequence_brandId_customerType_idx";

CREATE TABLE "SkuSequence_new" (
    "customerType" "CustomerType" NOT NULL,
    "lastSequence" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkuSequence_pkey" PRIMARY KEY ("customerType")
);

INSERT INTO "SkuSequence_new" ("customerType", "lastSequence", "updatedAt")
SELECT
    "customerType",
    MAX("lastSequence"),
    CURRENT_TIMESTAMP
FROM "SkuSequence"
GROUP BY "customerType";

INSERT INTO "SkuSequence_new" ("customerType", "lastSequence", "updatedAt")
SELECT 'DOCTOR', 0, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "SkuSequence_new" WHERE "customerType" = 'DOCTOR'
);

INSERT INTO "SkuSequence_new" ("customerType", "lastSequence", "updatedAt")
SELECT 'HOSPITAL', 0, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "SkuSequence_new" WHERE "customerType" = 'HOSPITAL'
);

DROP TABLE "SkuSequence";

ALTER TABLE "SkuSequence_new" RENAME TO "SkuSequence";
