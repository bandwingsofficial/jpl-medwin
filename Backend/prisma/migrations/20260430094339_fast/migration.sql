/*
  Warnings:

  - A unique constraint covering the columns `[sku,deletedAt]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,deletedAt]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Variant_sku_key";

-- DropIndex
DROP INDEX "Variant_slug_key";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "mainImage" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Variant_slug_idx" ON "Variant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_sku_deletedAt_key" ON "Variant"("sku", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_slug_deletedAt_key" ON "Variant"("slug", "deletedAt");
