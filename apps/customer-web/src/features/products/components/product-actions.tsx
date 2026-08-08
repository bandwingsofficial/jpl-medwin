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
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAuthGuard } from "@/features/auth/hooks/use-auth-guard";

import { useWishlist } from "@/features/wishlist/hooks/use-wishlist";

import { useAddToWishlist } from "@/features/wishlist/hooks/use-add-to-wishlist";

import { useRemoveFromWishlist } from "@/features/wishlist/hooks/use-remove-from-wishlist";

import { useCart } from "@/features/cart/hooks/use-cart";

import { cartApi } from "@/features/cart/api/cart.api";
import { useUpdateCartItem } from "@/features/cart/hooks/use-update-cart-item";
import { useRemoveCartItem } from "@/features/cart/hooks/use-remove-cart-item";

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

  /*
   |--------------------------------------------------------------------------
   | AUTH
   |--------------------------------------------------------------------------
   */

  const {
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();

  const { requireAuth } = useAuthGuard();

  const {
    wishlistIds,
  } = useWishlist();

  const {
    mutateAsync: addToWishlist,
    isPending: isAddingWishlist,
  } = useAddToWishlist();

  const {
    mutateAsync: removeFromWishlist,
    isPending: isRemovingWishlist,
  } = useRemoveFromWishlist();

  const isWishlisted =
    wishlistIds?.has(product.id) ?? false;

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
  selectedVariant?.stock?.quantity ?? 0;

const isInStock = stockQuantity > 0;

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
    isPending: isAddingToCart,
  } = useAddToCart();

  /*
   |--------------------------------------------------------------------------
   | UPDATE CART
   |--------------------------------------------------------------------------
   */

  const {
    mutate: updateCart,
    isPending: isUpdatingCart,
  } = useUpdateCartItem();

  /*
   |--------------------------------------------------------------------------
   | REMOVE CART ITEM
   |--------------------------------------------------------------------------
   */

  const {
    mutate: removeCartItem,
    isPending: isRemovingCartItem,
  } = useRemoveCartItem();

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
    console.log(
      "Selected Variant:",
      selectedVariant?.id
    );

    console.log(
      "Variant Name:",
      selectedVariant?.name
    );

    console.log(
      cartData?.cartItems
    );

    console.log(
      "Selected Variant:",
      selectedVariant?.id
    );

    console.log(
      cartData?.cartItems?.map(
        (item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.variant.quantity,
        })
      )
    );

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
      variantId: selectedVariant.id,
      quantity: 1,
      product,
    });
  };

  /*
   |--------------------------------------------------------------------------
   | BUY NOW
   |--------------------------------------------------------------------------
   */

  const handleBuyNow = () => {
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
     | ADD SELECTED VARIANT TO CART
     |--------------------------------------------------------------------------
     */

    addToCart(
      {
        productId: product.id,
        variantId: selectedVariant.id,
        quantity: 1,
        product,
      },
      {
        onSuccess: () => {
          /*
           |--------------------------------------------------------------------------
           | AFTER SUCCESSFULLY ADDING TO CART
           |--------------------------------------------------------------------------
           */

          router.push("/cart");
        },
      }
    );
  };

  /*
   |--------------------------------------------------------------------------
   | INCREMENT
   |--------------------------------------------------------------------------
   */

  const handleIncrement = () => {
    if (!cartItem || !selectedVariant) {
      return;
    }
     // Do not allow quantity above actual stock
  if (quantity >= stockQuantity) {
    return;
  }


    updateCart({
      productId: cartItem.productId,
      variantId: selectedVariant.id,
      quantity: quantity + 1,
    });
  };

  /*
   |--------------------------------------------------------------------------
   | DECREMENT
   |--------------------------------------------------------------------------
   */

  const handleDecrement = () => {
    if (!cartItem || !selectedVariant) {
      return;
    }

    if (quantity <= 1) {
      removeCartItem({
        productId: cartItem.productId,
        variantId: selectedVariant.id,
        cartItemId: isAuthenticated
          ? cartItem.id
          : undefined,
      });

      return;
    }

    updateCart({
      productId: cartItem.productId,
      variantId: selectedVariant.id,
      quantity: quantity - 1,
    });
  };

  /*
   |--------------------------------------------------------------------------
   | WISHLIST
   |--------------------------------------------------------------------------
   */

  const handleWishlist = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        return;
      }

      await addToWishlist(product);
    } catch (error) {
      console.error(error);
    }
  };

  /*
   |--------------------------------------------------------------------------
   | RENDER
   |--------------------------------------------------------------------------
   |
   | IMPORTANT:
   | Cart controls are intentionally NOT rendered here.
   |
   | VariantSelector handles:
   | - Add To Cart
   | - Quantity
   | - Increment
   | - Decrement
   |
   | ProductActions handles:
   | - Buy Now
   | - Wishlist
   |
   */

  return (
    <div className="w-full">
      <div className="flex w-full gap-3">
        {/* ====================================================== */}
        {/* BUY NOW */}
        {/* ====================================================== */}

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={
            !isInStock ||
            !selectedVariant ||
            isCartActionLoading ||
  quantity >= stockQuantity ||
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
            hover:bg-teal-700
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {isAddingToCart ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Processing...
            </>
          ) : (
            <>
              <ShoppingCart size={18} />

              {isInStock
                ? "Buy Now"
                : "Out Of Stock"}
            </>
          )}
        </button>

        {/* ====================================================== */}
        {/* WISHLIST */}
        {/* ====================================================== */}

        <button
          type="button"
          onClick={handleWishlist}
          disabled={isWishlistLoading}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-gray-300
            bg-white
            transition-all
            duration-200
            hover:bg-gray-50
            active:scale-[0.98]
            disabled:cursor-not-allowed
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