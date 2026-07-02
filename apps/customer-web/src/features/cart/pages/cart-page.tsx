"use client";

import Link from "next/link";

import {
  ArrowLeft,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useCart } from "@/features/cart/hooks/use-cart";

import { cartApi } from "@/features/cart/api/cart.api";

import { CartItemCard } from "@/features/cart/components/cart-item-card";

import { CartSummary } from "@/features/cart/components/cart-summary";

import { EmptyCart } from "@/features/cart/components/empty-cart";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function CartPage() {
  /*
   |--------------------------------------------------------------------------
   | HYDRATION SAFE
   |--------------------------------------------------------------------------
   */
  const [mounted, setMounted] =
    useState(false);

  /*
   |--------------------------------------------------------------------------
   | PREVENT MULTIPLE UNLOCKS
   |--------------------------------------------------------------------------
   */
 

  useEffect(() => {
    setMounted(true);
  }, []);

  /*
   |--------------------------------------------------------------------------
   | API
   |--------------------------------------------------------------------------
   */
  const {
  data,
  isLoading,
  isError,
  refetch,
} = useCart();
/*
|--------------------------------------------------------------------------
| CART
|--------------------------------------------------------------------------
*/
const cart = data;
  /*
   |--------------------------------------------------------------------------
   | AUTO UNLOCK CART
   |--------------------------------------------------------------------------
   |
   | IMPORTANT:
   | When user returns to cart page,
   | unlock cart automatically
   | without deleting checkout session.
   |--------------------------------------------------------------------------
   */

  /*
   |--------------------------------------------------------------------------
   | PREVENT HYDRATION MISMATCH
   |--------------------------------------------------------------------------
   */
  if (!mounted) {
    return null;
  }

  /*
   |--------------------------------------------------------------------------
   | LOADING
   |--------------------------------------------------------------------------
   */
  if (isLoading) {
    return (
      <div className="bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
          <div className="animate-pulse">
            {/* HEADER */}
            <div className="mb-8 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gray-200" />

              <div className="space-y-3">
                <div className="h-6 w-52 rounded bg-gray-200" />

                <div className="h-4 w-32 rounded bg-gray-200" />
              </div>
            </div>

            {/* CONTENT */}
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
              {/* ITEMS */}
              <div className="space-y-4">
                {Array.from({
                  length: 3,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="
                      h-44
                      rounded-2xl
                      border
                      border-gray-100
                      bg-white
                    "
                  />
                ))}
              </div>

              {/* SUMMARY */}
              <div
                className="
                  h-[420px]
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                "
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
   |--------------------------------------------------------------------------
   | ERROR
   |--------------------------------------------------------------------------
   */
  if (isError) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          flex-col
          items-center
          justify-center
          px-4
          text-center
        "
      >
        <div
          className="
            mb-5
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            bg-red-50
          "
        >
          <ShoppingCart
            size={34}
            className="text-red-500"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          Failed to load cart
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Please login to access the cart
        </p>
      </div>
    );
  }

  /*
   |--------------------------------------------------------------------------
   | EMPTY CART
   |--------------------------------------------------------------------------
   */
  if (
    !cart ||
    !cart.cartItems ||
    cart.cartItems.length === 0
  ) {
    return <EmptyCart />;
  }

  return (
    <div className="bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-10">
        {/* ====================================================== */}
        {/* TOP BAR */}
        {/* ====================================================== */}

        <div className="mb-6">
          <Link
            href="/products"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-teal-600
              transition
              hover:text-black
            "
          >
            <ArrowLeft size={16} />

            Continue Shopping
          </Link>
        </div>

        {/* ====================================================== */}
        {/* HEADER */}
        {/* ====================================================== */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-5

            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-teal-600 
                text-white
              "
            >
              <ShoppingCart size={26} />
            </div>

            <div>
              <h1
                className="
            animate-text-shine
            bg-gradient-to-r 
            from-[#001f3f] 
            via-[#0d9488] 
            to-[#001f3f] 
            bg-clip-text 
            text-[28px] 
            font-bold 
            text-transparent
          "
              >
                Shopping Cart
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {cart.totalQuantity} items
                added to your cart
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div
            className="
              flex
              flex-wrap
              gap-3
            "
          >
            {/* DELIVERY */}
            <div
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-blue-100
                bg-blue-50
                px-4
                py-3
              "
            >
              <Truck
                size={18}
                className="text-teal-600"
              />

              <span
                className="
                  text-sm
                  font-medium
                  text-blue-900
                "
              >
                Delivery in 3–7 days
              </span>
            </div>

            {/* PAYMENT */}
            <div
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-green-100
                bg-green-50
                px-4
                py-3
              "
            >
              <ShieldCheck
                size={18}
                className="text-green-600"
              />

              <span
                className="
                  text-sm
                  font-medium
                  text-green-900
                "
              >
                Secure Checkout
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================== */}
        {/* MAIN CONTENT */}
        {/* ====================================================== */}

        <div
          className="
            grid
            items-start
            gap-8

            lg:grid-cols-[1fr_380px]
          "
        >
          {/* ====================================================== */}
          {/* CART ITEMS */}
          {/* ====================================================== */}

          <div className="space-y-4">
            {cart.cartItems.map(
              (item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                />
              )
            )}
          </div>

          {/* ====================================================== */}
          {/* SUMMARY */}
          {/* ====================================================== */}

          <div className="lg:sticky lg:top-6">
            <CartSummary
              cart={cart}
            />
          </div>
        </div>
      </div>
    </div>
  );
}