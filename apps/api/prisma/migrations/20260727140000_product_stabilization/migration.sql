-- AlterTable: optional mini category
ALTER TABLE "Product" ALTER COLUMN "miniCategoryId" DROP NOT NULL;

-- AlterTable: variant priority order
ALTER TABLE "Variant" ADD COLUMN IF NOT EXISTS "priorityOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateTable: SKU sequence counter per brand
CREATE TABLE IF NOT EXISTS "SkuSequence" (
    "brandId" TEXT NOT NULL,
    "lastSequence" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkuSequence_pkey" PRIMARY KEY ("brandId")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Variant_productId_priorityOrder_idx" ON "Variant"("productId", "priorityOrder");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'SkuSequence_brandId_fkey'
    ) THEN
        ALTER TABLE "SkuSequence" ADD CONSTRAINT "SkuSequence_brandId_fkey"
            FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
