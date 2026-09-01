/*
  Warnings:

  - You are about to drop the column `priorityOrder` on the `Variant` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Variant_productId_priorityOrder_deletedAt_key";

-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "priorityOrder";
