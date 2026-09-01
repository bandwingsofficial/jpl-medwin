/*
  Warnings:

  - A unique constraint covering the columns `[productId,priorityOrder,deletedAt]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Variant" ADD COLUMN     "priorityOrder" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Variant_productId_priorityOrder_deletedAt_key" ON "Variant"("productId", "priorityOrder", "deletedAt");
