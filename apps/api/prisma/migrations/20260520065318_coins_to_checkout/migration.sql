-- AlterTable
ALTER TABLE "CheckoutSession" ADD COLUMN     "rewardCoinsUsed" INTEGER DEFAULT 0,
ADD COLUMN     "rewardDiscount" DOUBLE PRECISION DEFAULT 0;
