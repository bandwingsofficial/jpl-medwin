"use client";

import {
  Heart,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";

import { useRouter } from "next/navigation";

import {
  Product,
  ProductVariant,
} from "@/features/products/types/product.type";

import { useAddToCart } from "@/features/cart/hooks/use-add-to-cart";
import { useAuth } from "@/features/auth/hooks/use-auth";import { useAuthGuard } from "@/features/auth/hooks/use-auth-guard";

import { useWishlist } from "@/features/wishlist/hooks/use-wishlist";

import { useAddToWishlist } from "@/features/wishlist/hooks/use-add-to-wishlist";

import { useRemoveFromWishlist } from "@/features/wishlist/hooks/use-remove-from-wishlist";
import { useCart } from "@/features/cart/hooks/use-cart";

import { cartApi } from "@/features/cart/api/cart.api";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

interface ProductActionsProps {
  product: Product;

  selectedVariant?: ProductVariant | null;
}

export function ProductActions({
  product,
  selectedVariant,
}: ProductActionsProps) {
  /*
   |--------------------------------------------------------------------------
   | ROUTER
   |--------------------------------------------------------------------------
   */

  const router = useRouter();

  /*
   |--------------------------------------------------------------------------
   | QUERY CLIENT
   |--------------------------------------------------------------------------
   */

  const queryClient =
    useQueryClient();

  /*
   |--------------------------------------------------------------------------
   | AUTH
   |--------------------------------------------------------------------------
   */

  const {
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();
  const { requireAuth } =
  useAuthGuard();

const {
  wishlistIds,
} = useWishlist();

const {
  mutateAsync:
    addToWishlist,
  isPending:
    isAddingWishlist,
} =
  useAddToWishlist();

const {
  mutateAsync:
    removeFromWishlist,
  isPending:
    isRemovingWishlist,
} =
  useRemoveFromWishlist();

const isWishlisted =
  wishlistIds?.has(
    product.id
  ) ?? false;

const isWishlistLoading =
  isAddingWishlist ||
  isRemovingWishlist;

  /*
   |--------------------------------------------------------------------------
   | CART
   |--------------------------------------------------------------------------
   */

  const { data: cartData } =
    useCart();

  /*
   |--------------------------------------------------------------------------
   | STOCK
   |--------------------------------------------------------------------------
   */

  const stockQuantity =
    selectedVariant?.stock
      ?.quantity || 0;

  const isInStock =
    selectedVariant?.stock
      ?.inStock || false;

  /*
   |--------------------------------------------------------------------------
   | FIND CART ITEM
   |--------------------------------------------------------------------------
   */

  const cartItem =
  cartData?.cartItems?.find(
    (item) =>
      item.variantId ===
      selectedVariant?.id
  );

  const quantity =
  cartItem?.variant?.quantity || 0;

  /*
   |--------------------------------------------------------------------------
   | ADD TO CART
   |--------------------------------------------------------------------------
   */

  const {
    mutate: addToCart,
    isPending:
      isAddingToCart,
  } = useAddToCart();

  /*
   |--------------------------------------------------------------------------
   | UPDATE CART
   |--------------------------------------------------------------------------
   */

  const {
    mutate: updateCart,
    isPending:
      isUpdatingCart,
  } = useMutation({
    mutationFn: ({
      cartItemId,
      quantity,
    }: {
      cartItemId: string;

      quantity: number;
    }) =>
      cartApi.updateItem(
        cartItemId,
        {
          quantity,
        }
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });

  /*
   |--------------------------------------------------------------------------
   | REMOVE CART ITEM
   |--------------------------------------------------------------------------
   */

  const {
    mutate: removeCartItem,
    isPending:
      isRemovingCartItem,
  } = useMutation({
    mutationFn: (
      cartItemId: string
    ) =>
      cartApi.removeItem(
        cartItemId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });

  /*
   |--------------------------------------------------------------------------
   | LOADING STATE
   |--------------------------------------------------------------------------
   */

  const isCartActionLoading =
    isAddingToCart ||
    isUpdatingCart ||
    isRemovingCartItem;

  /*
   |--------------------------------------------------------------------------
   | ADD TO CART
   |--------------------------------------------------------------------------
   */

  const handleAddToCart = () => {
    /*
     |--------------------------------------------------------------------------
     | AUTH CHECK
     |--------------------------------------------------------------------------
     */

    if (!isAuthenticated) {
      router.push("/login");

      return;
    }

    /*
     |--------------------------------------------------------------------------
     | VALIDATION
     |--------------------------------------------------------------------------
     */

    if (!selectedVariant) {
      return;
    }

    /*
     |--------------------------------------------------------------------------
     | ADD ITEM
     |--------------------------------------------------------------------------
     */

    addToCart({
      productId: product.id,

      variantId:
        selectedVariant.id,

      quantity: 1,
    });
  };

  /*
   |--------------------------------------------------------------------------
   | INCREMENT
   |--------------------------------------------------------------------------
   */

  const handleIncrement =
    () => {
      if (!cartItem) {
        return;
      }

      updateCart({
        cartItemId:
          cartItem.id,

        quantity:
          quantity + 1,
      });
    };

  /*
   |--------------------------------------------------------------------------
   | DECREMENT
   |--------------------------------------------------------------------------
   */

  const handleDecrement =
    () => {
      if (!cartItem) {
        return;
      }

      /*
       |--------------------------------------------------------------------------
       | REMOVE IF ZERO
       |--------------------------------------------------------------------------
       */

      if (quantity <= 1) {
        removeCartItem(
          cartItem.id
        );

        return;
      }

      /*
       |--------------------------------------------------------------------------
       | UPDATE
       |--------------------------------------------------------------------------
       */

      updateCart({
        cartItemId:
          cartItem.id,

        quantity:
          quantity - 1,
      });
    };

  /*
   |--------------------------------------------------------------------------
   | WISHLIST
   |--------------------------------------------------------------------------
   */

 const handleWishlist =
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
          product.id
        );

        return;
      }

      await addToWishlist(
        product.id
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-5">
      {/* ====================================================== */}
      {/* ACTION BUTTONS */}
      {/* ====================================================== */}

      <div className="flex gap-3">
        {/* ====================================================== */}
        {/* QUANTITY CONTROLS */}
        {/* ====================================================== */}

        {quantity > 0 ? (
          <div
            className="
              flex
              h-12
              flex-1
              items-center
              overflow-hidden
              rounded-xl
              border
              border-gray-300
              bg-white
            "
          >
            {/* MINUS */}

            <button
              type="button"
              onClick={
                handleDecrement
              }
              disabled={
                isCartActionLoading
              }
              className="
                flex
                h-full
                w-14
                items-center
                justify-center
                border-r
                border-gray-200
                transition-colors
                hover:bg-gray-50
                disabled:opacity-50
              "
            >
              <Minus size={18} />
            </button>

            {/* QUANTITY */}

            <div
              className="
                flex
                flex-1
                items-center
                justify-center
                text-sm
                font-semibold
                text-gray-900
              "
            >
              {isCartActionLoading ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                quantity
              )}
            </div>

            {/* PLUS */}

            <button
              type="button"
              onClick={
                handleIncrement
              }
              disabled={
                isCartActionLoading
              }
              className="
                flex
                h-full
                w-14
                items-center
                justify-center
                border-l
                border-gray-200
                transition-colors
                hover:bg-gray-50
                disabled:opacity-50
              "
            >
              <Plus size={18} />
            </button>
          </div>
        ) : (
          /* ====================================================== */
          /* ADD TO CART */
          /* ====================================================== */

          <button
            type="button"
            onClick={
              handleAddToCart
            }
            disabled={
              !isInStock ||
              !selectedVariant ||
              isCartActionLoading ||
              isAuthLoading
            }
            className="
              flex
              h-12
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-teal-600
              px-6
              text-sm
              font-semibold
              text-white
              transition-all
              duration-200
              hover:bg-teal
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isCartActionLoading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Adding...
              </>
            ) : (
              <>
                <ShoppingCart
                  size={18}
                />

                {isInStock
                  ? "Add To Cart"
                  : "Out Of Stock"}
              </>
            )}
          </button>
        )}

        {/* ====================================================== */}
        {/* WISHLIST */}
        {/* ====================================================== */}

       <button
  type="button"
  onClick={
    handleWishlist
  }
  disabled={
    isWishlistLoading
  }
  className="
    flex
    h-12
    w-12
    items-center
    justify-center
    rounded-xl
    border
    border-gray-300
    bg-white
    transition-all
    duration-200
    hover:bg-gray-50
    disabled:opacity-50
  "
>
  {isWishlistLoading ? (
    <Loader2
      size={20}
      className="animate-spin"
    />
  ) : (
    <Heart
      size={20}
      className={
        isWishlisted
          ? "fill-red-500 text-red-500"
          : "text-gray-700"
      }
    />
  )}
</button>
      </div>

      
    </div>
  );
}