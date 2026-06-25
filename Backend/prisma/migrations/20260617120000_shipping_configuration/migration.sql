-- CreateTable
CREATE TABLE "shipping_configurations" (
    "id" TEXT NOT NULL,
    "shippingFee" DECIMAL(10,2) NOT NULL,
    "freeShippingThreshold" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shipping_configurations_isActive_idx" ON "shipping_configurations"("isActive");

-- Seed default configuration
INSERT INTO "shipping_configurations" (
    "id",
    "shippingFee",
    "freeShippingThreshold",
    "isActive",
    "createdAt",
    "updatedAt"
)
VALUES (
    gen_random_uuid()::text,
    50,
    500,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
