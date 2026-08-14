"use client";

import { useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { wishlistApi } from "../api/wishlist.api";
import { localWishlistService } from "../hooks/local-wishlist.service";

import { useAuth } from "@/features/auth/hooks/use-auth";

export function WishlistMigrationProvider() {
  const { isAuthenticated } = useAuth();

  const queryClient = useQueryClient();

  const hasMigrated = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (hasMigrated.current) {
      return;
    }

    const migrateGuestWishlist = async () => {
      const guestProducts =
        localWishlistService.getAll();

      if (guestProducts.length === 0) {
        return;
      }

      hasMigrated.current = true;

      for (const product of guestProducts) {
        try {
          await wishlistApi.add(product.id);
        } catch {
          // Ignore duplicate products
          // and continue migrating.
        }
      }

      // Clear guest wishlist after migration.
      localWishlistService.clear();

      // Refresh authenticated wishlist data.
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["wishlist"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["wishlist-count"],
        }),
      ]);
    };

    void migrateGuestWishlist();
  }, [isAuthenticated, queryClient]);

  return null;
}