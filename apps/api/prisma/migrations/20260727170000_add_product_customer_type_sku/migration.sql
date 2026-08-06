-- CustomerType enum
CREATE TYPE "CustomerType" AS ENUM ('DOCTOR', 'HOSPITAL');

-- Product.customerType (default for existing rows)
ALTER TABLE "Product" ADD COLUMN "customerType" "CustomerType" NOT NULL DEFAULT 'DOCTOR';
CREATE INDEX "Product_customerType_idx" ON "Product"("customerType");

-- SkuSequence: composite key (brandId + customerType)
ALTER TABLE "SkuSequence" ADD COLUMN "customerType" "CustomerType" NOT NULL DEFAULT 'DOCTOR';
ALTER TABLE "SkuSequence" DROP CONSTRAINT "SkuSequence_pkey";
ALTER TABLE "SkuSequence" ADD CONSTRAINT "SkuSequence_pkey" PRIMARY KEY ("brandId", "customerType");
CREATE INDEX "SkuSequence_brandId_customerType_idx" ON "SkuSequence"("brandId", "customerType");
