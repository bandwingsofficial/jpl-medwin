/*
  Warnings:

  - You are about to drop the column `discount` on the `CheckoutSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CheckoutSession" DROP COLUMN "discount",
ADD COLUMN     "couponDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0;
