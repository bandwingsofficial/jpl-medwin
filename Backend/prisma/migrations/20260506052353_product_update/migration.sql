/*
  Warnings:

  - You are about to drop the column `defaultVariantId` on the `Product` table. All the data in the column will be lost.
  - You are about to alter the column `maxPrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `minPrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to drop the column `ownerType` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to alter the column `purchasePrice` on the `Variant` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `sellingPrice` on the `Variant` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `mrp` on the `Variant` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - A unique constraint covering the columns `[sku,deletedAt]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,deletedAt]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProductImage_ownerType_idx";

-- DropIndex
DROP INDEX "Variant_productId_sku_deletedAt_key";

-- DropIndex
DROP INDEX "Variant_productId_slug_deletedAt_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "defaultVariantId",
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ALTER COLUMN "maxPrice" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "minPrice" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "ownerType",
ADD COLUMN     "blurHash" TEXT,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "size" INTEGER,
ADD COLUMN     "width" INTEGER;

-- AlterTable
ALTER TABLE "Variant" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "reservedQuantity" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "purchasePrice" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "sellingPrice" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "mrp" SET DATA TYPE DECIMAL(10,2);

-- DropEnum
DROP TYPE "ImageOwnerType";

-- CreateIndex
CREATE INDEX "Product_publishedAt_idx" ON "Product"("publishedAt");

-- CreateIndex
CREATE INDEX "Product_brandId_status_deletedAt_idx" ON "Product"("brandId", "status", "deletedAt");

-- CreateIndex
CREATE INDEX "Variant_publishedAt_idx" ON "Variant"("publishedAt");

-- CreateIndex
CREATE INDEX "Variant_productId_status_deletedAt_idx" ON "Variant"("productId", "status", "deletedAt");

-- CreateIndex
CREATE INDEX "Variant_productId_isDefault_idx" ON "Variant"("productId", "isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_sku_deletedAt_key" ON "Variant"("sku", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_slug_deletedAt_key" ON "Variant"("slug", "deletedAt");
