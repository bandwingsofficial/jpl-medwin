"use client";

import Link from "next/link";

import { ShoppingCart } from "lucide-react";

export function EmptyCart() {
  return (
    <div
      className="
        flex
        min-h-[70vh]
        flex-col
        items-center
        justify-center
        px-4
        text-center
      "
    >
      <div
        className="
          mb-6
          flex
          h-24
          w-24
          items-center
          justify-center
          rounded-full
          bg-gray-100
        "
      >
        <ShoppingCart
          size={40}
          className="text-gray-400"
        />
      </div>

      <h2 className="text-3xl font-bold text-gray-900">
        Your cart is empty
      </h2>

      <p className="mt-3 max-w-md text-sm text-gray-500">
        Looks like you have not added
        any products to your cart yet.
      </p>

      <Link
        href="/products"
        className="
          mt-8
          inline-flex
          h-12
          items-center
          justify-center
          rounded-xl
          bg-teal-600
          px-8
          text-sm
          font-semibold
          text-white
          transition-all
          duration-200
          hover:bg-teal-800
        "
      >
        Continue Shopping
      </Link>
    </div>
  );
}