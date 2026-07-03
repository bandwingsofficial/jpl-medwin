"use client";

import Image from "next/image";
import Link from "next/link";

import { Trash2 } from "lucide-react";

import { CartItem } from "@/features/cart/types/cart.type";

import { QuantitySelector } from "@/features/cart/components/quantity-selector";

import { useUpdateCartItem } from "@/features/cart/hooks/use-update-cart-item";
import { useRemoveCartItem } from "@/features/cart/hooks/use-remove-cart-item";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({
  item,
}: CartItemCardProps) {
  /*
   |--------------------------------------------------------------------------
   | HOOKS
   |--------------------------------------------------------------------------
   */

  const {
    mutate: updateQuantity,
    isPending:
      isUpdatingQuantity,
  } = useUpdateCartItem();

  const {
    mutate: removeItem,
    isPending:
      isRemovingItem,
  } = useRemoveCartItem();

  /*
   |--------------------------------------------------------------------------
   | HANDLERS
   |--------------------------------------------------------------------------
   */

  const handleQuantityChange = (
    quantity: number
  ) => {
    updateQuantity({
      cartItemId: item.id,

      quantity,
    });
  };

  const handleRemoveItem = () => {
    removeItem(item.id);
  };

  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-4
        shadow-sm
      "
    >
      <div className="flex gap-4">
        {/* ====================================================== */}
        {/* IMAGE */}
        {/* ====================================================== */}

        <Link
          href={`/products/${item.productId}`}
          className="
            relative
            h-28
            w-28
            shrink-0
            overflow-hidden
            rounded-xl
            border
            border-gray-100
            bg-white
          "
        >
          <Image
            src={
              item.variant.images
                ?.main ||
              "/images/product-placeholder.png"
            }
            alt={item.productName}
            fill
            className="object-contain p-2"
          />
        </Link>

        {/* ====================================================== */}
        {/* CONTENT */}
        {/* ====================================================== */}

        <div className="flex min-w-0 flex-1 flex-col">
          {/* TOP */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {/* BRAND */}
              <p
                className="
                  mb-1
                  text-xs
                  font-medium
                  uppercase
                  tracking-wide
                  text-gray-500
                "
              >
                {item.brandName}
              </p>

              {/* TITLE */}
              <Link
                href={`/products/${item.productId}`}
              >
                <h3
                  className="
                    line-clamp-2
                    text-sm
                    font-semibold
                    leading-6
                    text-gray-900
                    transition
                    hover:text-black
                  "
                >
                  {item.productName}-{item.variant.name}
                </h3>
              </Link>
            </div>

            {/* REMOVE */}
            <button
              type="button"
              onClick={
                handleRemoveItem
              }
              disabled={
                isRemovingItem
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-gray-200
                text-gray-500
                transition
                hover:bg-red-50
                hover:text-red-500
              "
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* BOTTOM */}
          <div
            className="
              mt-5
              flex
              flex-wrap
              items-center
              justify-between
              gap-4
            "
          >
            {/* PRICE */}
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="
                    text-xl
                    font-bold
                    text-gray-900
                  "
                >
                  ₹
                  {item.variant.pricing.sellingPrice.toLocaleString()}
                </span>

                <span
                  className="
                    text-sm
                    text-gray-400
                    line-through
                  "
                >
                  ₹
                  {item.variant.pricing.mrp.toLocaleString()}
                </span>
              </div>

              <p
                className="
                  mt-1
                  text-xs
                  text-green-600
                "
              >
                You save ₹
                {(
                  item.variant.pricing
                    .mrp -
                  item.variant.pricing
                    .sellingPrice
                ).toLocaleString()}
              </p>
            </div>

            {/* QUANTITY */}
            <QuantitySelector
              value={
                item.variant.quantity
              }
              max={
                item.variant.stock
                  .available
              }
              disabled={
                isUpdatingQuantity
              }
              onChange={
                handleQuantityChange
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}