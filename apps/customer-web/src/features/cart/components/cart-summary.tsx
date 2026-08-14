"use client";

import { useRouter } from "next/navigation";
import { Cart } from "@/features/cart/types/cart.type";
import { useAuth } from "@/features/auth/hooks/use-auth";
import CartCoupon from "./cart-coupon";
import { showError } from "@/shared/store/toast.store";
import { useRemoveCoupon } from "@/features/cart/hooks/use-remove-coupon";
import { X, Trash2 } from "lucide-react";
import { useAuthModal } from "@/shared/context/auth-modal-context";
interface CartSummaryProps {
  cart: Cart;
}

export function CartSummary({ cart }: CartSummaryProps) {
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
  const { isAuthenticated } = useAuth();
const { setLoginOpen } = useAuthModal();

  /*
   |--------------------------------------------------------------------------
   | REMOVE COUPON
   |--------------------------------------------------------------------------
   */
  const { removeCoupon, isPending } = useRemoveCoupon();

  /*
   |--------------------------------------------------------------------------
   | SUMMARY
   |--------------------------------------------------------------------------
   */
  const summary = cart.summary;

  /*
   |--------------------------------------------------------------------------
   | COUPON
   |--------------------------------------------------------------------------
   */
  const appliedCoupon = cart.appliedCoupon;

  /*
   |--------------------------------------------------------------------------
   | CALCULATIONS
   |--------------------------------------------------------------------------
   */
  const couponDiscount = summary.couponDiscount || 0;

  /*
   |--------------------------------------------------------------------------
   | HANDLERS
   |--------------------------------------------------------------------------
   */
  const handleCheckout = () => {
  if (!cart.cartItems?.length) {
    showError("Your cart is empty.");
    return;
  }

  if (!isAuthenticated) {
    sessionStorage.setItem(
      "login_redirect_after_auth",
      "/checkout",
    );

    setLoginOpen(true);
    return;
  }

  router.push("/checkout");
};
  /*
   |--------------------------------------------------------------------------
   | REMOVE COUPON HANDLER
   |--------------------------------------------------------------------------
   */
  const handleRemoveCoupon = async () => {
    await removeCoupon();
  };

  return (
    <div className="space-y-4 md:space-y-5">
      {/* ====================================================== */}
      {/* COUPON */}
      {/* ====================================================== */}

      <CartCoupon appliedCoupon={appliedCoupon} />

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
          p-4
          md:p-6
          shadow-sm
        "
      >
        {/* ====================================================== */}
        {/* HEADER */}
        {/* ====================================================== */}

        <h2
          className="
            mb-4
            md:mb-6
            text-xl
            md:text-2xl
            font-bold
            text-gray-900
          "
        >
          Order Summary
        </h2>

        {/* ====================================================== */}
        {/* SUMMARY DETAILS */}
        {/* ====================================================== */}

        <div className="space-y-3 md:space-y-4">
          {/* SUBTOTAL */}
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-gray-600">Subtotal</span>
            <span className="text-sm font-medium">
              ₹{summary.subtotal.toLocaleString()}
            </span>
          </div>

          {/* PRODUCT DISCOUNT */}
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-gray-600">
              Product Discount
            </span>
            <span className="text-sm font-medium text-green-600">
              - ₹{summary.productDiscount.toLocaleString()}
            </span>
          </div>

          {/* COUPON DISCOUNT */}
          {couponDiscount > 0 && (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs md:text-sm text-gray-600">
                  Coupon Discount
                </span>
                <div className="mt-1 md:mt-2 flex items-center gap-2">
                  <p className="text-[10px] md:text-xs font-medium text-purple-600">
                    Coupon Applied
                  </p>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    disabled={isPending}
                    aria-label="Remove coupon"
                    className="
                      flex h-5 w-5 md:h-6 md:w-6
                      items-center justify-center
                      rounded-full
                      text-red-500
                      transition-colors duration-200
                      hover:bg-red-50 hover:text-red-600
                      disabled:cursor-not-allowed disabled:opacity-50
                    "
                  >
                    <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                  </button>
                </div>
              </div>

              <span className="text-sm font-semibold text-emerald-600">
                - ₹{couponDiscount.toLocaleString()}
              </span>
            </div>
          )}

          {/* SHIPPING */}
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-gray-600">Shipping</span>
            <span className="text-sm font-medium">
              {summary.shipping === 0 ? "Free" : `₹${summary.shipping}`}
            </span>
          </div>

          {/* TAX */}
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-gray-600">Tax</span>
            <span className="text-sm font-medium">
              ₹{summary.tax.toLocaleString()}
            </span>
          </div>

          {/* ====================================================== */}
          {/* TOTAL */}
          {/* ====================================================== */}

          <div className="border-t border-dashed pt-4 md:pt-5">
            <div className="flex items-center justify-between">
              <span className="text-base md:text-lg font-bold text-gray-900">
                Total
              </span>
              <span className="text-2xl md:text-3xl font-bold text-gray-900">
                ₹{summary.grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* ====================================================== */}
          {/* SAVINGS */}
          {/* ====================================================== */}

          <div className="rounded-xl border border-green-100 bg-green-50 p-3 md:p-4">
            <p className="text-xs md:text-sm font-semibold text-green-700">
              You saved ₹{summary.savings.toLocaleString()}
            </p>
            {couponDiscount > 0 && (
              <p className="mt-1 text-[10px] md:text-xs text-green-600">
                Includes coupon savings
              </p>
            )}
          </div>

          {/* ====================================================== */}
          {/* DESKTOP CHECKOUT BUTTON */}
          {/* ====================================================== */}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={!cart.cartItems?.length}
            className="
              hidden md:flex
              mt-5 h-14 w-full
              items-center justify-center
              rounded-2xl
              bg-teal-600
              text-sm font-semibold text-white
              transition-all duration-200
              hover:bg-teal-700
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            Proceed To Checkout
          </button>
        </div>
      </div>

      {/* ====================================================== */}
      {/* MOBILE STICKY BOTTOM CHECKOUT BAR (Hidden on md+) */}
      {/* ====================================================== */}
      <div
  className="
    fixed
    bottom-[72px]
    left-1/2
    z-[999]
    flex
    w-[94%]
    max-w-[500px]
    -translate-x-1/2
    items-center
    justify-between
    gap-3
    rounded-[20px]
    border
    border-white/80
    bg-white/95
    px-3
    py-2.5
    shadow-[0_12px_35px_rgba(0,0,0,0.16),0_3px_12px_rgba(0,0,0,0.08)]
    backdrop-blur-xl
    md:hidden
  "
>
  {/* TOTAL */}
  <div className="min-w-0 flex-1 pl-1">
    <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400">
      Total Amount
    </span>

    <span className="block text-lg font-bold leading-tight text-gray-900">
      ₹{summary.grandTotal.toLocaleString()}
    </span>
  </div>

  {/* CHECKOUT */}
  <button
    type="button"
    onClick={handleCheckout}
    disabled={!cart.cartItems?.length}
    className="
      flex
      h-11
      shrink-0
      items-center
      justify-center
      rounded-[14px]
      bg-gradient-to-r
      from-teal-600
      via-teal-500
      to-emerald-600
      px-5
      text-[13px]
      font-bold
      text-white
      shadow-[0_5px_16px_rgba(13,148,136,0.28)]
      transition-all
      duration-200
      active:scale-[0.97]
      active:shadow-[0_3px_10px_rgba(13,148,136,0.22)]
      disabled:cursor-not-allowed
      disabled:opacity-50
    "
  >
    Proceed To Checkout
  </button>
</div>
    </div>
  );
}