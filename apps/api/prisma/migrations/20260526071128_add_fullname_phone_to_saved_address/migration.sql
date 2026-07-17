/*
  Warnings:

  - Made the column `phoneNumber` on table `SavedAddress` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SavedAddress" ALTER COLUMN "phoneNumber" SET NOT NULL;
