/*
  Warnings:

  - You are about to drop the column `directionsOfUse` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `mainImage` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isDefault` on the `Variant` table. All the data in the column will be lost.
  - You are about to drop the column `mainImage` on the `Variant` table. All the data in the column will be lost.
  - You are about to drop the column `stockStatus` on the `Variant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_defaultVariantId_fkey";

-- DropIndex
DROP INDEX "Product_defaultVariantId_key";

-- DropIndex
DROP INDEX "Variant_stockStatus_idx";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "directionsOfUse",
DROP COLUMN "mainImage",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN     "directionOfUse" JSONB;

-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "isDefault",
DROP COLUMN "mainImage",
DROP COLUMN "stockStatus";

-- DropEnum
DROP TYPE "StockStatus";

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

-- CreateIndex
CREATE INDEX "Product_deletedAt_idx" ON "Product"("deletedAt");
