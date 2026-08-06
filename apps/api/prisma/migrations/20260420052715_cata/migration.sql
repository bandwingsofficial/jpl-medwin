-- CreateEnum
CREATE TYPE "CategoryStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imageUrl" TEXT,
    "description" TEXT,
    "metaDescription" TEXT,
    "status" "CategoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imageUrl" TEXT,
    "description" TEXT,
    "metaDescription" TEXT,
    "status" "CategoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "categoryId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MiniCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imageUrl" TEXT,
    "description" TEXT,
    "metaDescription" TEXT,
    "status" "CategoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "categoryId" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MiniCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Category_status_idx" ON "Category"("status");

-- CreateIndex
CREATE INDEX "Category_createdAt_idx" ON "Category"("createdAt");

-- CreateIndex
CREATE INDEX "Category_deletedAt_idx" ON "Category"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_deletedAt_key" ON "Category"("slug", "deletedAt");

-- CreateIndex
CREATE INDEX "SubCategory_categoryId_idx" ON "SubCategory"("categoryId");

-- CreateIndex
CREATE INDEX "SubCategory_status_idx" ON "SubCategory"("status");

-- CreateIndex
CREATE INDEX "SubCategory_deletedAt_idx" ON "SubCategory"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_categoryId_slug_deletedAt_key" ON "SubCategory"("categoryId", "slug", "deletedAt");

-- CreateIndex
CREATE INDEX "MiniCategory_categoryId_idx" ON "MiniCategory"("categoryId");

-- CreateIndex
CREATE INDEX "MiniCategory_subCategoryId_idx" ON "MiniCategory"("subCategoryId");

-- CreateIndex
CREATE INDEX "MiniCategory_status_idx" ON "MiniCategory"("status");

-- CreateIndex
CREATE INDEX "MiniCategory_deletedAt_idx" ON "MiniCategory"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MiniCategory_subCategoryId_slug_deletedAt_key" ON "MiniCategory"("subCategoryId", "slug", "deletedAt");

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiniCategory" ADD CONSTRAINT "MiniCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiniCategory" ADD CONSTRAINT "MiniCategory_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
