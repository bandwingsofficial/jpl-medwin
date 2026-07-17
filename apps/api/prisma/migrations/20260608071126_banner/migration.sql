/*
  Warnings:

  - The `status` column on the `banner_images` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `banners` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BannerStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "banner_images" DROP COLUMN "status",
ADD COLUMN     "status" "BannerStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "banners" DROP COLUMN "status",
ADD COLUMN     "status" "BannerStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "Status";

-- CreateIndex
CREATE INDEX "banner_images_status_idx" ON "banner_images"("status");

-- CreateIndex
CREATE INDEX "banners_status_idx" ON "banners"("status");
