-- CreateIndex
CREATE INDEX "Product_categoryId_status_deletedAt_idx" ON "Product"("categoryId", "status", "deletedAt");

-- CreateIndex
CREATE INDEX "Variant_productId_deletedAt_idx" ON "Variant"("productId", "deletedAt");
