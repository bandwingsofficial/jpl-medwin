-- AlterTable
ALTER TABLE "Product" ADD COLUMN "hasCatalogue" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "catalogueFileName" TEXT,
ADD COLUMN "catalogueFileUrl" TEXT,
ADD COLUMN "catalogueFileType" TEXT,
ADD COLUMN "catalogueFileSize" INTEGER;
