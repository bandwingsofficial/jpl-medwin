/*
  Warnings:

  - You are about to drop the column `discount` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "discount",
ADD COLUMN     "couponDiscount" DECIMAL(12,2) NOT NULL DEFAULT 0;
