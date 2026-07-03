"use client";

import { useRouter } from "next/navigation";

import { Cart } from "@/features/cart/types/cart.type";

import { useAuth } from "@/features/auth/hooks/use-auth";

import CartCoupon from "./cart-coupon";

import { showError } from "@/shared/store/toast.store";

import { useRemoveCoupon } from "@/features/cart/hooks/use-remove-coupon";
import { X, Trash2 } from "lucide-react";

interface CartSummaryProps {
  cart: Cart;
}

export function CartSummary({
  cart,
}: CartSummaryProps) {
  /*
   |--------------------------------------------------------------------------
   | ROUTER
   |--------------------------------------------------------------------------
   */

  const router = useRouter();

  /*
   |--------------------------------------------------------------------------
   | AUTH
   |--------------------------------------------------------------------------
   */

  const { isAuthenticated } =
    useAuth();

  /*
   |--------------------------------------------------------------------------
   | REMOVE COUPON
   |--------------------------------------------------------------------------
   */

  const { removeCoupon, isPending } =
    useRemoveCoupon();

  /*
   |--------------------------------------------------------------------------
   | SUMMARY
   |--------------------------------------------------------------------------
   */

  const summary =
    cart.summary;

  /*
   |--------------------------------------------------------------------------
   | COUPON
   |--------------------------------------------------------------------------
   */

  const appliedCoupon =
    cart.appliedCoupon;

  /*
   |--------------------------------------------------------------------------
   | CALCULATIONS
   |--------------------------------------------------------------------------
   */

  const couponDiscount =
    summary.couponDiscount || 0;

  /*
   |--------------------------------------------------------------------------
   | HANDLERS
   |--------------------------------------------------------------------------
   */

  const handleCheckout = () => {
    /*
     |--------------------------------------------------------------------------
     | LOGIN CHECK
     |--------------------------------------------------------------------------
     */

    if (!isAuthenticated) {
      showError(
        "Please login first to continue checkout."
      );

      router.push("/login");

      return;
    }

    /*
     |--------------------------------------------------------------------------
     | EMPTY CART CHECK
     |--------------------------------------------------------------------------
     */

    if (
      !cart.cartItems?.length
    ) {
      showError(
        "Your cart is empty."
      );

      return;
    }

    /*
     |--------------------------------------------------------------------------
     | NAVIGATE
     |--------------------------------------------------------------------------
     */

    router.push("/checkout");
  };

  /*
   |--------------------------------------------------------------------------
   | REMOVE COUPON HANDLER
   |--------------------------------------------------------------------------
   */

  const handleRemoveCoupon =
    async () => {
      await removeCoupon();
    };

  return (
    <div className="space-y-5">
      {/* ====================================================== */}
      {/* COUPON */}
      {/* ====================================================== */}

      <CartCoupon
        appliedCoupon={
          appliedCoupon
        }
      />

      {/* ====================================================== */}
      {/* ORDER SUMMARY */}
      {/* ====================================================== */}

      <div
        className="
          sticky
          top-6
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-6
          shadow-sm
        "
      >
        {/* ====================================================== */}
        {/* HEADER */}
        {/* ====================================================== */}

        <h2
          className="
            mb-6
            text-2xl
            font-bold
            text-gray-900
          "
        >
          Order Summary
        </h2>

        {/* ====================================================== */}
        {/* SUMMARY DETAILS */}
        {/* ====================================================== */}

        <div className="space-y-4">
          {/* SUBTOTAL */}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Subtotal
            </span>

            <span className="text-sm font-medium">
              ₹
              {summary.subtotal.toLocaleString()}
            </span>
          </div>

          {/* PRODUCT DISCOUNT */}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Product Discount
            </span>

            <span
              className="
                text-sm
                font-medium
                text-green-600
              "
            >
              - ₹
              {summary.productDiscount.toLocaleString()}
            </span>
          </div>

         {/* COUPON DISCOUNT */}

{couponDiscount > 0 && (
  <div className="flex items-center justify-between">
    <div>
      <span className="text-sm text-gray-600">
        Coupon Discount
      </span>

      <div className="mt-2 flex items-center gap-2">
        <p
          className="
            text-xs
            font-medium
            text-purple-600
          "
        >
          Coupon Applied
        </p>

        <button
  type="button"
  onClick={handleRemoveCoupon}
  disabled={isPending}
  aria-label="Remove coupon"
  className="
    flex
    h-6
    w-6
    items-center
    justify-center
    rounded-full
    text-red-500
    transition-colors
    duration-200
    hover:bg-red-50
    hover:text-red-600
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
>
  <Trash2  className="h-4 w-4" />
</button>
      </div>
    </div>

    <span
      className="
        text-sm
        font-semibold
        text-emerald-600
      "
    >
      - ₹
      {couponDiscount.toLocaleString()}
    </span>
  </div>
)}

          {/* SHIPPING */}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Shipping
            </span>

            <span className="text-sm font-medium">
              {summary.shipping === 0
                ? "Free"
                : `₹${summary.shipping}`}
            </span>
          </div>

          {/* TAX */}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Tax
            </span>

            <span className="text-sm font-medium">
              ₹
              {summary.tax.toLocaleString()}
            </span>
          </div>

          {/* ====================================================== */}
          {/* TOTAL */}
          {/* ====================================================== */}

          <div className="border-t border-dashed pt-5">
            <div className="flex items-center justify-between">
              <span
                className="
                  text-lg
                  font-bold
                  text-gray-900
                "
              >
                Total
              </span>

              <span
                className="
                  text-3xl
                  font-bold
                  text-gray-900
                "
              >
                ₹
                {summary.grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* ====================================================== */}
          {/* SAVINGS */}
          {/* ====================================================== */}

          <div
            className="
              rounded-xl
              border
              border-green-100
              bg-green-50
              p-4
            "
          >
            <p
              className="
                text-sm
                font-semibold
                text-green-700
              "
            >
              You saved ₹
              {summary.savings.toLocaleString()}
            </p>

            {couponDiscount > 0 && (
              <p
                className="
                  mt-1
                  text-xs
                  text-green-600
                "
              >
                Includes coupon savings
              </p>
            )}
          </div>

          {/* ====================================================== */}
          {/* CHECKOUT BUTTON */}
          {/* ====================================================== */}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={
              !cart.cartItems?.length
            }
            className="
              mt-5
              flex
              h-14
              w-full
              items-center
              justify-center
              rounded-2xl
              bg-teal-600
              text-sm
              font-semibold
              text-white
              transition-all
              duration-200
              hover:bg-teal-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Proceed To Checkout
          </button>
        </div>
      </div>
    </div>
  );
}