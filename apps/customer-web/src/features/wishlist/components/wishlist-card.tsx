// src/features/wishlist/components/wishlist-card.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useUpdateCartItem } from "@/features/cart/hooks/use-update-cart-item";
import { useRemoveCartItem } from "@/features/cart/hooks/use-remove-cart-item";
import {
  Star,
  Trash2,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";

import { useCart } from "@/features/cart/hooks/use-cart";
import { useAddToCart } from "@/features/cart/hooks/use-add-to-cart";
import { cartApi } from "@/features/cart/api/cart.api";
import { useAuthGuard } from "@/features/auth/hooks/use-auth-guard";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WishlistItem } from "@/features/wishlist/types/wishlist.type";
import { useRemoveFromWishlist } from "@/features/wishlist/hooks/use-remove-from-wishlist";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Product } from "@/features/products/types/product.type";
import { productApi } from "@/features/products/api/product.api";
import { localCartService } from "@/features/cart/hooks/local-cart.service";

interface WishlistCardProps {
  item: WishlistItem;
}

const PLACEHOLDER_IMAGE = "/Logo/jpl_logo.png";

export function WishlistCard({ item }: WishlistCardProps) {
  const queryClient = useQueryClient();
  const { requireAuth } = useAuthGuard();

  const {
    mutateAsync: removeFromWishlist,
    isPending: isRemovingFromWishlist,
  } = useRemoveFromWishlist();

  const product = item.product;

  const variant =
    product?.variants?.find((v) => v.id === product.defaultVariantId) ||
    product?.variants?.[0];

  const { data: cartData } = useCart();
  const { mutateAsync: addToCart, isPending: isAddingToCart } = useAddToCart();

  const cartItem = cartData?.cartItems?.find(
    (ci) => ci.variantId === variant?.id
  );
  const cartQuantity = cartItem?.variant?.quantity || 0;

  const stockQuantity =
    typeof variant?.stock === "number"
      ? variant.stock
      : variant?.stock?.quantity || 0;

  const isInStock = stockQuantity > 0;

  const mrp = variant?.pricing?.mrp || product.pricing?.minPrice || 0;
  const sellingPrice = variant?.pricing?.sellingPrice || product.pricing?.maxPrice || 0;

  const discountPercentage =
    mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

  const productSlug = product.slug || product.id;

  const productImage =
    variant?.images?.main?.trim() ||
    product.image?.main?.trim() ||
    product.image?.main?.trim() ||
    PLACEHOLDER_IMAGE;

  const [imageSrc, setImageSrc] = useState(productImage);

  const {
  mutateAsync: updateCartItem,
  isPending: isUpdatingCart,
} = useUpdateCartItem();

const {
  mutateAsync: removeCartItem,
  isPending: isRemovingCart,
} = useRemoveCartItem();

const isCartLoading =
  isAddingToCart ||
  isUpdatingCart ||
  isRemovingCart;

const { isAuthenticated } = useAuth();

const handleAddToCart = async () => {
  try {
    let fullProduct;

    if (!isAuthenticated) {
      const response = await productApi.getProductBySlug(product.slug);
      fullProduct = response.data;
    }

    await addToCart({
      productId: product.id,
      variantId:
        product.defaultVariantId ?? product.variants[0]?.id ?? "",
      quantity: 1,
      product: fullProduct,
    });

    await queryClient.invalidateQueries({
      queryKey: ["cart"],
    });
  } catch (error) {
    console.error("ADD TO CART", error);
  }
};
 const handleIncrease = async (
  e: React.MouseEvent<HTMLButtonElement>
) => {
  e.preventDefault();
  e.stopPropagation();

  if (!cartItem || !variant?.id) {
    return;
  }

  try {
    await updateCartItem({
     productId: cartItem.productId,
  variantId: variant.id,
  cartItemId: isAuthenticated
    ? cartItem.id
    : undefined,
  quantity: cartQuantity + 1,
    });
  } catch (error) {
    console.error("UPDATE CART ERROR", error);
  }
};

 const handleDecrease = async (
  e: React.MouseEvent<HTMLButtonElement>
) => {
  e.preventDefault();
  e.stopPropagation();

  if (!cartItem || !variant?.id) {
    return;
  }

  try {
    if (cartQuantity <= 1) {
      await removeCartItem({
        productId: cartItem.productId,
        variantId: variant.id,
      });

      return;
    }

    await updateCartItem({
     productId: cartItem.productId,
  variantId: variant.id,
  cartItemId: isAuthenticated
    ? cartItem.id
    : undefined,
  quantity: cartQuantity - 1,
    });
  } catch (error) {
    console.error("UPDATE/REMOVE CART ERROR", error);
  }
};

  const truncateTagText = (str: string) => {
    if (!str) return "";
    return str.length > 12 ? `${str.substring(0, 11)}...` : str;
  };

  const averageRating = product.ratings?.average || variant?.ratings?.average || 0;
  const reviewCount = product.ratings?.count || variant?.ratings?.count || 0;

  const handleRemoveFromWishlist = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await removeFromWishlist(product.id);
    } catch (error) {
      console.error("REMOVE FROM WISHLIST ERROR", error);
    }
  };

  return (
    <Link href={`/products/${productSlug}`} className="group block h-full">
      <article
        className="
          flex
          h-full
          min-h-[290px]
          flex-col
          overflow-hidden
          rounded-xl
          border
          border-gray-200
          bg-white
          transition-all
          duration-300
          hover:border-gray-300
          hover:shadow-md
        "
      >
        {/* IMAGE Container with structural relative positioning */}
        <div
          className="
            relative
            flex
            h-[140px]
            items-center
            justify-center
            overflow-hidden
            border-b
            border-gray-100
            bg-white
            p-2
          "
        >
          {/* TOP-LEFT OVERLAY FLOATING BADGE FOR PRODUCT TAGS */}
          {product.tags?.[0] && (
            <div className="absolute top-0 left-0 z-10 h-20 w-20 overflow-hidden pointer-events-none rounded-tl-xl">
              <style>{`
                @keyframes typing { from { width: 0 } to { width: 100% } }
                .animate-tag-type {
                  display: inline-block;
                  white-space: nowrap;
                  overflow: hidden;
                  animation: typing 2.5s steps(12, end) infinite alternate;
                }
              `}</style>
              <span className="absolute top-[16px] left-[-26px] block w-[100px] -rotate-45 bg-purple-200 py-0.5 text-center text-[8.5px] font-extrabold uppercase tracking-widest text-purple-900 shadow-md">
                <span className="animate-tag-type mx-auto max-w-full">
                  {truncateTagText(product.tags[0])}
                </span>
              </span>
            </div>
          )}

          {/* BOTTOM-LEFT FLOATING BADGE FOR DISCOUNT PERCENTAGE */}
          {discountPercentage > 0 && (
            <span
              className="
                absolute
                bottom-2
                left-2
                z-10
                rounded
                bg-blue-600
                px-1.5
                py-0.5
                text-[10px]
                font-bold
                text-white
                shadow-sm
              "
            >
              {discountPercentage}% OFF
            </span>
          )}

          {/* TRASH / REMOVE FROM WISHLIST BUTTON */}
          <button
            type="button"
            onClick={handleRemoveFromWishlist}
            disabled={isRemovingFromWishlist}
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
              transition-colors
              hover:bg-gray-50
            "
          >
            {isRemovingFromWishlist ? (
              <Loader2 size={14} className="animate-spin text-gray-500" />
            ) : (
              <Trash2 size={14} className="text-red-500" />
            )}
          </button>

          <div
            className="
              relative
              h-full
              w-full
              p-1
            "
          >
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="
                (max-width: 768px) 50vw,
                (max-width: 1200px) 25vw,
                20vw
              "
              onError={() => setImageSrc(PLACEHOLDER_IMAGE)}
              className="
                object-contain
                object-center
                transition-transform
                duration-300
                group-hover:scale-105
              "
            />
          </div>
        </div>

        {/* CONTENT */}
        <div
          className="
            flex
            flex-1
            flex-col
            px-3
            py-2
          "
        >
          {/* BRAND & RATING SIDE-BY-SIDE CONTAINER */}
          <div className="flex items-center justify-between gap-2 min-h-[22px]">
            {!!product.brand?.name ? (
              <p
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-wide
                  bg-gradient-to-r
                  from-blue-600
                  via-teal-600
                  to-emerald-500
                  bg-clip-text
                  text-transparent
                  transition-all
                  duration-300
                  group-hover:from-emerald-500
                  group-hover:via-teal-600
                  group-hover:to-blue-600
                "
              >
                {product.brand.name}
              </p>
            ) : (
              <div />
            )}

            {/* RATING & REVIEWS ALIGNED RIGHT OF BRAND */}
            {averageRating > 0 && (
              <div className="flex items-center gap-1 text-xs flex-shrink-0">
                <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded text-amber-700 font-bold text-[10px]">
                  <span>{averageRating.toFixed(1)}</span>
                  <Star size={10} className="fill-amber-500 stroke-amber-500" />
                </div>
                {reviewCount > 0 && (
                  <span className="text-gray-400 text-[10px] font-medium">({reviewCount})</span>
                )}
              </div>
            )}
          </div>

          {/* PRODUCT NAME */}
          <h3
            className="
              line-clamp-2
              text-[15px]
              font-semibold
              leading-5
              text-gray-900
              transition-all
              duration-300
            "
          >
            {product.name}
          </h3>

          {/* DESCRIPTION */}
          <p
            className="
              min-h-[30px]
              line-clamp-2
              text-[12px]
              leading-4
              text-gray-500
            "
          >
            {product.descriptions?.short ||
              product.shortDescription ||
              product.features?.[0] ||
              "Professional medical equipment"}
          </p>

          {/* PRICE */}
          <div>
            <div className="flex items-end gap-1">
              <span
                className="
                  text-[20px]
                  font-bold
                  leading-none
                  tracking-tight
                  text-gray-900
                "
              >
                ₹{sellingPrice.toLocaleString()}
              </span>

              {mrp > sellingPrice && (
                <span
                  className="
                    mb-[2px]
                    text-[12px]
                    text-gray-400
                    line-through
                  "
                >
                  ₹{mrp.toLocaleString()}
                </span>
              )}
            </div>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  text-[10px]
                  text-gray-400
                "
              >
                Inclusive GST
              </span>
            </div>
          </div>

          {/* BUTTON */}
          <div className="mt-auto pt-2">
            {cartQuantity > 0 ? (
              <div
                className="
                  flex
                  h-10
                  items-center
                  overflow-hidden
                  rounded-lg
                  border
                  border-teal-300
                "
              >
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={isCartLoading}
                  className="
                    flex
                    h-full
                    w-10
                    items-center
                    justify-center
                    bg-gray-50
                    transition-colors
                    hover:bg-gray-100
                    disabled:opacity-50
                  "
                >
                  {isRemovingCart ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Minus size={15} />
                  )}
                </button>

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
                  {isUpdatingCart ? <Loader2 size={15} className="animate-spin" /> : cartQuantity}
                </div>

                <button
                  type="button"
                  onClick={handleIncrease}
                  disabled={isCartLoading || cartQuantity >= stockQuantity}
                  className="
                    flex
                    h-full
                    w-10
                    items-center
                    justify-center
                    bg-gray-50
                    transition-colors
                    hover:bg-gray-100
                    disabled:opacity-50
                  "
                >
                  <Plus size={15} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isInStock || isAddingToCart}
                className={`
  flex
  h-10
  w-full
  items-center
  justify-center
  gap-2
  rounded-lg
  px-3
  text-[12px]
  font-semibold
  transition-all
  duration-200
  ${
    isInStock
      ? "bg-teal-600 hover:bg-teal-600 text-white"
        : "cursor-not-allowed border border-orange-200 bg-orange-50 text-orange-600"
  }
`}
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    ADDING...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={15} />
                    {isInStock ? "ADD TO CART" : "OUT OF STOCK"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}