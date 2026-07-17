-- CreateEnum
CREATE TYPE "BannerType" AS ENUM ('HOME_BANNER', 'CATEGORY_BANNER', 'SUB_CATEGORY_BANNER', 'PROMOTIONAL_BANNER', 'PRODUCT_BANNER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "BannerType" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banner_images" (
    "id" TEXT NOT NULL,
    "bannerId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "productId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "banner_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "banners_type_idx" ON "banners"("type");

-- CreateIndex
CREATE INDEX "banners_status_idx" ON "banners"("status");

-- CreateIndex
CREATE INDEX "banners_deletedAt_idx" ON "banners"("deletedAt");

-- CreateIndex
CREATE INDEX "banner_images_bannerId_idx" ON "banner_images"("bannerId");

-- CreateIndex
CREATE INDEX "banner_images_productId_idx" ON "banner_images"("productId");

-- CreateIndex
CREATE INDEX "banner_images_bannerId_sortOrder_idx" ON "banner_images"("bannerId", "sortOrder");

-- CreateIndex
CREATE INDEX "banner_images_status_idx" ON "banner_images"("status");

-- CreateIndex
CREATE INDEX "banner_images_deletedAt_idx" ON "banner_images"("deletedAt");

-- AddForeignKey
ALTER TABLE "banner_images" ADD CONSTRAINT "banner_images_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "banners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banner_images" ADD CONSTRAINT "banner_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
