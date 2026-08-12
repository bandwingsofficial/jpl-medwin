"use client";

import { useMigrateGuestCart } from "@/features/cart/hooks/use-migrate-guest-cart";

export function GuestCartMigration(): null {
  useMigrateGuestCart();

  return null;
}