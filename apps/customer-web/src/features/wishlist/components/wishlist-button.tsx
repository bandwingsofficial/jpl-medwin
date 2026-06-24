"use client";

import {
  Heart,
  Loader2,
} from "lucide-react";

import { useAuthGuard } from "@/features/auth/hooks/use-auth-guard";

import { useWishlist } from "@/features/wishlist/hooks/use-wishlist";

import { useAddToWishlist } from "@/features/wishlist/hooks/use-add-to-wishlist";

import { useRemoveFromWishlist } from "@/features/wishlist/hooks/use-remove-from-wishlist";

interface WishlistButtonProps {
  productId: string;
}

export function WishlistButton({
  productId,
}: WishlistButtonProps) {
  const { requireAuth } =
    useAuthGuard();

  const {
    wishlistIds,
  } = useWishlist();

  const {
    mutateAsync:
      addToWishlist,

    isPending:
      isAdding,
  } =
    useAddToWishlist();

  const {
    mutateAsync:
      removeFromWishlist,

    isPending:
      isRemoving,
  } =
    useRemoveFromWishlist();

  const isWishlisted =
    wishlistIds?.has(
      productId
    ) ?? false;

  

  

  const isLoading =
    isAdding ||
    isRemoving;

  const handleClick =
    async (
      e: React.MouseEvent<HTMLButtonElement>
    ) => {
      e.preventDefault();

      e.stopPropagation();

      if (!requireAuth()) {
        return;
      }

      try {
              if (
          isWishlisted
        ) {
                    await removeFromWishlist(
            productId
          );

          return;
        }
        await addToWishlist(
          productId
        );
      } catch (
        error
      ) {
      }
    };

  return (
    <button
      type="button"
      onClick={
        handleClick
      }
      disabled={
        isLoading
      }
      className="
        absolute
        right-2
        top-2
        z-20
        flex
        h-8
        w-8
        items-center
        justify-center
        rounded-full
        border
        border-gray-200
        bg-white
        shadow-sm
        transition-all
        duration-200
        hover:bg-gray-50
        disabled:opacity-50
      "
    >
      {isLoading ? (
        <Loader2
          size={14}
          className="
            animate-spin
            text-gray-600
          "
        />
      ) : (
        <Heart
          size={15}
          className={
            isWishlisted
              ? `
                  fill-red-500
                  text-red-500
                `
              : `
                  text-gray-600
                `
          }
        />
      )}
    </button>
  );
}