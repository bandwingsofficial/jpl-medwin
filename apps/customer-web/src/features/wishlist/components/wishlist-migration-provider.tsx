"use client";

import { useEffect, useRef } from "react";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

import { wishlistApi } from "../api/wishlist.api";
import { localWishlistService } from "../hooks/local-wishlist.service";

import { useAuth } from "@/features/auth/hooks/use-auth";

export function WishlistMigrationProvider() {
  const { isAuthenticated } = useAuth();

  const queryClient = useQueryClient();

  const isMigratingRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated !== true) {
      return;
    }

    if (isMigratingRef.current) {
      return;
    }

    const migrateGuestWishlist = async () => {
      const guestProducts = localWishlistService.getAll();

      if (guestProducts.length === 0) {
        return;
      }

      isMigratingRef.current = true;

      let migrationSuccessful = true;

      try {
        for (const product of guestProducts) {
          try {
            await wishlistApi.add(product.id);
          } catch (error) {
            const axiosError = error as AxiosError<{
              message?: string;
            }>;

            const message =
              axiosError.response?.data?.message ?? "";

            const normalizedMessage =
              message.toLowerCase();

            const isDuplicate =
              normalizedMessage.includes(
                "already exists"
              ) ||
              normalizedMessage.includes(
                "already exist"
              );

            if (!isDuplicate) {
              migrationSuccessful = false;

              console.error(
                "WISHLIST MIGRATION FAILED",
                {
                  productId: product.id,
                  error,
                }
              );
            }
          }
        }

        /*
         * Only clear guest wishlist when every product
         * was successfully migrated or already existed.
         */
        if (migrationSuccessful) {
          localWishlistService.clear();
        }

        /*
         * Refresh authenticated wishlist.
         */
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["wishlist"],
          }),

          queryClient.invalidateQueries({
            queryKey: ["wishlist-count"],
          }),
        ]);
      } finally {
        isMigratingRef.current = false;
      }
    };

    void migrateGuestWishlist();
  }, [isAuthenticated, queryClient]);

  return null;
}