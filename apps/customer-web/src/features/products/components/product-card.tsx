'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from "react";
import { Bell, Loader2, Minus, Plus, ShoppingCart, Star,XCircle } from 'lucide-react';
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  OutOfStockNotificationDialog,
} from "@/features/products/components/out-of-stock-notification-dialog";

import { useUpdateCartItem } from "@/features/cart/hooks/use-update-cart-item";

import { useRemoveCartItem } from "@/features/cart/hooks/use-remove-cart-item";
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Product } from '@/features/products/types/product.type';

import { useAddToCart } from '@/features/cart/hooks/use-add-to-cart';
import { useCart } from '@/features/cart/hooks/use-cart';

import { cartApi } from '@/features/cart/api/cart.api';

import { useAuthGuard } from '@/features/auth/hooks/use-auth-guard';
import { WishlistButton } from '@/features/wishlist/components/wishlist-button';
import { MAX_CART_ITEM_QUANTITY } from '@/features/bulk-order/constants/bulk-order.constants';
import { openBulkOrderModal } from '@/features/bulk-order/store/bulk-order-modal.store';

interface ProductCardProps {
  product: Product;
}

const PLACEHOLDER_IMAGE = '/Logo/jpl_logo.png';

export function ProductCard({ product }: ProductCardProps) {
  const {
  isAuthenticated,
} = useAuth();

  const variant =
    product?.variants?.find((item) => item.id === product.defaultVariantId) ||
    product?.variants?.[0];

  const { data: cartData } = useCart();

  const { mutateAsync: addToCart, isPending: isAddingToCart } = useAddToCart();

  const cartItem = cartData?.cartItems?.find((item) => item.variantId === variant?.id);
  const cartQuantity = cartItem?.variant?.quantity || 0;

  const stockQuantity =
    typeof variant?.stock === 'number' ? variant.stock : variant?.stock?.quantity || 0;

  const isInStock = stockQuantity > 0;

  const mrp = variant?.pricing?.mrp || 0;

  const sellingPrice = variant?.pricing?.sellingPrice || product.price.min || 0;

  const discountPercentage =
    mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

  const productSlug = product.slug || product.id;

  const productImage =
    variant?.images?.main?.trim() || product.images?.main?.trim() || PLACEHOLDER_IMAGE;
  
  const [imageSrc, setImageSrc] = useState(productImage);
  
  const [
  isNotificationDialogOpen,
  setIsNotificationDialogOpen,
] = useState(false);

  const {
  mutateAsync: updateCartItem,
  isPending: isUpdatingCart,
} = useUpdateCartItem();

  const {
  mutateAsync: removeCartItem,
  isPending: isRemovingCart,
} = useRemoveCartItem();

  const isCartLoading = isAddingToCart || isUpdatingCart || isRemovingCart;

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    e.stopPropagation();

    if (!variant?.id) {
      return;
    }

    if (!isInStock) {
      return;
    }

    if (cartQuantity >= MAX_CART_ITEM_QUANTITY) {
      openBulkOrderModal({
        productName: product.name,
        variantName: variant.name,
        attributes: variant.attributes ? Object.entries(variant.attributes) : undefined,
        productId: product.id,
        variantId: variant.id,
        sellingPrice: variant.pricing?.sellingPrice || product.price?.min,
        image: variant.images?.main || product.images?.main,
        productSlug: product.slug,
        requestedQuantity: 10,
      });
      return;
    }

    try {
      await addToCart({
        productId: product.id,
        variantId: variant.id,
        quantity: 1,
        product,
      });
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to add item to cart";
      console.error('ADD TO CART ERROR:', msg);
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

    if (cartQuantity >= MAX_CART_ITEM_QUANTITY) {
      openBulkOrderModal({
        productName: product.name,
        variantName: variant.name,
        attributes: variant.attributes ? Object.entries(variant.attributes) : undefined,
        productId: product.id,
        variantId: variant.id,
        sellingPrice: variant.pricing?.sellingPrice || product.price?.min,
        image: variant.images?.main || product.images?.main,
        productSlug: product.slug,
        requestedQuantity: 10,
      });
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
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to update cart item";
      console.error("UPDATE CART ERROR:", msg);
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
        cartItemId: isAuthenticated
          ? cartItem.id
          : undefined,
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
  } catch (error: any) {
    const msg = error?.response?.data?.message || error?.message || "Failed to update cart item";
    console.error("UPDATE/REMOVE CART ERROR:", msg);
  }
};
  /* Helper function to cap tag rendering length precisely around 10-12 characters max */
  const truncateTagText = (str: string) => {
    if (!str) return '';
    return str.length > 12 ? `${str.substring(0, 11)}...` : str;
  };

  // Safely map optional rating parameters based on your exact Product types structure
  const averageRating = product.ratings?.average || variant?.ratings?.average || 0;
  const reviewCount = product.ratings?.count || variant?.ratings?.count || 0;

  return(
    <>
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
              {/* Injecting the inline keyframes for the typing effect seamlessly */}
              <style>{`
                @keyframes typing { from { width: 0 } to { width: 100% } }
                .animate-tag-type {
                  display: inline-block;
                  white-space: nowrap;
                  overflow: hidden;
                  animation: typing 2.5s steps(12, end) infinite alternate;
                }
                  @keyframes price-shine {
  0% {
    left: -120%;
  }

  40% {
    left: 120%;
  }

  100% {
    left: 120%;
  }
}

.animate-price-shine {
  animation: price-shine 2s linear infinite;
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

          {!isInStock && (
  <div
    className="
      absolute
      right-2
      top-2
      z-20
      flex
      items-center
      gap-1
      rounded-full
      bg-red-500
      px-2
      py-1
      text-[9px]
      font-bold
      text-white
      shadow-md
    "
  >
    <XCircle size={12} />

    OUT OF STOCK
  </div>
)}
          <WishlistButton product={product} />
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
  onError={() => setImageSrc("/Logo/jpl_logo.png")}
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

          {/* PRODUCT NAME (WITH PREMIUM GRADIENT SHINY EFFECT ON HOVER) */}
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
              product.features?.[0] ||
              'Professional medical equipment'}
          </p>

          {/* PRICE */}

          <div>
            <div className="flex items-end gap-1">
             <span
  className="
    relative
    inline-block
    overflow-hidden
    text-[20px]
    font-bold
    leading-none
    tracking-tight
    text-gray-900
  "
>
  <span className="relative z-10">
    ₹{sellingPrice.toLocaleString()}
  </span>

  {/* CONTINUOUS SHINE — SELLING PRICE ONLY */}
 <span
  aria-hidden="true"
  className="
    pointer-events-none
    absolute
    inset-y-[-20%]
    left-0
    z-20
    w-[35%]
    rotate-[18deg]
    bg-gradient-to-r
    from-transparent
    via-white/80
    to-transparent
    animate-price-shine
  "
/>
</span>
              {mrp > sellingPrice && (
                <span
                  className="
                    mb-[2px]
                    text-[12px]
                    text-gray-700
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
          <Loader2
            size={15}
            className="animate-spin"
          />
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
        {isUpdatingCart ? (
          <Loader2
            size={15}
            className="animate-spin"
          />
        ) : (
          cartQuantity
        )}
      </div>

      <button
        type="button"
        onClick={handleIncrease}
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
        <Plus size={15} />
      </button>
    </div>
  ) : isInStock ? (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={isAddingToCart}
      className="
        flex
        h-10
        w-full
        items-center
        justify-center
        gap-2
        rounded-lg
        bg-teal-600
        px-3
        text-[12px]
        font-semibold
        text-white
        transition-all
        duration-200
        hover:bg-teal-700
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      {isAddingToCart ? (
        <>
          <Loader2
            size={15}
            className="animate-spin"
          />

          ADDING...
        </>
      ) : (
        <>
          <ShoppingCart size={15} />

          ADD TO CART
        </>
      )}
    </button>
  ) : (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();

        event.stopPropagation();

        setIsNotificationDialogOpen(true);
      }}
      className="
        flex
        h-10
        w-full
        items-center
        justify-center
        gap-2
        rounded-lg
        border
        border-orange-200
        bg-orange-50
        px-3
        text-[12px]
        font-semibold
        text-orange-600
        transition-all
        duration-200
        hover:border-orange-300
        hover:bg-orange-100
      "
    >
      <Bell size={15} />

      NOTIFY ME
    </button>
  )}
</div>
        </div>
      </article>
    </Link>
      <OutOfStockNotificationDialog
      open={isNotificationDialogOpen}
      onClose={() =>
        setIsNotificationDialogOpen(false)
      }
      productName={product.name}
      productId={product.id}
      variantId={variant?.id}
      variantName={variant?.name}
    />
    </>
  );
}
