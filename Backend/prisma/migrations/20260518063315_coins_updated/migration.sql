/*
  Warnings:

  - Added the required column `updatedAt` to the `CoinTransaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `remainingCoins` on table `CoinTransaction` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `RewardCampaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserRewardTier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CoinTransaction" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "remainingCoins" SET NOT NULL,
ALTER COLUMN "remainingCoins" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "RewardCampaign" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UserRewardTier" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "CoinTransaction_userId_createdAt_idx" ON "CoinTransaction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CoinTransaction_walletId_createdAt_idx" ON "CoinTransaction"("walletId", "createdAt");
