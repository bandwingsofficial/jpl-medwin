/*
  Warnings:

  - You are about to drop the column `metaDescription` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `warranty` on the `Product` table. All the data in the column will be lost.
  - The `packing` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `directionsOfUse` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[defaultVariantId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('MAIN', 'GALLERY');

-- DropIndex
DROP INDEX "Product_averageRating_idx";

-- DropIndex
DROP INDEX "Product_createdAt_idx";

-- DropIndex
DROP INDEX "Product_deletedAt_idx";

-- DropIndex
DROP INDEX "Product_slug_idx";

-- DropIndex
DROP INDEX "Product_status_idx";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "metaDescription",
DROP COLUMN "metaTitle",
DROP COLUMN "warranty",
ADD COLUMN     "additionalInfo" JSONB,
ADD COLUMN     "defaultVariantId" TEXT,
ADD COLUMN     "faq" JSONB,
ADD COLUMN     "maxPrice" DOUBLE PRECISION,
ADD COLUMN     "minPrice" DOUBLE PRECISION,
ADD COLUMN     "warrantyMonths" INTEGER,
ALTER COLUMN "type" SET DEFAULT 'VARIABLE',
DROP COLUMN "packing",
ADD COLUMN     "packing" JSONB,
DROP COLUMN "directionsOfUse",
ADD COLUMN     "directionsOfUse" JSONB;

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "type" "ImageType" NOT NULL;

-- AlterTable
ALTER TABLE "Variant" ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Product_defaultVariantId_key" ON "Product"("defaultVariantId");

-- CreateIndex
CREATE INDEX "ProductImage_type_idx" ON "ProductImage"("type");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_defaultVariantId_fkey" FOREIGN KEY ("defaultVariantId") REFERENCES "Variant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
