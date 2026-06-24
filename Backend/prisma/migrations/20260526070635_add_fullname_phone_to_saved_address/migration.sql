-- AlterTable
ALTER TABLE "SavedAddress" ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "phoneNumber" TEXT;

-- CreateIndex
CREATE INDEX "SavedAddress_phoneNumber_idx" ON "SavedAddress"("phoneNumber");
