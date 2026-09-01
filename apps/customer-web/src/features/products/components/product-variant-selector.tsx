"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  Loader2,
  Minus,
  Banknote,
  Plus,
  ReceiptText,
  RotateCcw,
  ShoppingCart,
  Truck,
  MessageSquare,
} from "lucide-react";

import {
  Product,
  ProductVariant,
} from "@/features/products/types/product.type";

import {
  OutOfStockNotificationDialog,
} from "@/features/products/components/out-of-stock-notification-dialog";

import { useAddToCart } from "@/features/cart/hooks/use-add-to-cart";
import { useCart } from "@/features/cart/hooks/use-cart";
import { useUpdateCartItem } from "@/features/cart/hooks/use-update-cart-item";
import { useRemoveCartItem } from "@/features/cart/hooks/use-remove-cart-item";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { MAX_CART_ITEM_QUANTITY } from "@/features/bulk-order/constants/bulk-order.constants";
import { openBulkOrderModal } from "@/features/bulk-order/store/bulk-order-modal.store";

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
  const [loadingVariantId, setLoadingVariantId] =
  useState<string | null>(null);
  const [
    isNotificationDialogOpen,
    setIsNotificationDialogOpen,
  ] = useState(false);
  const [
    notificationVariant,
    setNotificationVariant,
  ] = useState<ProductVariant | null>(null);
  const variantRefs = useRef<
    Record<string, HTMLDivElement | null>
  >({});
  const expectedDeliveryDate = new Date();
expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 3);

const deliveryDate = expectedDeliveryDate.toLocaleDateString(
  "en-GB",
  {
    day: "2-digit",
    month: "short",
  }
);

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
   * EMPTY STATE
   * ================================================================
   */

  if (!variants?.length) {
    return null;
  }
