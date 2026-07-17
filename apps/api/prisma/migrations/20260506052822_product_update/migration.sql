/*
  Warnings:

  - You are about to drop the column `publishedAt` on the `Product` table. All the data in the column will be lost.
  - You are about to alter the column `maxPrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `minPrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to drop the column `blurHash` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `isDefault` on the `Variant` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `Variant` table. All the data in the column will be lost.
  - You are about to drop the column `reservedQuantity` on the `Variant` table. All the data in the column will be lost.
  - You are about to alter the column `purchasePrice` on the `Variant` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `sellingPrice` on the `Variant` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `mrp` on the `Variant` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - A unique constraint covering the columns `[productId,sku,deletedAt]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,slug,deletedAt]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerType` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ImageOwnerType" AS ENUM ('PRODUCT', 'VARIANT');

-- DropIndex
DROP INDEX "Product_brandId_status_deletedAt_idx";

-- DropIndex
DROP INDEX "Product_publishedAt_idx";

-- DropIndex
DROP INDEX "Variant_productId_isDefault_idx";

-- DropIndex
DROP INDEX "Variant_productId_status_deletedAt_idx";

-- DropIndex
DROP INDEX "Variant_publishedAt_idx";

-- DropIndex
DROP INDEX "Variant_sku_deletedAt_key";

-- DropIndex
DROP INDEX "Variant_slug_deletedAt_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "publishedAt",
ADD COLUMN     "defaultVariantId" TEXT,
ALTER COLUMN "maxPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "minPrice" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "blurHash",
DROP COLUMN "height",
DROP COLUMN "mimeType",
DROP COLUMN "size",
DROP COLUMN "width",
ADD COLUMN     "ownerType" "ImageOwnerType" NOT NULL;

-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "isDefault",
DROP COLUMN "publishedAt",
DROP COLUMN "reservedQuantity",
ALTER COLUMN "purchasePrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "sellingPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "mrp" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "ProductImage_ownerType_idx" ON "ProductImage"("ownerType");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_productId_sku_deletedAt_key" ON "Variant"("productId", "sku", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_productId_slug_deletedAt_key" ON "Variant"("productId", "slug", "deletedAt");
