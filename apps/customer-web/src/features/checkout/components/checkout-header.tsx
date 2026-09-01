"use client";

import { CreditCard, ShieldCheck } from "lucide-react";
import { CheckoutSession } from "@/features/checkout/types/checkout.type";

interface CheckoutHeaderProps {
  checkout?: CheckoutSession | null;
}

export function CheckoutHeader({ checkout }: CheckoutHeaderProps) {
  /*
   |------------------------------------------------------------------
   | SAFE FALLBACKS
   |------------------------------------------------------------------
   */
  const totalQuantity = checkout?.summary?.totalQuantity || 0;

  return (
    <div
      className="
        flex 
        flex-col 
        sm:flex-row 
        sm:items-center 
        justify-between 
        gap-4 
        rounded-xl 
        border 
        border-slate-200 
        bg-white 
        p-5 
        shadow-sm
      "
    >
      {/* LEFT SECTION: Branding & Status */}
      <div className="flex items-center gap-3">
        <div
          className="
            flex 
            h-11 
            w-11 
            shrink-0 
            items-center 
            justify-center 
            rounded-lg 
            bg-teal-600 
            text-white
          "
        >
          <CreditCard size={20} />
        </div>

        <div>
          <h1 className="
            animate-text-shine
            bg-gradient-to-r 
            from-[#001f3f] 
            via-[#0d9488] 
            to-[#001f3f] 
            bg-clip-text 
            text-[22px] 
            font-bold 
            text-transparent
          ">
            Secure Checkout
          </h1>
          <p className="text-xs font-medium text-slate-500">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"} ready to ship
          </p>
        </div>
      </div>

      {/* RIGHT SECTION: Trust Badge */}
      <div
        className="
          flex 
          items-center 
          gap-2.5 
          rounded-lg 
          border 
          border-emerald-100 
          bg-emerald-50/50 
          px-3 
          py-2
        "
      >
        <ShieldCheck size={18} className="text-emerald-600" />
        <div>
          <p className="text-xs font-bold text-emerald-700">
            Secure Payment
          </p>
          <p className="text-[10px] leading-none text-emerald-600/80">
            256-bit SSL Encryption
          </p>
        </div>
      </div>
    </div>
  );
}