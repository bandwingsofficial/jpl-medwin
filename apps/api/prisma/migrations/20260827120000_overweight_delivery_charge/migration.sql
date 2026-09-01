-- AlterTable Product
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "isOverweight" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "weightKg" DOUBLE PRECISION;

-- AlterTable ShippingConfiguration
ALTER TABLE "shipping_configurations" ADD COLUMN IF NOT EXISTS "overweightChargePerKg" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable CheckoutSession
ALTER TABLE "CheckoutSession" ADD COLUMN IF NOT EXISTS "overweightDeliveryCharge" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable Order
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "overweightDeliveryCharge" DECIMAL(12,2) NOT NULL DEFAULT 0;
