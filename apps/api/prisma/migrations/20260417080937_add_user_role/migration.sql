/*
  Warnings:

  - The `type` column on the `Session` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[type,value,deletedAt]` on the table `AuthIdentity` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `OtpLog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('USER', 'ADMIN', 'API');

-- DropIndex
DROP INDEX "AuthIdentity_type_value_key";

-- DropIndex
DROP INDEX "Session_userId_deviceId_key";

-- AlterTable
ALTER TABLE "AuthIdentity" ADD COLUMN     "isTotpEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "totpSecret" TEXT;

-- AlterTable
ALTER TABLE "OtpLog" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "type",
ADD COLUMN     "type" "SessionType";

-- CreateIndex
CREATE UNIQUE INDEX "AuthIdentity_type_value_deletedAt_key" ON "AuthIdentity"("type", "value", "deletedAt");
