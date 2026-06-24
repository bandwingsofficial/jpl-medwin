-- DropIndex
DROP INDEX "Category_slug_key";

-- DropIndex
DROP INDEX "MiniCategory_slug_key";

-- DropIndex
DROP INDEX "SubCategory_slug_key";

-- CreateIndex
CREATE INDEX "Category_slug_deletedAt_idx" ON "Category"("slug", "deletedAt");

-- CreateIndex
CREATE INDEX "MiniCategory_subCategoryId_slug_deletedAt_idx" ON "MiniCategory"("subCategoryId", "slug", "deletedAt");

-- CreateIndex
CREATE INDEX "SubCategory_categoryId_slug_deletedAt_idx" ON "SubCategory"("categoryId", "slug", "deletedAt");

-- CreateIndex
CREATE INDEX "SubCategory_categoryId_name_idx" ON "SubCategory"("categoryId", "name");
