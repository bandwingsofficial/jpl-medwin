"use client";

import React, { useEffect, useRef } from "react";
import {
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";

import {
  Product,
  ProductVariant,
} from "@/features/products/types/product.type";

import { useAddToCart } from "@/features/cart/hooks/use-add-to-cart";
import { useCart } from "@/features/cart/hooks/use-cart";
import { useUpdateCartItem } from "@/features/cart/hooks/use-update-cart-item";
import { useRemoveCartItem } from "@/features/cart/hooks/use-remove-cart-item";
import { useAuth } from "@/features/auth/hooks/use-auth";

interface ProductVariantSelectorProps {
  product: Product;
  variants: ProductVariant[];
  selectedVariantId: string;
  onChange: (variantId: string) => void;
}

export function ProductVariantSelector({
  product,
  variants,
  selectedVariantId,
  onChange,
}: ProductVariantSelectorProps) {
  const scrollContainerRef =
    useRef<HTMLDivElement | null>(null);

  const variantRefs = useRef<
    Record<string, HTMLDivElement | null>
  >({});

  /*
   * ================================================================
   * AUTH
   * ================================================================
   */

  const { isAuthenticated } = useAuth();

  /*
   * ================================================================
   * CART
   * ================================================================
   */

  const { data: cartData } = useCart();

  /*
   * ================================================================
   * ADD TO CART
   * ================================================================
   */

  const {
    mutate: addToCart,
    isPending: isAddingToCart,
  } = useAddToCart();

  /*
   * ================================================================
   * UPDATE CART
   * ================================================================
   */

  const {
    mutate: updateCart,
    isPending: isUpdatingCart,
  } = useUpdateCartItem();

  /*
   * ================================================================
   * REMOVE CART ITEM
   * ================================================================
   */

  const {
    mutate: removeCartItem,
    isPending: isRemovingCartItem,
  } = useRemoveCartItem();

  /*
   * ================================================================
   * AUTO CENTER SELECTED VARIANT
   * ================================================================
   */

  useEffect(() => {
    const selectedElement =
      variantRefs.current[selectedVariantId];

    const container =
      scrollContainerRef.current;

    if (!selectedElement || !container) {
      return;
    }

    const isScrollable =
      container.scrollHeight >
      container.clientHeight;

    if (!isScrollable) {
      return;
    }

    const containerHeight =
      container.offsetHeight;

    const elementTop =
      selectedElement.offsetTop;

    const elementHeight =
      selectedElement.offsetHeight;

    const scrollTo =
      elementTop -
      containerHeight / 2 +
      elementHeight / 2;

    container.scrollTo({
      top: scrollTo,
      behavior: "smooth",
    });
  }, [selectedVariantId]);

  /*
   * ================================================================
   * EMPTY STATE
   * ================================================================
   */

  if (!variants?.length) {
    return null;
  }

  const handleVariantSelect = (
    variant: ProductVariant
  ) => {
    const stockQuantity =
      variant.stock?.quantity ?? 0;

    if (stockQuantity <= 0) {
      return;
    }

    onChange(variant.id);
  };

  /*
   * ================================================================
   * ADD VARIANT
   * ================================================================
   */

  const handleAddToCart = (
    variant: ProductVariant
  ) => {
    const stockQuantity =
      variant.stock?.quantity ?? 0;

    const isInStock =
      stockQuantity > 0;

    if (!isInStock) {
      return;
    }

    addToCart({
      productId: product.id,
      variantId: variant.id,
      quantity: 1,
      product,
    });

    onChange(variant.id);
  };

  /*
   * ================================================================
   * INCREMENT
   * ================================================================
   */

  const handleIncrement = (
    variant: ProductVariant
  ) => {
    const cartItem =
      cartData?.cartItems?.find(
        (item) =>
          item.variantId === variant.id
      );

    if (!cartItem) {
      return;
    }

    const currentQuantity =
      cartItem.variant?.quantity ?? 0;

    const stockQuantity =
      variant.stock?.quantity ?? 0;

    // Do not allow quantity above available stock
    if (currentQuantity >= stockQuantity) {
      return;
    }

    updateCart({
      productId: cartItem.productId,
      variantId: variant.id,
      quantity: currentQuantity + 1,
    });
  };

  /*
   * ================================================================
   * DECREMENT
   * ================================================================
   */

  const handleDecrement = (
    variant: ProductVariant
  ) => {
    const cartItem =
      cartData?.cartItems?.find(
        (item) =>
          item.variantId === variant.id
      );

    if (!cartItem) {
      return;
    }

    const currentQuantity =
      cartItem.variant?.quantity || 0;

    /*
     * Quantity 1 → Remove from cart
     */

    if (currentQuantity <= 1) {
      removeCartItem({
        productId: cartItem.productId,
        variantId: variant.id,
        cartItemId: isAuthenticated
          ? cartItem.id
          : undefined,
      });

      return;
    }

    /*
     * Quantity > 1 → Decrease
     */

    updateCart({
      productId: cartItem.productId,
      variantId: variant.id,
      quantity: currentQuantity - 1,
    });
  };

  /*
   * ================================================================
   * RENDER
   * ================================================================
   */

  return (
    <div className="w-full space-y-3">
      {/* ========================================================== */}
      {/* TITLE */}
      {/* ========================================================== */}

      <div
        className="
          text-sm
          font-medium
          uppercase
          tracking-wide
          text-gray-600
          sm:text-base
        "
      >
        Select Variants :
      </div>

      {/* ========================================================== */}
      {/* VARIANT LIST */}
      {/* ========================================================== */}

      <div
        ref={scrollContainerRef}
        className="
          flex
          max-h-[360px]
          flex-col
          gap-2
          overflow-y-auto
          py-1
          pr-0.5
          scroll-smooth

          [-ms-overflow-style:none]
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden

          sm:max-h-[320px]
          sm:gap-2.5
        "
      >
        {variants.map((variant) => {
          const isSelected =
            selectedVariantId === variant.id;

          const stockQuantity =
            variant.stock?.quantity ?? 0;

          const isInStock =
            stockQuantity > 0;

          /*
           * --------------------------------------------------------
           * CART ITEM FOR THIS EXACT VARIANT
           * --------------------------------------------------------
           */

          const cartItem =
            cartData?.cartItems?.find(
              (item) =>
                item.variantId ===
                variant.id
            );

          const quantity =
            cartItem?.variant?.quantity || 0;

          const isInCart =
            quantity > 0;

          /*
           * --------------------------------------------------------
           * PRICE
           * --------------------------------------------------------
           */

          const mrp =
            variant.pricing?.mrp || 0;

          const sellingPrice =
            variant.pricing?.sellingPrice || 0;

          const discountPercentage =
            mrp > sellingPrice
              ? Math.round(
                  ((mrp - sellingPrice) /
                    mrp) *
                    100
                )
              : 0;

          /*
           * --------------------------------------------------------
           * ATTRIBUTES
           * --------------------------------------------------------
           */

          const attributes =
            Object.entries(
              variant.attributes || {}
            );

          /*
           * --------------------------------------------------------
           * LOADING
           * --------------------------------------------------------
           */

          const isCartActionLoading =
            isAddingToCart ||
            isUpdatingCart ||
            isRemovingCartItem;

          return (
            <div
              key={variant.id}
              ref={(element) => {
                variantRefs.current[
                  variant.id
                ] = element;
              }}
              className={`
                w-full
                rounded-xl
                border
                p-2.5
                transition-all
                duration-200

                sm:flex
                sm:items-center
                sm:gap-4
                sm:p-3

                ${
                  isSelected
                    ? "border-teal-600 bg-teal-50/40 ring-1 ring-teal-600/20 shadow-sm"
                    : "border-gray-200 bg-white"
                }

                ${
                  !isInStock
                    ? "border-gray-200 bg-white"
                    : "hover:border-gray-300"
                }
              `}
            >
              {/* ================================================= */}
              {/* PRODUCT CONTENT */}
              {/* ================================================= */}

              <div
                className="
                  grid
                  grid-cols-[52px_minmax(0,1fr)]
                  gap-2.5

                  sm:grid-cols-[64px_minmax(0,1fr)]
                  sm:gap-3
                "
              >
                {/* ================================================= */}
                {/* IMAGE */}
                {/* ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    handleVariantSelect(variant)
                  }
                  disabled={!isInStock}
                  className="
                    flex
                    h-[52px]
                    w-[52px]
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    focus:outline-none
                    sm:h-16
                    sm:w-16
                    disabled:cursor-not-allowed
                  "
                  aria-label={`Select ${variant.name}`}
                >
                  {(
                    variant.images?.main ||
                    variant.images?.gallery
                      ?.length
                  ) ? (
                    <img
                      src={
                        variant.images.main ||
                        variant.images
                          .gallery[0]
                      }
                      alt={variant.name}
                      className="
                        h-full
                        w-full
                        object-contain
                      "
                    />
                  ) : (
                    <span className="text-[10px] text-gray-400">
                      No image
                    </span>
                  )}
                </button>

                {/* ================================================= */}
                {/* DETAILS */}
                {/* ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    handleVariantSelect(variant)
                  }
                  disabled={!isInStock}
                  className="
                    min-w-0
                    text-left
                    focus:outline-none
                    disabled:cursor-not-allowed
                  "
                >
                  {/* PRODUCT NAME */}

                  <h4
                    className="
                      line-clamp-2
                      text-sm
                      font-semibold
                      leading-5
                      tracking-tight
                      text-gray-900

                      sm:line-clamp-none
                      sm:whitespace-nowrap
                      sm:text-base
                      sm:leading-5
                    "
                  >
                    {variant.name}
                  </h4>

                  {/* ATTRIBUTES */}

                  {!!attributes.length && (
                    <div
                      className="
                        mt-1
                        flex
                        flex-wrap
                        gap-x-2
                        gap-y-1
                      "
                    >
                      {attributes.map(
                        ([key, value]) => (
                          <span
                            key={`${key}-${value}`}
                            className="
                              text-[10px]
                              text-gray-500
                              sm:text-[11px]
                            "
                          >
                            <span className="capitalize text-gray-400">
                              {key}:
                            </span>{" "}
                            <span className="font-medium text-gray-700">
                              {String(value)}
                            </span>
                          </span>
                        )
                      )}
                    </div>
                  )}

                  {/* PRICE */}

                  <div
                    className="
                      mt-1.5
                      flex
                      flex-wrap
                      items-center
                      gap-x-2
                      gap-y-0.5
                    "
                  >
                    {/* SELLING PRICE */}

                    <span
                      className="
                        text-base
                        font-bold
                        leading-5
                        text-gray-900
                        sm:text-lg
                      "
                    >
                      ₹
                      {sellingPrice.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    {/* MRP */}

                    {mrp > sellingPrice && (
                      <span
                        className="
                          text-[11px]
                          text-gray-400
                          line-through
                          sm:text-xs
                        "
                      >
                        ₹
                        {mrp.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    )}

                    {/* DISCOUNT */}

                    {discountPercentage > 0 && (
                      <span
                        className="
                          text-[10px]
                          font-bold
                          text-emerald-600
                          sm:text-[11px]
                        "
                      >
                        {discountPercentage}% OFF
                      </span>
                    )}
                  </div>
                </button>
              </div>

              {/* ================================================= */}
              {/* CART ACTION */}
              {/* ================================================= */}

              <div
                className="
                  mt-2.5
                  w-full

                  sm:mt-0
                  sm:flex
                  sm:justify-end
                "
              >
                {isInCart ? (
                  /* =================================================
                   * QUANTITY CONTROLS
                   * ================================================= */

                  <div
                    className="
                      ml-auto
                      flex
                      h-10
                      w-[150px]
                      overflow-hidden
                      rounded-lg
                      border
                      border-gray-300
                      bg-white

                      sm:ml-0
                      sm:w-auto
                    "
                  >
                    {/* MINUS */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDecrement(
                          variant
                        )
                      }
                      disabled={
                        isCartActionLoading
                      }
                      aria-label={`Decrease ${variant.name} quantity`}
                      className="
                        flex
                        h-full
                        flex-1
                        items-center
                        justify-center
                        border-r
                        border-gray-200
                        text-gray-700
                        transition-colors
                        hover:bg-gray-50
                        active:bg-gray-100
                        disabled:cursor-not-allowed
                        disabled:opacity-50

                        sm:w-11
                        sm:flex-none
                      "
                    >
                      {isCartActionLoading ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Minus size={17} />
                      )}
                    </button>

                    {/* QUANTITY */}

                    <div
                      className="
                        flex
                        h-full
                        min-w-14
                        flex-1
                        items-center
                        justify-center
                        px-3
                        text-sm
                        font-semibold
                        tabular-nums
                        text-gray-900

                        sm:flex-none
                      "
                    >
                      {isCartActionLoading ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        quantity
                      )}
                    </div>

                    {/* PLUS */}

                    <button
                      type="button"
                      onClick={() =>
                        handleIncrement(
                          variant
                        )
                      }
                      disabled={
                        isCartActionLoading ||
                        quantity >=
                          (variant.stock?.quantity ??
                            0)
                      }
                      aria-label={`Increase ${variant.name} quantity`}
                      className="
                        flex
                        h-full
                        flex-1
                        items-center
                        justify-center
                        border-l
                        border-gray-200
                        text-gray-700
                        transition-colors
                        hover:bg-gray-50
                        active:bg-gray-100
                        disabled:cursor-not-allowed
                        disabled:opacity-50

                        sm:w-11
                        sm:flex-none
                      "
                    >
                      <Plus size={17} />
                    </button>
                  </div>
                ) : (
                  /* =================================================
                   * ADD TO CART / OUT OF STOCK
                   * ================================================= */

                  <button
                    type="button"
                    onClick={() =>
                      handleAddToCart(
                        variant
                      )
                    }
                    disabled={
                      !isInStock ||
                      isCartActionLoading
                    }
                    className={`
  ml-auto
  flex
  h-10
  w-[150px]
  items-center
  justify-center
  gap-1.5
  rounded-lg
  border
  px-3
  text-xs
  font-semibold
  transition-all
  duration-200
  active:scale-[0.98]

  sm:ml-0
  sm:w-auto
  sm:min-w-[145px]

  ${
    isInStock
      ? `
          border-teal-600
          bg-teal-600
          text-white
          hover:bg-teal-700
          hover:border-teal-700
        `
      : `
          cursor-not-allowed
          border-orange-300
          bg-orange-50
          text-orange-600
        `
  }
`}
                  >
                    {isCartActionLoading ? (
                      <>
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />

                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart
                          size={16}
                        />

                        {isInStock
                          ? "Add To Cart"
                          : "Out Of Stock"}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}