"use client";

import { useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { wishlistApi } from "../api/wishlist.api";
import { localWishlistService } from "./local-wishlist.service";

import { useAuth } from "@/features/auth/hooks/use-auth";

export const useMigrateGuestWishlist = () => {
  const { isAuthenticated } = useAuth();

  const queryClient = useQueryClient();

  const migratedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (migratedRef.current) {
      return;
    }

    const migrate = async () => {
      const guestProducts =
        localWishlistService.getAll();

      if (guestProducts.length === 0) {
        return;
      }

      migratedRef.current = true;

      for (const product of guestProducts) {
        try {
          await wishlistApi.add(product.id);
        } catch {
          // Ignore duplicates.
          // Continue migrating remaining products.
        }
      }

      // Guest wishlist is now migrated.
      localWishlistService.clear();

      // Refresh authenticated wishlist.
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["wishlist"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["wishlist-count"],
        }),
      ]);
    };

    void migrate();
  }, [
    isAuthenticated,
    queryClient,
  ]);
};