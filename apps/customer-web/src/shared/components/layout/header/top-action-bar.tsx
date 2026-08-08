"use client";

import { LoginModal } from "@/features/auth/components/login-modal";
import { useWishlistCount } from "@/features/wishlist/hooks/use-wishlist-count";
import { useAuthModal } from "@/shared/context/auth-modal-context";
import { Heart, ShoppingCart } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useCart } from "@/features/cart/hooks/use-cart";
import { TopActionBarMobile } from "./TopActionBarMobile";
import { TopActionBarDesktop } from "./TopActionBarDesktop";

interface ActionItem {
  icon?: any;
  imageSrc?: string;
  label: string;
  href: string;
  badge?: number;
  iconClassName?: string;
}

export function TopActionBar() {
  const [mounted, setMounted] = useState(false);
  const { loginOpen, setLoginOpen } = useAuthModal();

  /*
   |------------------------------------------------------------------
   | TYPEWRITER PLACEHOLDER LOGIC
   |------------------------------------------------------------------
   */
  const placeholders = useMemo(() => ["microscopes...", "dumbbells...", "reactors...", "forklifts..."], []);
  const [currentText, setCurrentText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullWord = placeholders[wordIndex];

    if (!isDeleting) {
      setCurrentText(fullWord.substring(0, currentText.length + 1));
      setTypingSpeed(50);
    } else {
      setCurrentText(fullWord.substring(0, currentText.length - 1));
      setTypingSpeed(15);
    }

    if (!isDeleting && currentText === fullWord) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timer);
    }

    if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setWordIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }

    timer = setTimeout(() => {}, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex, placeholders, typingSpeed]);

  /*
   |------------------------------------------------------------------
   | CART & WISHLIST
   |------------------------------------------------------------------
   */
  const { data } = useCart();
  const cartCount = mounted ? data?.totalQuantity || 0 : 0;

  const { data: wishlistData } = useWishlistCount();
  const wishlistCount = mounted ? wishlistData?.count ?? 0 : 0;

  /*
   |------------------------------------------------------------------
   | ACTION ITEMS
   |------------------------------------------------------------------
   */
  const actionItems: ActionItem[] = [
    {
      imageSrc: "/Logo/coin6.png",
      label: "Coins",
      href: "/account/coins",
    },
    {
      icon: Heart,
      label: "Wishlist",
      href: "/wishlist",
      badge: mounted ? wishlistCount : 0,
      iconClassName:
        "text-rose-500 fill-rose-500/10 group-hover:fill-rose-500 group-hover:scale-105 transition-all duration-300",
    },
    {
      icon: ShoppingCart,
      label: "Cart",
      href: "/cart",
      badge: mounted ? cartCount : 0,
      iconClassName: "text-teal-700 group-hover:text-teal-800 group-hover:scale-105",
    },
  ];

  /*
   |------------------------------------------------------------------
   | HYDRATION FIX
   |------------------------------------------------------------------
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-[1400px] flex-col justify-center px-3 sm:px-6">
        {/* MOBILE VIEW */}
        <TopActionBarMobile
          mounted={mounted}
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          actionItems={actionItems}
        />

        {/* DESKTOP VIEW */}
        <TopActionBarDesktop
          mounted={mounted}
          actionItems={actionItems}
        />
      </div>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
    </header>
  );
}