"use client";

import Link from "next/link";
import Image from "next/image";

import { useWishlistCount } from "@/features/wishlist/hooks/use-wishlist-count";

import { useCurrentLocation } from "@/shared/hooks/use-current-location";

import {
  Heart,
  Search,
  ShoppingCart,
  UserCircle2,
  LogOut,
  MapPin,
  MoreVertical,
} from "lucide-react";
import { GlobalSearch } from "@/features/global-search/components/global-search";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

import { logout } from "@/infrastructure/api/auth.api";

import { useState, useEffect, useMemo } from "react";

import { useAuth } from "@/features/auth/hooks/use-auth";

import { useCart } from "@/features/cart/hooks/use-cart";

interface ActionItem {
  icon?: any;
  imageSrc?: string;
  label: string;
  href: string;
  badge?: number;
  iconClassName?: string;
}

export function TopActionBar() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { location, loading } = useCurrentLocation();

  /*
   |------------------------------------------------------------------
   | TYPEWRITER PLACEHOLDER LOGIC
   |------------------------------------------------------------------
   |
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
   | AUTH
   |------------------------------------------------------------------
   |
   */

  const { isAuthenticated, isLoading } = useAuth();

  /*
   |------------------------------------------------------------------
   | CART
   |------------------------------------------------------------------
   |
   */

  const { data } = useCart();

  const cartCount = mounted ? data?.totalQuantity || 0 : 0;

 const { data: wishlistData } =
  useWishlistCount();

