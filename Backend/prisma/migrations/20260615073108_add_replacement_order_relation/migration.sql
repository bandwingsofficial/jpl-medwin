/*
  Warnings:

  - A unique constraint covering the columns `[replacementOrderId]` on the table `returns` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "returns_replacementOrderId_key" ON "returns"("replacementOrderId");

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_replacementOrderId_fkey" FOREIGN KEY ("replacementOrderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
