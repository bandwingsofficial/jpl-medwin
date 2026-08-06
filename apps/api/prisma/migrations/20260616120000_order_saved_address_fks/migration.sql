-- Add saved address references to orders
ALTER TABLE "orders"
ADD COLUMN "shippingAddressId" TEXT,
ADD COLUMN "billingAddressId" TEXT,
ADD COLUMN "isBillingSameAsShipping" BOOLEAN NOT NULL DEFAULT true;

-- Migrate existing JSON address snapshots into SavedAddress rows
DO $$
DECLARE
  ord RECORD;
  ship_json JSONB;
  bill_json JSONB;
  ship_id TEXT;
  bill_id TEXT;
  ship_type "AddressType";
  bill_type "AddressType";
BEGIN
  FOR ord IN
    SELECT id, "userId", "shippingAddress", "billingAddress"
    FROM "orders"
    WHERE "userId" IS NOT NULL
  LOOP
    ship_json := CASE
      WHEN ord."shippingAddress" IS NULL THEN NULL
      WHEN ord."shippingAddress"::text = 'null' THEN NULL
      ELSE ord."shippingAddress"::jsonb
    END;

    bill_json := CASE
      WHEN ord."billingAddress" IS NULL THEN NULL
      WHEN ord."billingAddress"::text = 'null' THEN NULL
      ELSE ord."billingAddress"::jsonb
    END;

    ship_id := NULL;
    bill_id := NULL;

    IF ship_json IS NOT NULL AND ship_json <> '{}'::jsonb THEN
      ship_id := 'migrated_ship_' || ord.id;

      ship_type := CASE UPPER(COALESCE(ship_json->>'type', 'HOME'))
        WHEN 'WORK' THEN 'WORK'::"AddressType"
        WHEN 'OTHER' THEN 'OTHER'::"AddressType"
        ELSE 'HOME'::"AddressType"
      END;

      INSERT INTO "SavedAddress" (
        id,
        "userId",
        "fullName",
        "phoneNumber",
        type,
        alias,
        "addressLine1",
        "addressLine2",
        landmark,
        city,
        state,
        country,
        "postalCode",
        "isDefault",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ship_id,
        ord."userId",
        NULLIF(ship_json->>'fullName', ''),
        COALESCE(NULLIF(ship_json->>'phoneNumber', ''), '0000000000'),
        ship_type,
        NULLIF(ship_json->>'alias', ''),
        COALESCE(NULLIF(ship_json->>'addressLine1', ''), 'Migrated address'),
        NULLIF(ship_json->>'addressLine2', ''),
        NULLIF(ship_json->>'landmark', ''),
        COALESCE(NULLIF(ship_json->>'city', ''), 'Unknown'),
        COALESCE(NULLIF(ship_json->>'state', ''), 'Unknown'),
        COALESCE(NULLIF(ship_json->>'country', ''), 'India'),
        COALESCE(NULLIF(ship_json->>'postalCode', ''), '000000'),
        false,
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO NOTHING;
    END IF;

    IF bill_json IS NOT NULL AND bill_json <> '{}'::jsonb THEN
      IF ship_json IS NOT NULL AND bill_json = ship_json THEN
        bill_id := ship_id;
      ELSE
        bill_id := 'migrated_bill_' || ord.id;

        bill_type := CASE UPPER(COALESCE(bill_json->>'type', 'HOME'))
          WHEN 'WORK' THEN 'WORK'::"AddressType"
          WHEN 'OTHER' THEN 'OTHER'::"AddressType"
          ELSE 'HOME'::"AddressType"
        END;

        INSERT INTO "SavedAddress" (
          id,
          "userId",
          "fullName",
          "phoneNumber",
          type,
          alias,
          "addressLine1",
          "addressLine2",
          landmark,
          city,
          state,
          country,
          "postalCode",
          "isDefault",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          bill_id,
          ord."userId",
          NULLIF(bill_json->>'fullName', ''),
          COALESCE(NULLIF(bill_json->>'phoneNumber', ''), '0000000000'),
          bill_type,
          NULLIF(bill_json->>'alias', ''),
          COALESCE(NULLIF(bill_json->>'addressLine1', ''), 'Migrated address'),
          NULLIF(bill_json->>'addressLine2', ''),
          NULLIF(bill_json->>'landmark', ''),
          COALESCE(NULLIF(bill_json->>'city', ''), 'Unknown'),
          COALESCE(NULLIF(bill_json->>'state', ''), 'Unknown'),
          COALESCE(NULLIF(bill_json->>'country', ''), 'India'),
          COALESCE(NULLIF(bill_json->>'postalCode', ''), '000000'),
          false,
          NOW(),
          NOW()
        )
        ON CONFLICT (id) DO NOTHING;
      END IF;
    END IF;

    IF ship_id IS NULL AND bill_id IS NOT NULL THEN
      ship_id := bill_id;
    END IF;

    IF bill_id IS NULL AND ship_id IS NOT NULL THEN
      bill_id := ship_id;
    END IF;

    UPDATE "orders"
    SET
      "shippingAddressId" = ship_id,
      "billingAddressId" = bill_id,
      "isBillingSameAsShipping" = CASE
        WHEN ship_id IS NOT NULL AND bill_id IS NOT NULL AND ship_id = bill_id THEN true
        ELSE false
      END
    WHERE id = ord.id;
  END LOOP;
END $$;

-- Drop legacy JSON snapshots
ALTER TABLE "orders"
DROP COLUMN "shippingAddress",
DROP COLUMN "billingAddress";

-- Indexes
CREATE INDEX "orders_shippingAddressId_idx" ON "orders"("shippingAddressId");
CREATE INDEX "orders_billingAddressId_idx" ON "orders"("billingAddressId");

-- Foreign keys
ALTER TABLE "orders"
ADD CONSTRAINT "orders_shippingAddressId_fkey"
FOREIGN KEY ("shippingAddressId") REFERENCES "SavedAddress"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "orders"
ADD CONSTRAINT "orders_billingAddressId_fkey"
FOREIGN KEY ("billingAddressId") REFERENCES "SavedAddress"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
