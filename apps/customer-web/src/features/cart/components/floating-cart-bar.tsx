"use client";

import Image from "next/image";
import Link from "next/link";

import {
  X,
  ShoppingBag,
  ArrowRight,
  Package,
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

  const pathname = usePathname();

  /*
   |--------------------------------------------------------------------------
   | HIDE ROUTES
   |--------------------------------------------------------------------------
   */

  const hiddenRoutes = ["/checkout"];

  /*
   |--------------------------------------------------------------------------
   | CART
   |--------------------------------------------------------------------------
   */

  const { data } = useCart();
  const cart = data;

  /*
   |--------------------------------------------------------------------------
   | LOCAL STATE
   |--------------------------------------------------------------------------
   */

  const [isClosed, setIsClosed] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pulse, setPulse] = useState(false);
  const prevCountRef = useRef(0);

  /*
   |--------------------------------------------------------------------------
   | ITEMS
   |--------------------------------------------------------------------------
   */

  const items = cart?.cartItems || [];
  const totalQuantity = cart?.totalQuantity || 0;
  const totalAmount = cart?.summary?.grandTotal || 0;

  /*
   |--------------------------------------------------------------------------
   | MOUNT ANIMATION
   |--------------------------------------------------------------------------
   */

  useEffect(() => {
    if (items.length && !isClosed) {
      const t = setTimeout(() => setIsVisible(true), 80);
      return () => clearTimeout(t);
    } else {
      setIsVisible(false);
    }
  }, [items.length, isClosed]);

  /*
   |--------------------------------------------------------------------------
   | FIRST ADD CELEBRATION + QUANTITY PULSE
   |--------------------------------------------------------------------------
   */

  useEffect(() => {
    if (prevCountRef.current === 0 && totalQuantity === 1) {
      setShowCelebration(true);
      const t = setTimeout(() => setShowCelebration(false), 2800);
      return () => clearTimeout(t);
    }

    if (totalQuantity > prevCountRef.current && prevCountRef.current > 0) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(t);
    }

    prevCountRef.current = totalQuantity;
  }, [totalQuantity]);

  /*
   |--------------------------------------------------------------------------
   | IMAGES
   |--------------------------------------------------------------------------
   */

  const previewImages = useMemo(() => {
    return items
      .slice(0, 3)
      .map((item) => item.variant?.images?.main)
      .filter(Boolean);
  }, [items]);

  /*
   |--------------------------------------------------------------------------
   | HIDE
   |--------------------------------------------------------------------------
   */

  if (hiddenRoutes.includes(pathname)) return null;
  if (!items.length || isClosed) return null;

  return (
    <>
      {/* ====================================================== */}
      {/* CELEBRATION TOAST */}
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
          "
          style={{ animation: "celebrationPop 2.8s ease-out forwards" }}
        >
          <div
            className="
              flex
              items-center
              gap-2.5
              rounded-full
              px-5
              py-3
            "
            style={{
              background: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
              boxShadow: "0 8px 32px rgba(5, 150, 105, 0.45), 0 0 0 1px rgba(255,255,255,0.15) inset",
            }}
          >
            {/* Inline SVG bag icon — no external image */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>

            <span className="whitespace-nowrap text-sm font-semibold text-white tracking-wide">
              Added to cart!
            </span>

            {/* Confetti dots */}
            <span className="flex gap-1" aria-hidden="true">
              {["#fbbf24", "#34d399", "#f472b6", "#60a5fa"].map((c, i) => (
                <span
                  key={i}
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: c, animation: `confettiDot 0.6s ${i * 0.1}s ease-out both` }}
                />
              ))}
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
          bottom-4
          left-1/2
          z-[999]
          w-[88%]
          max-w-[400px]
          -translate-x-1/2
          sm:bottom-5
          sm:w-[460px]
          sm:max-w-[460px]
        "
        style={{
          transform: `translateX(-50%) translateY(${isVisible ? "0" : "110%"})`,
          opacity: isVisible ? 1 : 0,
          transition: "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
        }}
      >
        {/* GLOW RING BEHIND BAR */}
        <div
          className="absolute inset-0 -z-10 rounded-[26px]"
          style={{
            background: "linear-gradient(135deg, #059669, #10b981, #6ee7b7)",
            filter: "blur(14px)",
            opacity: 0.28,
            transform: "scale(1.04) translateY(4px)",
          }}
        />

        {/* MAIN CARD */}
        <div
          className="relative overflow-hidden rounded-[22px]"
          style={{
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow:
              "0 20px 50px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)",
          }}
        >
          {/* TOP SHIMMER STRIPE */}
          <div
            className="absolute inset-x-0 top-0 h-[2.5px] rounded-t-full"
            style={{
              background: "linear-gradient(90deg, #059669 0%, #34d399 30%, #a3e635 60%, #059669 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmerStripe 3s linear infinite",
            }}
          />

          {/* INNER CONTENT */}
          <div className="flex items-center gap-2 px-2.5 py-2.5 sm:gap-3 sm:px-3.5 sm:py-3">

            {/* ====================================================== */}
            {/* LEFT: IMAGE + BADGE */}
            {/* ====================================================== */}

            <Link
              href="/cart"
              className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3"
            >
              {/* PRODUCT THUMBNAIL STACK */}
              <div className="relative shrink-0">
                {previewImages.length > 0 ? (
                  <>
                    {previewImages.slice(0, 2).map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="absolute overflow-hidden rounded-2xl border-2 border-white bg-neutral-100"
                        style={{
                          width: 44,
                          height: 44,
                          left: index * 6,
                          top: index * -3,
                          zIndex: previewImages.length - index,
                          boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
                          display: index > 0 ? (previewImages.length > 1 ? "block" : "none") : "block",
                        }}
                      >
                        <Image
                          src={image}
                          alt="Cart item"
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {/* spacer to push content right */}
                    <div style={{ width: previewImages.length > 1 ? 54 : 44, height: 44 }} />
                  </>
                ) : (
                  /* Fallback icon when no images */
                  <div
                    className="flex items-center justify-center rounded-2xl"
                    style={{
                      width: 44,
                      height: 44,
                      background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
                      boxShadow: "0 3px 10px rgba(5,150,105,0.18)",
                    }}
                  >
                    <Package size={20} className="text-emerald-600" />
                  </div>
                )}

                {/* QUANTITY BADGE */}
                <div
                  className="
                    absolute
                    -right-1
                    -top-1
                    z-20
                    flex
                    h-[18px]
                    min-w-[18px]
                    items-center
                    justify-center
                    rounded-full
                    px-1
                    text-[10px]
                    font-bold
                    text-white
                  "
                  style={{
                    background: "linear-gradient(135deg, #ef4444, #f43f5e)",
                    boxShadow: "0 2px 6px rgba(239,68,68,0.5), 0 0 0 2px white",
                    transform: pulse ? "scale(1.35)" : "scale(1)",
                    transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  {totalQuantity}
                </div>
              </div>

              {/* TEXT BLOCK */}
              <div className="min-w-0 flex-1">
                <p
                  className="truncate font-semibold text-neutral-900 leading-tight"
                  style={{ fontSize: 13.5 }}
                >
                  Ready to checkout
                </p>
                <p
                  className="mt-0.5 truncate text-neutral-500 leading-tight"
                  style={{ fontSize: 11 }}
                >
                  {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
                  <span className="mx-1.5 text-neutral-300">•</span>
                  <span className="font-semibold text-emerald-600">₹{totalAmount.toLocaleString("en-IN")}</span>
                </p>
              </div>

              {/* DESKTOP: Cart icon pill */}
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 34,
                    height: 34,
                    background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
                  }}
                >
                  <ShoppingBag size={15} className="text-emerald-600" />
                </div>
              </div>
            </Link>

            {/* ====================================================== */}
            {/* CTA BUTTON */}
            {/* ====================================================== */}

            <Link
              href="/cart"
              className="
                group
                relative
                shrink-0
                overflow-hidden
                rounded-[14px]
                text-xs
                font-semibold
                text-white
                transition-all
                duration-200
                active:scale-95
              "
              style={{
                padding: "9px 14px",
                background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                boxShadow: "0 4px 14px rgba(5,150,105,0.4), 0 1px 3px rgba(5,150,105,0.3)",
              }}
            >
              {/* shimmer sweep on hover */}
              <span
                className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                }}
              />
              <span className="relative flex items-center gap-1">
                <span className="hidden sm:inline">View Cart</span>
                <span className="sm:hidden">View</span>
                <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>

            {/* ====================================================== */}
            {/* CLOSE BUTTON */}
            {/* ====================================================== */}

            <button
              type="button"
              onClick={() => setIsClosed(true)}
              aria-label="Dismiss cart bar"
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                text-neutral-400
                transition-all
                duration-200
                hover:bg-neutral-100
                hover:text-neutral-600
                active:scale-90
              "
            >
              <X size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* KEYFRAMES */}
      {/* ====================================================== */}

      <style>{`
        @keyframes shimmerStripe {
          0%   { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes celebrationPop {
          0%   { opacity: 0; transform: translateX(-50%) translateY(60px) scale(0.75); }
          18%  { opacity: 1; transform: translateX(-50%) translateY(0px) scale(1.07); }
          32%  { opacity: 1; transform: translateX(-50%) translateY(-6px) scale(1); }
          78%  { opacity: 1; transform: translateX(-50%) translateY(-10px) scale(1); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-28px) scale(0.9); }
        }

        @keyframes confettiDot {
          0%   { transform: translateY(0) scale(0); opacity: 0; }
          50%  { transform: translateY(-8px) scale(1.2); opacity: 1; }
          100% { transform: translateY(4px) scale(0.8); opacity: 0.6; }
        }
      `}</style>
    </>
  );
}