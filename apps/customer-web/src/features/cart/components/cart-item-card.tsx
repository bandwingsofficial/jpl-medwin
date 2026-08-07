"use client";

import Image from "next/image";
import Link from "next/link";

import { Trash2 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { CartItem } from "@/features/cart/types/cart.type";

import { QuantitySelector } from "@/features/cart/components/quantity-selector";

import { useUpdateCartItem } from "@/features/cart/hooks/use-update-cart-item";
import { useRemoveCartItem } from "@/features/cart/hooks/use-remove-cart-item";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  /*
   |--------------------------------------------------------------------------
   | HOOKS
   |--------------------------------------------------------------------------
   */

  const { mutate: updateQuantity, isPending: isUpdatingQuantity } =
    useUpdateCartItem();

  const { mutate: removeItem, isPending: isRemovingItem } =
    useRemoveCartItem();

  const { isAuthenticated } = useAuth();

  /*
   |--------------------------------------------------------------------------
   | HANDLERS
   |--------------------------------------------------------------------------
   */

  const handleQuantityChange = (quantity: number) => {
    updateQuantity({
      cartItemId: isAuthenticated ? item.id : item.productId,
      quantity,
    });
  };

  const handleRemoveItem = () => {
    removeItem(isAuthenticated ? item.id : item.productId);
  };

  return (
    <div
      className="
        rounded-xl
        border
        border-gray-200
        bg-white
        p-3
        shadow-sm
        sm:rounded-2xl
        sm:p-4
      "
    >
      <div className="flex gap-3 sm:gap-4">
        {/* ====================================================== */}
        {/* IMAGE */}
        {/* ====================================================== */}

        <Link
          href={`/products/${item.productId}`}
          className="
            relative
            h-20
            w-20
            shrink-0
            overflow-hidden
            rounded-lg
            border
            border-gray-100
            bg-white
            sm:h-28
            sm:w-28
            sm:rounded-xl
          "
        >
          <Image
            src={
              item.variant.images?.main ||
              "/images/product-placeholder.png"
            }
            alt={item.productName}
            fill
            className="object-contain p-1.5 sm:p-2"
          />
        </Link>

        {/* ====================================================== */}
        {/* CONTENT */}
        {/* ====================================================== */}

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          {/* TOP */}
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            <div className="min-w-0">
              {/* BRAND */}
              <p
                className="
                  mb-0.5
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-wide
                  text-gray-500
                  sm:mb-1
                  sm:text-xs
                "
              >
                {item.brandName}
              </p>

              {/* TITLE */}
              <Link href={`/products/${item.productId}`}>
                <h3
                  className="
                    line-clamp-2
                    text-xs
                    font-semibold
                    leading-4
                    text-gray-900
                    transition
                    hover:text-black
                    sm:text-sm
                    sm:leading-6
                  "
                >
                  {item.productName}-{item.variant.name}
                </h3>
              </Link>
            </div>

            {/* REMOVE */}
            <button
              type="button"
              onClick={handleRemoveItem}
              disabled={isRemovingItem}
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-gray-200
                text-gray-500
                transition
                hover:bg-red-50
                hover:text-red-500
                sm:h-10
                sm:w-10
                sm:rounded-xl
              "
            >
              <Trash2 className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
            </button>
          </div>

          {/* BOTTOM */}
          <div
            className="
              mt-3
              flex
              flex-wrap
              items-end
              justify-between
              gap-2
              sm:mt-5
              sm:items-center
              sm:gap-4
            "
          >
            {/* PRICE */}
            <div>
              <div className="flex items-baseline gap-1.5 sm:items-center sm:gap-2">
                <span
                  className="
                    text-base
                    font-bold
                    text-gray-900
                    sm:text-xl
                  "
                >
                  ₹{item.variant.pricing.sellingPrice.toLocaleString()}
                </span>

                <span
                  className="
                    text-xs
                    text-gray-400
                    line-through
                    sm:text-sm
                  "
                >
                  ₹{item.variant.pricing.mrp.toLocaleString()}
                </span>
              </div>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  font-medium
                  text-green-600
                  sm:mt-1
                  sm:text-xs
                "
              >
                You save ₹
                {(
                  item.variant.pricing.mrp -
                  item.variant.pricing.sellingPrice
                ).toLocaleString()}
              </p>
            </div>

            {/* QUANTITY */}
            <QuantitySelector
              value={item.variant.quantity}
              max={999999}
              disabled={isUpdatingQuantity}
              onChange={handleQuantityChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}