const wishlistCount =
  mounted
    ? wishlistData?.count ?? 0
    : 0;
  /*
   |------------------------------------------------------------------
   | ACTION ITEMS
   |------------------------------------------------------------------
   |
   */

  const actionItems: ActionItem[] = [
    {
  imageSrc: "/Logo/coin2.png",
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
   |
   */

  useEffect(() => {
    setMounted(true);
  }, []);

  /*
   |------------------------------------------------------------------
   | PROFILE CLICK
   |------------------------------------------------------------------
   |
   */

  const handleProfileClick = () => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/login");

      return;
    }

    setOpen((prev) => !prev);
  };

  /*
   |------------------------------------------------------------------
   | LOGOUT
   |------------------------------------------------------------------
   |
   */

  const handleLogout = async () => {
    try {
      await logout();

      queryClient.clear();

      setOpen(false);

      router.replace("/");

      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6">
        {/* =========================================================
            MOBILE VIEW
        ========================================================= */}

        <div className="block sm:hidden py-3">
          {/* TOP ROW */}

          <div className="flex items-center justify-between gap-3">
            {/* LOGO */}

            <Link href="/" className="shrink-0">
              <Image
                src="/Logo/Jpl_Logo.png"
                alt="JPL Medwin Logo"
                width={160}
                height={60}
                priority
                className="h-[60px] w-[110px] object-contain"
              />
            </Link>

            {/* RIGHT ALIGNED CONTROLS (LOCATION + ACCOUNT CONTAINER) */}
            <div className="flex items-center gap-2">
              {/* LOCATION DISPLAY */}
              <div className="flex items-center gap-1 text-xs bg-slate-50/80 border border-slate-100 px-2.5 py-1.5 rounded-full max-w-[120px] truncate shadow-sm">
                <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0 stroke-[2.5]" />
                <span className="truncate font-medium text-slate-600">
                  {loading ? "..." : location?.city || "No Loc"}
                </span>
              </div>

              {/* ACCOUNT BUTTON */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handleProfileClick}
                  className="group flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 transition-all duration-300 hover:bg-slate-100"
                >
                  <UserCircle2 className="h-5 w-5 text-slate-600 group-hover:text-teal-600 transition-colors" />
                </button>

                {/* ACCOUNT DROPDOWN */}

                {mounted && open && isAuthenticated && (
                  <div className="absolute right-0 z-50 mt-3 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        router.push("/account");
                      }}
                      className="block w-full px-4 py-3 text-left text-sm transition hover:bg-gray-50"
                    >
                      My Profile
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-500 transition hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />

                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SEARCH + MENU */}

          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1">
  <GlobalSearch />
</div>

            {/* 3 DOT MENU */}

            <div className="relative">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50"
              >
                <MoreVertical className="h-5 w-5 text-slate-700" />

                {/* CART COUNT */}

                {mounted && cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* MOBILE DROPDOWN */}

              {mobileMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  {actionItems.map(({ icon: Icon, imageSrc, label, href, badge, iconClassName }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 last:border-b-0 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center h-5 w-5">
                          {imageSrc ? (
  <Image
    src={imageSrc}
    alt={label}
    width={32}
    height={32}
    className="h-full w-full object-contain animate-[spin_4s_linear_infinite]"
  />
) : (
                            <Icon className={`h-5 w-5 transition-all duration-300 ${iconClassName || "text-slate-700"}`} />
                          )}

                          {!!badge && badge > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-1 text-[9px] font-bold text-white">
                              {badge}
                            </span>
                          )}
                        </div>

                        <span>{label}</span>
                      </div>

                      {!!badge && badge > 0 && (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                          {badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================
            DESKTOP VIEW
        ========================================================= */}

        <div className="hidden h-16 items-center gap-3 sm:flex sm:h-20 sm:gap-6">
          {/* LOGO */}

          <Link href="/" className="shrink-0">
            <Image
              src="/Logo/Header.png"
              alt="JPL Medwin Logo"
              width={160}
              height={80}
              priority
              className="h-auto w-[110px] object-contain sm:w-[190px]"
            />
          </Link>

          {/* LOCATION */}
<div className="hidden items-center gap-2 whitespace-nowrap text-sm text-slate-700 md:flex
                bg-slate-50/60 hover:bg-slate-50 border border-slate-100/80 
                px-4 py-2 rounded-full transition-all duration-200 shadow-sm">
  
  <MapPin className="h-4 w-4 text-teal-600 stroke-[2.5]" />

  <span className="max-w-[140px] truncate font-medium text-slate-600">
    {loading ? "Fetching..." : location?.city || "Location not found"}
  </span>
  
</div>

          <div className="flex-1">
  <GlobalSearch />
</div>

          {/* ACTIONS */}

          <div className="relative flex items-center gap-5 sm:gap-6">
            {actionItems.map(({ icon: Icon, imageSrc, label, href, badge, iconClassName }) => {
              return (
                <Link
                  key={label}
                  href={href}
                  className="group relative flex flex-col items-center text-[10px] text-slate-700 transition-all duration-300 hover:text-black sm:text-xs"
                >
                  {/* BADGE */}

                  {!!badge && badge > 0 && (
                    <span className="absolute -right-2 -top-1.5 z-10 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-1.5 text-[10px] font-bold text-white shadow-md ring-2 ring-white">
                      {badge}
                    </span>
                  )}

                  <div className="relative flex items-center justify-center h-8 w-8 transition-all duration-300">
                    {imageSrc?.endsWith(".mp4") ? (
                      <video src={imageSrc} autoPlay loop muted playsInline className="h-8 w-8 object-contain" />
                    ) : imageSrc ? (
  <Image
    src={imageSrc}
    alt={label}
    width={28} // Updated from 22 to 24 (+2px)
    height={28} // Updated from 22 to 24 (+2px)
    className="h-[26px] w-[26px] object-contain" // Updated from h-6 w-6 (24px) to h-[26px] w-[26px] (+2px)
  />
) : (
                      <Icon className={`h-5 w-5 transition-all duration-300 ${iconClassName || "text-slate-700"}`} />
                    )}
                  </div>

                  <span className="mt-1 hidden sm:block font-medium">{label}</span>
                </Link>
              );
            })}

            {/* ACCOUNT */}

            <div className="relative">
              <button
                type="button"
                onClick={handleProfileClick}
                className="group flex flex-col items-center text-[10px] text-slate-700 transition-all duration-300 hover:text-black sm:text-xs"
              >
                <div className="relative flex items-center justify-center h-8 w-8 transition-all duration-300">
                  <UserCircle2 className="h-5 w-5 text-slate-600 transition-all duration-300 group-hover:scale-105 group-hover:text-teal-600" />
                </div>

                <span className="mt-1 hidden sm:block font-medium">
                  {!mounted
                    ? "Account"
                    : isLoading
                    ? "Loading..."
                    : isAuthenticated
                    ? "Account"
                    : "Login"}
                </span>
              </button>

              {/* DROPDOWN */}

              {mounted && open && isAuthenticated && (
                <div className="absolute right-0 z-50 mt-3 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      router.push("/account");
                    }}
                    className="block w-full px-4 py-3 text-left text-sm transition hover:bg-gray-50"
                  >
                    My Profile
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-500 transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />

                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}