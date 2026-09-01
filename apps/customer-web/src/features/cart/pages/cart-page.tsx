"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Home,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/features/cart/hooks/use-cart";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /*
   |--------------------------------------------------------------------------
   | API
   |--------------------------------------------------------------------------
   */
  const { data, isLoading, isError, refetch } = useCart();

  /*
   |--------------------------------------------------------------------------
   | CART
   |--------------------------------------------------------------------------
   */
  const cart = data;

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
        <div className="mx-auto max-w-7xl px-3 py-6 md:px-4 md:py-8 lg:px-6">
          <div className="animate-pulse">
            {/* HEADER */}
            <div className="mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-gray-200" />
              <div className="space-y-2 md:space-y-3">
                <div className="h-5 md:h-6 w-40 md:w-52 rounded bg-gray-200" />
                <div className="h-3 md:h-4 w-24 md:w-32 rounded bg-gray-200" />
              </div>
            </div>

            {/* CONTENT */}
            <div className="grid gap-6 md:gap-8 lg:grid-cols-[1fr_380px]">
              {/* ITEMS */}
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-36 md:h-44 rounded-xl md:rounded-2xl border border-gray-100 bg-white"
                  />
                ))}
              </div>

              {/* SUMMARY */}
              <div className="h-[380px] md:h-[420px] rounded-xl md:rounded-2xl border border-gray-100 bg-white" />
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
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-5 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-red-50">
          <ShoppingCart className="h-8 w-8 md:h-[34px] md:w-[34px] text-red-500" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Cart Loading ...
        </h2>
        <p className="mt-2 text-xs md:text-sm text-gray-500">
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
  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="bg-[#F8FAFC]">
      {/* pb-28 added for mobile to ensure content isn't hidden behind sticky bottom bar */}
      <div className="mx-auto max-w-7xl px-3 py-4 pb-28 md:px-4 md:py-8 lg:px-6 lg:py-5 lg:pb-8">

  {/* ====================================================== */}
  {/* BREADCRUMBS */}
  {/* ====================================================== */}

  <div className="mb-4 flex items-center gap-2 text-sm">
    <Link
      href="/"
      className="
        inline-flex
        items-center
        gap-1.5
        font-medium
        text-slate-500
        transition-colors
        hover:text-teal-600
      "
    >
      <Home className="h-4 w-4" />
      Home
    </Link>

    <ChevronRight
      className="h-4 w-4 text-slate-300"
      strokeWidth={2}
    />

    <span className="font-semibold text-teal-600">
      Cart
    </span>
  </div>



        {/* ====================================================== */}
        {/* HEADER */}
        {/* ====================================================== */}

        <div
          className="
            mb-6 md:mb-8
            flex flex-col gap-4 md:gap-5
            md:flex-row md:items-center md:justify-between
          "
        >
          {/* LEFT */}
          <div className="flex items-center gap-3 md:gap-4">
            <div
              className="
                flex h-12 w-12 md:h-14 md:w-14
                items-center justify-center
                rounded-xl md:rounded-2xl
                bg-teal-600 text-white
              "
            >
              <ShoppingCart size={22} className="md:w-[26px] md:h-[26px]" />
            </div>

            <div>
              <h1
  className="
    animate-text-shine
    bg-gradient-to-r from-[#001f3f] via-[#0d9488] to-[#001f3f]
    bg-clip-text
    text-xl md:text-[28px]
    font-bold
    leading-[1.25]
    text-transparent
  "
>
  Shopping Cart
</h1>

              <p className="mt-0.5 md:mt-1 text-xs md:text-sm text-gray-500">
                {cart.totalQuantity} items added to your cart
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-wrap gap-2 md:gap-3">
           {/* PAYMENT */}
            <div
              className="
                flex flex-1 md:flex-none items-center justify-center gap-1.5 md:gap-2
                rounded-lg md:rounded-xl
                border border-green-100 bg-green-50
                px-3 py-2 md:px-4 md:py-3
              "
            >
              <ShieldCheck size={14} className="text-green-600 md:w-[18px] md:h-[18px]" />
              <span className="text-[11px] md:text-sm font-medium text-green-900">
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
            grid items-start gap-6 md:gap-8
            lg:grid-cols-[1fr_380px]
          "
        >
          {/* ====================================================== */}
          {/* CART ITEMS */}
          {/* ====================================================== */}

          <div className="space-y-3 md:space-y-4">
            {cart.cartItems.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* ====================================================== */}
          {/* SUMMARY */}
          {/* ====================================================== */}

          <div className="lg:sticky lg:top-6">
            <CartSummary cart={cart} />
          </div>
        </div>
      </div>
    </div>
  );
}