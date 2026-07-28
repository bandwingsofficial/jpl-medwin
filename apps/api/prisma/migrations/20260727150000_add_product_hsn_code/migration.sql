-- Add HSN Code to Product
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "hsnCode" TEXT;
