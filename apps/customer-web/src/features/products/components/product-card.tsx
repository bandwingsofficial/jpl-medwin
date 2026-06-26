"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Heart,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { Product } from "@/features/products/types/product.type";

import { useAddToCart } from "@/features/cart/hooks/use-add-to-cart";
import { useCart } from "@/features/cart/hooks/use-cart";

import { cartApi } from "@/features/cart/api/cart.api";

import { useAuthGuard } from "@/features/auth/hooks/use-auth-guard";
import { WishlistButton } from "@/features/wishlist/components/wishlist-button";

interface ProductCardProps {
  product: Product;
}

const PLACEHOLDER_IMAGE =
  "/images/product-placeholder.png";

export function ProductCard({
  product,
}: ProductCardProps) {
  const queryClient =
    useQueryClient();

  const { requireAuth } =
    useAuthGuard();

  const variant =
    product?.variants?.find(
      (item) =>
        item.id ===
        product.defaultVariantId
    ) || product?.variants?.[0];

  const { data: cartData } =
    useCart();

  const {
    mutateAsync: addToCart,
    isPending:
      isAddingToCart,
  } = useAddToCart();

  const cartItem =
  cartData?.cartItems?.find(
    (item) =>
      item.variantId === variant?.id
  );
  const cartQuantity =
    cartItem?.variant
      ?.quantity || 0;

  const stockQuantity =
    typeof variant?.stock ===
    "number"
      ? variant.stock
      : variant?.stock
          ?.quantity || 0;

  const isInStock =
    stockQuantity > 0;

  const mrp =
    variant?.pricing?.mrp ||
    product.price.max ||
    0;

  const sellingPrice =
    variant?.pricing
      ?.sellingPrice ||
    product.price.min ||
    0;

  const discountPercentage =
    mrp > sellingPrice
      ? Math.round(
          ((mrp - sellingPrice) /
            mrp) *
            100
        )
      : 0;

  const productSlug =
    product.slug || product.id;

  const productImage =
    variant?.images?.main?.trim() ||
    product.images?.main?.trim() ||
    PLACEHOLDER_IMAGE;

  const {
    mutateAsync:
      updateCartItem,
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

    onSuccess: async () => {
      await queryClient.invalidateQueries(
        {
          queryKey: ["cart"],
        }
      );
    },
  });

  const {
    mutateAsync:
      removeCartItem,
    isPending:
      isRemovingCart,
  } = useMutation({
    mutationFn: (
      cartItemId: string
    ) =>
      cartApi.removeItem(
        cartItemId
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries(
        {
          queryKey: ["cart"],
        }
      );
    },
  });

  const isCartLoading =
    isAddingToCart ||
    isUpdatingCart ||
    isRemovingCart;

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    e.stopPropagation();

    if (!requireAuth()) {
      return;
    }

    if (!variant?.id) {
      return;
    }

    if (!isInStock) {
      return;
    }

    try {
      await addToCart({
        productId: product.id,

        variantId:
          variant.id,

        quantity: 1,
      });

      await queryClient.invalidateQueries(
        {
          queryKey: ["cart"],
        }
      );
    } catch (error) {
      console.error(
        "ADD TO CART ERROR",
        error
      );
    }
  };

  const handleIncrease = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    e.stopPropagation();

    if (!requireAuth()) {
      return;
    }

    if (!cartItem?.id) {
      return;
    }

    if (
      cartQuantity >=
      stockQuantity
    ) {
      return;
    }

    try {
      await updateCartItem({
        cartItemId:
          cartItem.id,

        quantity:
          cartQuantity + 1,
      });
    } catch (error) {
      console.error(
        "UPDATE CART ERROR",
        error
      );
    }
  };

  const handleDecrease = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    e.stopPropagation();

    if (!requireAuth()) {
      return;
    }

    if (!cartItem?.id) {
      return;
    }

    try {
      if (cartQuantity <= 1) {
        await removeCartItem(
          cartItem.id
        );

        return;
      }

      await updateCartItem({
        cartItemId:
          cartItem.id,

        quantity:
          cartQuantity - 1,
      });
    } catch (error) {
      console.error(
        "REMOVE CART ERROR",
        error
      );
    }
  };

  /* Helper function to cap tag rendering length precisely around 10-12 characters max */
  const truncateTagText = (str: string) => {
    if (!str) return "";
    return str.length > 12 ? `${str.substring(0, 11)}...` : str;
  };

  // Safely map optional rating parameters based on your exact Product types structure
  const averageRating = product.ratings?.average || variant?.ratings?.average || 0;
  const reviewCount = product.ratings?.count || variant?.ratings?.count || 0;

  return (
    <Link
      href={`/products/${productSlug}`}
      className="group block h-full"
    >
      <article
        className="
          flex
          h-full
          min-h-[330px]
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
    `}</style>
    <span className="absolute top-[16px] left-[-26px] block w-[100px] -rotate-45 bg-purple-200 py-0.5 text-center text-[8.5px] font-extrabold uppercase tracking-widest text-purple-900 shadow-md">
      <span className="animate-tag-type mx-auto max-w-full">
        {truncateTagText(product.tags[0])}
      </span>
    </span>
  </div>
)}

          <WishlistButton
            productId={product.id}
          />
          <div
            className="
              relative
              h-full
              w-full
              p-1
            "
          >
            <Image
              src={productImage}
              alt={product.name}
              fill
              sizes="
                (max-width: 768px) 50vw,
                (max-width: 1200px) 25vw,
                20vw
              "
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
          {!!product.brand?.name && (
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-wide
                text-gray-500
              "
            >
              {product.brand.name}
            </p>
          )}

          {/* RATING & REVIEWS SECTION */}
          {averageRating > 0 && (
            <div className="flex items-center gap-1.5 mt-0.5 mb-1 text-xs">
              <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded text-amber-700 font-bold text-[11px]">
                <span>{averageRating.toFixed(1)}</span>
                <Star size={11} className="fill-amber-500 stroke-amber-500" />
              </div>
              {reviewCount > 0 && (
                <span className="text-gray-400 text-[11px] font-medium">
                  ({reviewCount})
                </span>
              )}
            </div>
          )}

          {/* PRODUCT NAME */}

          <h3
            className="
              min-h-[40px]
              line-clamp-2
              text-[15px]
              font-semibold
              leading-[21px]
              text-gray-900
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
              leading-[16px]
              text-gray-500
            "
          >
            {product.descriptions
              ?.short ||
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
                ₹
                {sellingPrice.toLocaleString()}
              </span>

              {mrp >
                sellingPrice && (
                <span
                  className="
                    mb-[2px]
                    text-[12px]
                    text-gray-400
                    line-through
                  "
                >
                  ₹
                  {mrp.toLocaleString()}
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
              {discountPercentage >
                0 && (
                <span
                  className="
                    text-[12px]
                    font-semibold
                    text-teal-600
                  "
                >
                  {discountPercentage}
                  % Off
                </span>
              )}

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
                  border-gray-200
                "
              >
                <button
                  type="button"
                  onClick={
                    handleDecrease
                  }
                  disabled={
                    isCartLoading
                  }
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
                    <Minus
                      size={15}
                    />
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
                  onClick={
                    handleIncrease
                  }
                  disabled={
                    isCartLoading ||
                    cartQuantity >=
                      stockQuantity
                  }
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
                onClick={
                  handleAddToCart
                }
                disabled={
                  !isInStock ||
                  isAddingToCart
                }
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
                  hover:bg-teal-800
                  disabled:cursor-not-allowed
                  disabled:bg-teal-300
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
                    <ShoppingCart
                      size={15}
                    />

                    {isInStock
                      ? "ADD TO CART"
                      : "OUT OF STOCK"}
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