/*
  Warnings:

  - A unique constraint covering the columns `[productId,sku,deletedAt]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,slug,deletedAt]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProductImage_productId_idx";

-- DropIndex
DROP INDEX "ProductImage_variantId_idx";

-- DropIndex
DROP INDEX "Variant_sku_deletedAt_key";

-- DropIndex
DROP INDEX "Variant_slug_deletedAt_key";

-- CreateIndex
CREATE INDEX "ProductImage_productId_deletedAt_idx" ON "ProductImage"("productId", "deletedAt");

-- CreateIndex
CREATE INDEX "ProductImage_variantId_deletedAt_idx" ON "ProductImage"("variantId", "deletedAt");

-- CreateIndex
CREATE INDEX "ProductImage_deletedAt_idx" ON "ProductImage"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_productId_sku_deletedAt_key" ON "Variant"("productId", "sku", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_productId_slug_deletedAt_key" ON "Variant"("productId", "slug", "deletedAt");
