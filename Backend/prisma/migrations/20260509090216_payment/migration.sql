/*
  Warnings:

  - You are about to drop the column `guestId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `paymentProvider` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `paymentReferenceId` on the `orders` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('RAZORPAY', 'STRIPE', 'COD', 'MANUAL');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'UPI', 'NETBANKING', 'WALLET', 'EMI', 'COD');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentStatus" ADD VALUE 'CREATED';
ALTER TYPE "PaymentStatus" ADD VALUE 'CAPTURED';
ALTER TYPE "PaymentStatus" ADD VALUE 'CANCELLED';

-- DropIndex
DROP INDEX "orders_guestId_idx";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "guestId",
DROP COLUMN "paidAt",
DROP COLUMN "paymentProvider",
DROP COLUMN "paymentReferenceId";

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "method" "PaymentMethod",
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "refundedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "providerOrderId" TEXT,
    "providerPaymentId" TEXT,
    "providerRefundId" TEXT,
    "providerSignature" TEXT,
    "webhookEvent" TEXT,
    "webhookPayload" JSONB,
    "failureCode" TEXT,
    "failureReason" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "authorizedAt" TIMESTAMP(3),
    "capturedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payments_orderId_idx" ON "payments"("orderId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_provider_idx" ON "payments"("provider");

-- CreateIndex
CREATE INDEX "payments_providerPaymentId_idx" ON "payments"("providerPaymentId");

-- CreateIndex
CREATE INDEX "payments_createdAt_idx" ON "payments"("createdAt");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
