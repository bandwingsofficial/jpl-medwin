/*
  Warnings:

  - Changed the type of `reason` on the `returns` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReturnReason" AS ENUM ('DAMAGED_PRODUCT', 'DEFECTIVE_PRODUCT', 'WRONG_ITEM', 'SIZE_ISSUE', 'QUALITY_ISSUE', 'NOT_NEEDED', 'OTHER');

-- AlterTable
ALTER TABLE "returns" ADD COLUMN     "description" TEXT,
ALTER COLUMN "status" SET DEFAULT 'REQUESTED',
DROP COLUMN "reason",
ADD COLUMN     "reason" "ReturnReason" NOT NULL;
