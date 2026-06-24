"use client";

import Image from "next/image";
import Link from "next/link";

import {
  X,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

import {
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";

import { usePathname } from "next/navigation";

import { useCart } from "@/features/cart/hooks/use-cart";

export function FloatingCartBar() {
  /*
   |--------------------------------------------------------------------------
   | ROUTE
   |--------------------------------------------------------------------------
   */

  const pathname =
    usePathname();

  /*
   |--------------------------------------------------------------------------
   | HIDE ROUTES
   |--------------------------------------------------------------------------
   */

  const hiddenRoutes = [
    "/checkout",
  ];

  /*
   |--------------------------------------------------------------------------
   | CART
   |--------------------------------------------------------------------------
   */

  const { data } =
    useCart();

  const cart =
    data;

  /*
   |--------------------------------------------------------------------------
   | LOCAL STATE
   |--------------------------------------------------------------------------
   */

  const [isClosed, setIsClosed] =
    useState(false);

  const [
    showCelebration,
    setShowCelebration,
  ] = useState(false);

  const prevCountRef =
    useRef(0);

  /*
   |--------------------------------------------------------------------------
   | ITEMS
   |--------------------------------------------------------------------------
   */

  const items =
    cart?.cartItems || [];

  const totalQuantity =
    cart?.totalQuantity || 0;

  const totalAmount =
    cart?.summary?.grandTotal || 0;

  /*
   |--------------------------------------------------------------------------
   | FIRST ADD CELEBRATION
   |--------------------------------------------------------------------------
   */

  useEffect(() => {
    if (
      prevCountRef.current === 0 &&
      totalQuantity === 1
    ) {
      setShowCelebration(true);

      const timer =
        setTimeout(() => {
          setShowCelebration(
            false
          );
        }, 2200);

      return () =>
        clearTimeout(timer);
    }

    prevCountRef.current =
      totalQuantity;
  }, [totalQuantity]);

  /*
   |--------------------------------------------------------------------------
   | IMAGES
   |--------------------------------------------------------------------------
   */

  const previewImages =
    useMemo(() => {
      return items
        .slice(0, 3)
        .map(
          (item) =>
            item.variant
              ?.images?.main
        )
        .filter(Boolean);
    }, [items]);

  /*
   |--------------------------------------------------------------------------
   | HIDE
   |--------------------------------------------------------------------------
   */

  if (
    hiddenRoutes.includes(
      pathname
    )
  ) {
    return null;
  }

  if (
    !items.length ||
    isClosed
  ) {
    return null;
  }

  return (
    <>
      {/* ====================================================== */}
      {/* CELEBRATION */}
      {/* ====================================================== */}

      {showCelebration && (
        <div
          className="
            pointer-events-none
            fixed
            bottom-28
            left-1/2
            z-[1000]
            -translate-x-1/2
            animate-[cartPop_2.2s_ease-out_forwards]
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              bg-emerald-600
              px-5
              py-3
              shadow-2xl
            "
          >
            <img 
  src="/logo/sparkle.jpg" 
  alt="Sparkle effect" 
  className="h-7 w-7 object-contain mix-blend-screen" 
/>
            <span
              className="
                whitespace-nowrap
                text-sm
                font-semibold
                text-white
              "
            >
              Item added to cart 
            </span>
          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* FLOATING BAR */}
      {/* ====================================================== */}

      <div
  className="
    fixed
    bottom-3
    left-1/2
    z-[999]
    w-[84%]
    max-w-[360px]
    -translate-x-1/2
    sm:bottom-4
    sm:w-[420px]
    sm:max-w-[420px]
  "
>
        <div
  className="
    relative
    overflow-hidden
    rounded-[22px]
    border
    border-neutral-200
    bg-white
    shadow-[0_12px_35px_rgba(0,0,0,0.14)]
  "
>
          {/* TOP GRADIENT */}

          <div
            className="
              absolute
              inset-x-0
              top-0
              h-[3px]
              bg-gradient-to-r
              from-emerald-500
              via-lime-400
              to-emerald-500
            "
          />

          <div
            className="
  flex
  items-center
  gap-2
  px-2
  py-2
  sm:gap-3
  sm:px-4
  sm:py-3
"
          >
            {/* ====================================================== */}
            {/* LEFT CONTENT */}
            {/* ====================================================== */}

            <Link
              href="/cart"
              className="
                flex
                min-w-0
                flex-1
                items-center
                gap-2
                sm:gap-3
              "
            >
              {/* PRODUCT IMAGE */}

              <div className="relative flex items-center">
                {previewImages
                  .slice(0, 1)
                  .map(
                    (
                      image,
                      index
                    ) => (
                      <div
                        key={`${image}-${index}`}
                        className="
                          relative
                          h-11
                          w-11
                          overflow-hidden
                          rounded-full
                          border-2
                          border-white
                          bg-neutral-100
                          shadow-md
                          sm:h-12
                          sm:w-12
                        "
                      >
                        <Image
                          src={image}
                          alt="Cart Product"
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    )
                  )}

                {/* COUNT BADGE */}

                <div
                  className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    h-5
                    min-w-[20px]
                    items-center
                    justify-center
                    rounded-full
                    bg-gradient-to-r
                    from-red-500
                    to-rose-500
                    px-1
                    text-[10px]
                    font-bold
                    text-white
                    ring-2
                    ring-white
                  "
                >
                  {totalQuantity}
                </div>
              </div>

              {/* TEXT */}

              <div className="min-w-0 flex-1">
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  {/* DESKTOP CART ICON */}

                  <div
                    className="
                      hidden
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-emerald-100
                      text-emerald-700
                      sm:flex
                    "
                  >
                    <ShoppingCart
                      size={18}
                    />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-[13px]
                        font-semibold
                        text-neutral-900
                        sm:text-[15px]
                      "
                    >
                      Ready to Checkout
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-[10px]
                        font-medium
                        text-neutral-500
                        sm:text-xs
                      "
                    >
                      {totalQuantity}{" "}
                      {totalQuantity === 1
                        ? "item"
                        : "items"}{" "}
                      • ₹{totalAmount}
                    </p>
                  </div>
                </div>
              </div>

              {/* DESKTOP CTA */}

              <div
                className="
                  hidden
                  shrink-0
                  sm:flex
                  sm:items-center
                "
              >
                <span
                  className="
                    rounded-full
                    bg-gradient-to-r
                    from-emerald-500
                    to-green-600
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    shadow-md
                  "
                >
                  View Cart
                </span>
              </div>
            </Link>

            {/* ====================================================== */}
            {/* MOBILE CTA */}
            {/* ====================================================== */}

            <Link
              href="/cart"
              className="
                flex
                h-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-r
                from-emerald-500
                to-green-600
                px-3
                text-xs
                font-semibold
                text-white
                shadow-md
                transition-all
                duration-200
                active:scale-95
                sm:hidden
              "
            >
              View
            </Link>

            {/* ====================================================== */}
            {/* CLOSE */}
            {/* ====================================================== */}

            <button
              type="button"
              onClick={() =>
                setIsClosed(true)
              }
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-neutral-100
                text-neutral-500
                transition-all
                duration-200
                hover:bg-neutral-200
                hover:text-neutral-700
                active:scale-95
                sm:h-10
                sm:w-10
              "
            >
              <X
                size={16}
                className="sm:h-[18px] sm:w-[18px]"
              />
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* ANIMATION */}
      {/* ====================================================== */}

      <style>
        {`
          @keyframes cartPop {
            0% {
              opacity: 0;
              transform: translate(-50%, 80px) scale(0.8);
            }

            20% {
              opacity: 1;
              transform: translate(-50%, 0px) scale(1.05);
            }

            40% {
              opacity: 1;
              transform: translate(-50%, -10px) scale(1);
            }

            80% {
              opacity: 1;
              transform: translate(-50%, -18px) scale(1);
            }

            100% {
              opacity: 0;
              transform: translate(-50%, -40px) scale(0.92);
            }
          }
        `}
      </style>
    </>
  );
}