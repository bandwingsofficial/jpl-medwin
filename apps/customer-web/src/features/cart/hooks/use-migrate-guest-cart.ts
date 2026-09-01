"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/hooks/use-auth";

import { guestCartMigrationService } from "@/features/cart/services/guest-cart-migration.service";

export const useMigrateGuestCart = (): void => {
  const queryClient =
    useQueryClient();

  const { isAuthenticated } =
    useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let cancelled = false;

    const migrate = async (): Promise<void> => {
      try {
        await guestCartMigrationService.migrate();

        if (cancelled) {
          return;
        }

        /*
         * Force React Query to fetch the real
         * authenticated cart after migration.
         */
        await queryClient.invalidateQueries({
          queryKey: ["cart"],
        });

        /*
         * Checkout session can depend on cart
         * contents, so invalidate it too.
         */
        await queryClient.invalidateQueries({
          queryKey: ["checkout-session"],
        });
      } catch (error) {
        console.error(
          "GUEST CART MIGRATION FAILED",
          error,
        );
      }
    };

    void migrate();

    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    queryClient,
  ]);
};