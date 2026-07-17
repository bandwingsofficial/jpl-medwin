/*
  Warnings:

  - A unique constraint covering the columns `[idempotencyKey]` on the table `CoinTransaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `CoinRedemption` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CoinRedemptionStatus" AS ENUM ('PENDING', 'APPLIED', 'REVERSED', 'FAILED');

-- CreateEnum
CREATE TYPE "RewardSourceType" AS ENUM ('ORDER', 'REFERRAL', 'CAMPAIGN', 'ADMIN', 'REFUND', 'SYSTEM');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CoinTransactionType" ADD VALUE 'REDEEM_REVERSED';
ALTER TYPE "CoinTransactionType" ADD VALUE 'ORDER_REWARD_REVERSED';
ALTER TYPE "CoinTransactionType" ADD VALUE 'ADMIN_CREDIT';
ALTER TYPE "CoinTransactionType" ADD VALUE 'ADMIN_DEBIT';

-- AlterTable
ALTER TABLE "CoinRedemption" ADD COLUMN     "reversalReason" TEXT,
ADD COLUMN     "reversedAt" TIMESTAMP(3),
ADD COLUMN     "status" "CoinRedemptionStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CoinTransaction" ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "redemptionId" TEXT,
ADD COLUMN     "remainingCoins" INTEGER,
ADD COLUMN     "sourceType" "RewardSourceType";

-- AlterTable
ALTER TABLE "RewardConfig" ADD COLUMN     "rewardOnDelivered" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "CoinRedemption_walletId_idx" ON "CoinRedemption"("walletId");

-- CreateIndex
CREATE INDEX "CoinRedemption_status_idx" ON "CoinRedemption"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CoinTransaction_idempotencyKey_key" ON "CoinTransaction"("idempotencyKey");

-- CreateIndex
CREATE INDEX "CoinTransaction_paymentId_idx" ON "CoinTransaction"("paymentId");

-- CreateIndex
CREATE INDEX "CoinTransaction_redemptionId_idx" ON "CoinTransaction"("redemptionId");

-- CreateIndex
CREATE INDEX "CoinTransaction_sourceType_idx" ON "CoinTransaction"("sourceType");

-- CreateIndex
CREATE INDEX "RewardCampaign_isActive_idx" ON "RewardCampaign"("isActive");

-- CreateIndex
CREATE INDEX "RewardConfig_isActive_idx" ON "RewardConfig"("isActive");

-- AddForeignKey
ALTER TABLE "CoinTransaction" ADD CONSTRAINT "CoinTransaction_redemptionId_fkey" FOREIGN KEY ("redemptionId") REFERENCES "CoinRedemption"("id") ON DELETE SET NULL ON UPDATE CASCADE;
