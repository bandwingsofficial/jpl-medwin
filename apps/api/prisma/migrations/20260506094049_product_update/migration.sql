-- AlterTable
ALTER TABLE "Variant" ADD COLUMN     "isWeighted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "warrantyMonths" INTEGER;
