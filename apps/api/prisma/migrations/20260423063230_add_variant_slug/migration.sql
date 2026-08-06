/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `Variant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Variant" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Variant_slug_key" ON "Variant"("slug");