const handleVariantSelect = (
  variant: ProductVariant
) => {
  onChange(variant.id);

  requestAnimationFrame(() => {
    const selectedElement =
      variantRefs.current[variant.id];

    if (!selectedElement) {
      return;
    }

    const rect =
      selectedElement.getBoundingClientRect();

    const viewportHeight =
      window.innerHeight;

    /*
     * Keep a safe area at the top for the sticky header.
     * Responsive so mobile and desktop both behave correctly.
     */
    const isMobile = window.innerWidth < 768;
const topSafeArea = isMobile ? 75 : 140;
    const bottomSafeArea = 24;

    /*
     * Already completely visible:
     * do nothing.
     */
    if (
      rect.top >= topSafeArea &&
      rect.bottom <=
        viewportHeight - bottomSafeArea
    ) {
      return;
    }

    /*
     * Variant is hidden/covered above.
     * Move only enough to bring it below the header.
     */
    if (rect.top < topSafeArea) {
      window.scrollBy({
        top: rect.top - topSafeArea,
        behavior: "smooth",
      });

      return;
    }

    /*
     * Variant is partially/fully below the viewport.
     * Move only enough to show the complete variant.
     */
    if (
      rect.bottom >
      viewportHeight - bottomSafeArea
    ) {
      window.scrollBy({
        top:
          rect.bottom -
          (viewportHeight - bottomSafeArea),
        behavior: "smooth",
      });
    }
  });
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
    typeof variant?.stock === "number"
      ? variant.stock
      : variant?.stock?.quantity ?? 0;

  const isInStock =
    stockQuantity > 0;

  if (!isInStock) {
    return;
  }

  const existingCartItem = cartData?.cartItems?.find(
    (item) => item.variantId === variant.id
  );
  const existingQuantity = existingCartItem?.variant?.quantity ?? 0;

  if (existingQuantity >= MAX_CART_ITEM_QUANTITY) {
    openBulkOrderModal({
      productName: product.name,
      variantName: variant.name,
      attributes: Object.entries(variant.attributes || {}),
      productId: product.id,
      variantId: variant.id,
      sellingPrice: variant.pricing?.sellingPrice,
      image: variant.images?.main || variant.images?.gallery?.[0] || product.images?.main,
      productSlug: product.slug,
      requestedQuantity: 10,
    });
    return;
  }

  setLoadingVariantId(variant.id);

  addToCart(
    {
      productId: product.id,
      variantId: variant.id,
      quantity: 1,
      product,
    },
    {
      onSettled: () => {
        setLoadingVariantId(null);
      },
    },
  );

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

    // Check bulk order limit
    if (currentQuantity >= MAX_CART_ITEM_QUANTITY) {
      openBulkOrderModal({
        productName: product.name,
        variantName: variant.name,
        attributes: Object.entries(variant.attributes || {}),
        productId: product.id,
        variantId: variant.id,
        sellingPrice: variant.pricing?.sellingPrice,
        image: variant.images?.main || variant.images?.gallery?.[0] || product.images?.main,
        productSlug: product.slug,
        requestedQuantity: 10,
      });
      return;
    }

    // Do not allow quantity above available stock
    if (currentQuantity >= stockQuantity) {
      return;
    }

    setLoadingVariantId(variant.id);

    updateCart(
      {
        productId: cartItem.productId,
        variantId: variant.id,
        cartItemId: isAuthenticated
          ? cartItem.id
          : undefined,
        quantity: currentQuantity + 1,
      },
      {
        onSettled: () => {
          setLoadingVariantId(null);
        },
      }
    );
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

    setLoadingVariantId(variant.id);

    /*
     * Quantity 1 → Remove from cart
     */

    if (currentQuantity <= 1) {
      removeCartItem(
        {
          productId: cartItem.productId,
          variantId: variant.id,
          cartItemId: isAuthenticated
            ? cartItem.id
            : undefined,
        },
        {
          onSettled: () => {
            setLoadingVariantId(null);
          },
        }
      );

      return;
    }

    /*
     * Quantity > 1 → Decrease
     */

    updateCart(
      {
        productId: cartItem.productId,
        variantId: variant.id,
        cartItemId: isAuthenticated
          ? cartItem.id
          : undefined,
        quantity: currentQuantity - 1,
      },
      {
        onSettled: () => {
          setLoadingVariantId(null);
        },
      }
    );
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
  className="
    flex
    flex-col
    gap-2
    py-1
    pr-0.5

    sm:gap-2.5
  "
>
        {variants.map((variant) => {
          const isSelected =
            selectedVariantId === variant.id;

          const stockQuantity =
            typeof variant?.stock === "number"
              ? variant.stock
              : variant?.stock?.quantity ?? 0;

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
           * LOADING (PER-VARIANT)
           * --------------------------------------------------------
           */

          const isThisVariantLoading =
            loadingVariantId === variant.id;

          return (
          <div
  key={variant.id}
  ref={(element) => {
    variantRefs.current[variant.id] = element;
  }}
  onClick={() => handleVariantSelect(variant)}
  className={`
    w-full
    cursor-pointer
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
    min-w-0
    flex-1

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

    sm:flex-nowrap
    sm:whitespace-nowrap
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
                          text-gray-700
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

{/* INCLUSIVE GST */}

<span
  className="
    text-[9px]
    font-medium
    text-gray-500
    sm:text-[10px]
  "
>
  (Inclusive GST)
</span>
                  </div>
                  {/* DELIVERY / RETURN INFO */}

<div className="mt-1 whitespace-nowrap text-[9px] font-medium sm:text-[11px]">
  <span className="hidden items-center gap-3 sm:flex">
       {/* TAXES */}
    {/* COD AVAILABLE */}
<span className="inline-flex items-center gap-1 text-teal-600">
  <Banknote
    className="h-3 w-3 text-amber-400"
    strokeWidth={2.2}
  />

  <span>COD Available</span>
</span>

    {/* DELIVERY */}
    <span className="inline-flex items-center gap-1 text-teal-600">
      <Truck className="h-3 w-3 text-amber-400" strokeWidth={2.2} />
      <span>
        Dispatch within{" "}
        <span className="font-semibold text-teal-600">
          1-3 Days
        </span>
      </span>
    </span>
  </span>
</div>
                </button>
              </div>

              {/* ================================================= */}
              {/* CART ACTION */}
              {/* ================================================= */}

              <div
                className="
                  mt-2.5
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-2

                  sm:mt-0
                  sm:flex
                  sm:justify-end
                "
              >
              {/* MOBILE DELIVERY / RETURN INFO */}
<div className="min-w-0 flex-1 sm:hidden">
  <div className="flex min-w-0 flex-nowrap items-center gap-1 text-[9px] font-medium leading-3 whitespace-nowrap">
    {/* COD AVAILABLE */}
    <span className="inline-flex shrink-0 items-center gap-1 text-teal-600">
      <Banknote
        className="h-3 w-3 shrink-0 text-amber-400"
        strokeWidth={2.2}
      />

      <span className="whitespace-nowrap">
        COD Available
      </span>
    </span>

    {/* DELIVERY */}
    <span className="inline-flex min-w-0 shrink items-center gap-1 text-teal-600">
      <Truck
        className="h-3 w-3 shrink-0 text-amber-400"
        strokeWidth={2.2}
      />

      <span className="whitespace-nowrap">
        Within{" "}
        <span className="font-semibold">
          1-3 Days
        </span>
      </span>
    </span>
  </div>
</div>
                {isInCart ? (
                  /* =================================================
                   * QUANTITY CONTROLS
                   * ================================================= */

                  <div className="flex items-center gap-2 ml-auto sm:ml-0">
                    <div
                      className="
                        flex
                        h-10
                        w-[120px]
                        overflow-hidden
                        rounded-lg
                        border
                        border-gray-300
                        bg-white

                        sm:w-auto
                      "
                    >
                      {/* MINUS */}

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDecrement(variant);
                        }}
                        disabled={
                          isThisVariantLoading
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
                        {isThisVariantLoading ? (
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
                        {isThisVariantLoading ? (
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
                        onClick={(event) => {
                          event.stopPropagation();
                          handleIncrement(variant);
                        }}
                        disabled={
                          isThisVariantLoading ||
                          (quantity >= (variant.stock?.quantity ?? 0) && quantity < MAX_CART_ITEM_QUANTITY)
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

                    {quantity >= MAX_CART_ITEM_QUANTITY && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openBulkOrderModal({
                            productName: product.name,
                            variantName: variant.name,
                            attributes: Object.entries(variant.attributes || {}),
                            productId: product.id,
                            variantId: variant.id,
                            sellingPrice: variant.pricing?.sellingPrice,
                            image: variant.images?.main || variant.images?.gallery?.[0] || product.images?.main,
                            productSlug: product.slug,
                            requestedQuantity: 10,
                          });
                        }}
                        className="
  hidden
  sm:flex
  items-center
  gap-1
  rounded-lg
  bg-emerald-50
  px-2.5
  py-1.5
  text-[11px]
  font-bold
  text-emerald-700
  border
  border-emerald-200
  hover:bg-emerald-100
  active:scale-95
  transition
"
                      >
                        <MessageSquare size={12} className="text-emerald-600" />
                        <span>Bulk (6+)</span>
                      </button>
                    )}
                  </div>
                ) : isInStock ? (
                  /* =================================================
                   * ADD TO CART
                   * ================================================= */

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleAddToCart(variant);
                    }}
                    disabled={isThisVariantLoading}
                    className="
                      ml-auto
                      flex
                      h-10
                      w-[120px]
                      shrink-0
                      items-center
                      justify-center
                      gap-1.5
                      rounded-lg
                      border
                      border-teal-600
                      bg-teal-600
                      px-3
                      text-xs
                      font-semibold
                      text-white
                      transition-all
                      duration-200
                      hover:border-teal-700
                      hover:bg-teal-700
                      active:scale-[0.98]
                      sm:ml-0
                      sm:w-auto
                      sm:min-w-[145px]
                      sm:w-[150px]
                    "
                  >
                    {isThisVariantLoading ? (
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
                        Add To Cart
                      </>
                    )}
                  </button>
                ) : (
                  /* =================================================
                   * NOTIFY ME (OUT OF STOCK)
                   * ================================================= */

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setNotificationVariant(variant);
                      setIsNotificationDialogOpen(true);
                    }}
                    className="
                      ml-auto
                      flex
                      h-10
                      w-[120px]
                      shrink-0
                      items-center
                      justify-center
                      gap-1.5
                      rounded-lg
                      border
                      border-orange-200
                      bg-orange-50
                      px-3
                      text-xs
                      font-semibold
                      text-orange-600
                      transition-all
                      duration-200
                      hover:border-orange-300
                      hover:bg-orange-100
                      active:scale-[0.98]
                      sm:ml-0
                      sm:w-auto
                      sm:min-w-[145px]
                      sm:w-[150px]
                    "
                  >
                    <Bell size={15} />
                    NOTIFY ME
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <OutOfStockNotificationDialog
        open={isNotificationDialogOpen}
        onClose={() => {
          setIsNotificationDialogOpen(false);
          setNotificationVariant(null);
        }}
        productName={product.name}
        productId={product.id}
        variantId={notificationVariant?.id}
        variantName={notificationVariant?.name}
      />
    </div>
  );
}