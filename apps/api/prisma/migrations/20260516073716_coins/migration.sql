-- CreateEnum
CREATE TYPE "CoinTransactionType" AS ENUM ('EARNED', 'REDEEMED', 'EXPIRED', 'REFUNDED', 'BONUS', 'ADJUSTED');

-- CreateEnum
CREATE TYPE "CoinTransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RewardTierStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "earnedCoins" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "redeemedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "redeemedCoins" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "RewardConfig" (
    "id" TEXT NOT NULL,
    "earnRateAmount" DECIMAL(12,2) NOT NULL,
    "earnRateCoins" INTEGER NOT NULL,
    "coinValue" DECIMAL(12,2) NOT NULL DEFAULT 1,
    "maxRedemptionPercentage" DECIMAL(5,2) NOT NULL,
    "minimumOrderAmount" DECIMAL(12,2),
    "expiryMonths" INTEGER NOT NULL DEFAULT 12,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RewardConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardTier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "RewardTierStatus" NOT NULL DEFAULT 'ACTIVE',
    "coinMultiplier" DECIMAL(5,2) NOT NULL,
    "minimumLifetimeSpend" DECIMAL(12,2) NOT NULL,
    "badgeImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RewardTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRewardTier" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rewardTierId" TEXT NOT NULL,
    "totalLifetimeSpend" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRewardTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinWallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "lifetimeEarned" INTEGER NOT NULL DEFAULT 0,
    "lifetimeRedeemed" INTEGER NOT NULL DEFAULT 0,
    "lifetimeExpired" INTEGER NOT NULL DEFAULT 0,
    "lifetimeRefunded" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoinWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinTransaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT,
    "paymentId" TEXT,
    "type" "CoinTransactionType" NOT NULL,
    "status" "CoinTransactionStatus" NOT NULL DEFAULT 'SUCCESS',
    "coins" INTEGER NOT NULL,
    "balanceBefore" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "description" TEXT,
    "expiresAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "createdByAdminId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoinTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinRedemption" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "redeemedCoins" INTEGER NOT NULL,
    "redeemedAmount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoinRedemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardCampaign" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "bonusMultiplier" DECIMAL(5,2) NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RewardCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserRewardTier_rewardTierId_idx" ON "UserRewardTier"("rewardTierId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRewardTier_userId_key" ON "UserRewardTier"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CoinWallet_userId_key" ON "CoinWallet"("userId");

-- CreateIndex
CREATE INDEX "CoinWallet_balance_idx" ON "CoinWallet"("balance");

-- CreateIndex
CREATE INDEX "CoinTransaction_walletId_idx" ON "CoinTransaction"("walletId");

-- CreateIndex
CREATE INDEX "CoinTransaction_userId_idx" ON "CoinTransaction"("userId");

-- CreateIndex
CREATE INDEX "CoinTransaction_orderId_idx" ON "CoinTransaction"("orderId");

-- CreateIndex
CREATE INDEX "CoinTransaction_type_idx" ON "CoinTransaction"("type");

-- CreateIndex
CREATE INDEX "CoinTransaction_status_idx" ON "CoinTransaction"("status");

-- CreateIndex
CREATE INDEX "CoinTransaction_createdAt_idx" ON "CoinTransaction"("createdAt");

-- CreateIndex
CREATE INDEX "CoinTransaction_expiresAt_idx" ON "CoinTransaction"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "CoinRedemption_orderId_key" ON "CoinRedemption"("orderId");

-- CreateIndex
CREATE INDEX "CoinRedemption_userId_idx" ON "CoinRedemption"("userId");

-- CreateIndex
CREATE INDEX "RewardCampaign_startsAt_idx" ON "RewardCampaign"("startsAt");

-- CreateIndex
CREATE INDEX "RewardCampaign_endsAt_idx" ON "RewardCampaign"("endsAt");

-- AddForeignKey
ALTER TABLE "UserRewardTier" ADD CONSTRAINT "UserRewardTier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRewardTier" ADD CONSTRAINT "UserRewardTier_rewardTierId_fkey" FOREIGN KEY ("rewardTierId") REFERENCES "RewardTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinWallet" ADD CONSTRAINT "CoinWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinTransaction" ADD CONSTRAINT "CoinTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "CoinWallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinTransaction" ADD CONSTRAINT "CoinTransaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinTransaction" ADD CONSTRAINT "CoinTransaction_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinTransaction" ADD CONSTRAINT "CoinTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinRedemption" ADD CONSTRAINT "CoinRedemption_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinRedemption" ADD CONSTRAINT "CoinRedemption_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "CoinWallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinRedemption" ADD CONSTRAINT "CoinRedemption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
