/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `authMethod` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `googleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isEmailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isPhoneVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `RateLimit` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[refreshTokenHash]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,deviceId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refreshTokenHash` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('LOGIN', 'SIGNUP', 'PASSWORD_RESET', 'TRANSACTION');

-- CreateEnum
CREATE TYPE "OtpStatus" AS ENUM ('SENT', 'VERIFIED', 'FAILED');

-- DropIndex
DROP INDEX "Session_refreshToken_key";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_googleId_key";

-- DropIndex
DROP INDEX "User_phone_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "refreshToken",
ADD COLUMN     "refreshTokenHash" TEXT NOT NULL,
ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "authMethod",
DROP COLUMN "email",
DROP COLUMN "googleId",
DROP COLUMN "isEmailVerified",
DROP COLUMN "isPhoneVerified",
DROP COLUMN "phone",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "tokenVersion" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "RateLimit";

-- CreateTable
CREATE TABLE "AuthIdentity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "AuthMethod" NOT NULL,
    "value" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "identifier" TEXT NOT NULL,
    "purpose" "OtpPurpose" NOT NULL,
    "status" "OtpStatus" NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuthIdentity_userId_idx" ON "AuthIdentity"("userId");

-- CreateIndex
CREATE INDEX "AuthIdentity_value_idx" ON "AuthIdentity"("value");

-- CreateIndex
CREATE INDEX "AuthIdentity_type_value_idx" ON "AuthIdentity"("type", "value");

-- CreateIndex
CREATE INDEX "AuthIdentity_deletedAt_idx" ON "AuthIdentity"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AuthIdentity_type_value_key" ON "AuthIdentity"("type", "value");

-- CreateIndex
CREATE INDEX "OtpLog_identifier_idx" ON "OtpLog"("identifier");

-- CreateIndex
CREATE INDEX "OtpLog_userId_idx" ON "OtpLog"("userId");

-- CreateIndex
CREATE INDEX "OtpLog_purpose_idx" ON "OtpLog"("purpose");

-- CreateIndex
CREATE INDEX "OtpLog_status_idx" ON "OtpLog"("status");

-- CreateIndex
CREATE INDEX "OtpLog_createdAt_idx" ON "OtpLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Session_refreshTokenHash_key" ON "Session"("refreshTokenHash");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE INDEX "Session_isRevoked_idx" ON "Session"("isRevoked");

-- CreateIndex
CREATE INDEX "Session_lastUsedAt_idx" ON "Session"("lastUsedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Session_userId_deviceId_key" ON "Session"("userId", "deviceId");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- AddForeignKey
ALTER TABLE "AuthIdentity" ADD CONSTRAINT "AuthIdentity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtpLog" ADD CONSTRAINT "OtpLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
