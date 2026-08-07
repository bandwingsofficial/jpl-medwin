"use client";

import Link from "next/link";
import Image from "next/image";
import { LoginModal } from "@/features/auth/components/login-modal";
import { useAuthModal } from "@/shared/context/auth-modal-context";
import { useLocation } from "@/features/location/context/LocationProvider";
import { useLocationModal } from "@/features/location/hooks/useLocationModal";
import { LocationModal } from "@/features/location/components/LocationModal";

import {
  UserCircle2,
  LogOut,
  MapPin,
} from "lucide-react";
import { GlobalSearch } from "@/features/global-search/components/global-search";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "@/infrastructure/api/auth.api";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";

interface ActionItem {
  icon?: any;
  imageSrc?: string;
  label: string;
  href: string;
  badge?: number;
  iconClassName?: string;
}

interface TopActionBarMobileProps {
  mounted: boolean;
  cartCount: number;
  wishlistCount: number;
  actionItems: ActionItem[];
}

export function TopActionBarMobile({
  mounted,
  cartCount,
  wishlistCount,
  actionItems,
}: TopActionBarMobileProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Account dropdown
  const [open, setOpen] = useState(false);

  // Shared location state
  const { location, loading, setLocation } = useLocation();
  const { loginOpen, setLoginOpen } = useAuthModal();

  // Location modal state
  const {
    isOpen: isLocationModalOpen,
    open: openLocationModal,
    close: closeLocationModal,
  } = useLocationModal();

  // AUTH
  const { isAuthenticated, isLoading } = useAuth();

  const handleProfileClick = () => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      if (window.location.pathname === "/") {
        setLoginOpen(true);
      } else {
        router.push("/login");
      }
      return;
    }

    setOpen((prev) => !prev);
  };
  const handleActionClick = (href: string) => {
  if (isLoading) return;

  if (!isAuthenticated) {
    if (window.location.pathname === "/") {
      setLoginOpen(true);
    } else {
      router.push("/login");
    }
    return;
  }

  router.push(href);
};

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
    <div className="block sm:hidden">
      {/* TOP ROW */}
      <div className="flex items-center justify-between gap-3">
        {/* LOGO */}
        <Link href="/" className="shrink-0">
  <Image
    src="/Images/jpl_logo2.png"
    alt="JPL Medwin Logo"
    width={240}
    height={100}
    priority
    className="h-[80px] w-[150px] object-contain"
  />
</Link>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-2">
          {/* LOCATION */}
          <button
            type="button"
            onClick={openLocationModal}
            className="flex max-w-[140px] items-center gap-1 rounded-full border border-slate-100 bg-slate-50/80 px-2.5 py-1.5 text-xs shadow-sm transition-all duration-200 hover:border-teal-200 hover:bg-slate-50"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 stroke-[2.5] text-teal-600" />
            <span className="truncate font-medium text-slate-600">
              {loading
                ? "..."
                : location
                ? location.locality
                  ? `${location.locality}, ${location.city}`
                  : location.city
                : "Select"}
            </span>
          </button>

          {/* ACCOUNT */}
          <div className="relative">
            <button
  type="button"
  onClick={handleProfileClick}
  className="group flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition-all duration-300"
>
  <Image
    src="/Logo/jpl-profile-icon.png"
    alt="Profile"
    width={36}
    height={36}
    className="h-full w-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
  />
</button>

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

      {/* SEARCH BAR ONLY */}
      <div >
        <GlobalSearch />
      </div>

      {/* FIXED BOTTOM NAVIGATION BAR FOR MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-200 bg-white py-2 shadow-lg sm:hidden">
        {/* HOME BUTTON */}
        <Link
          href="/"
          className="flex flex-col items-center text-[10px] font-medium text-slate-600 transition hover:text-teal-600"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="mt-1">Home</span>
        </Link>

        {/* DYNAMIC ACTION ITEMS (COINS, WISHLIST, CART) */}
        {actionItems.map(
          ({
            icon: Icon,
            imageSrc,
            label,
            href,
            badge,
            iconClassName,
          }) => (
            <button
  key={label}
  type="button"
  onClick={() => handleActionClick(href)}
  className="relative flex flex-col items-center text-[10px] font-medium text-slate-600 transition hover:text-teal-600"
>
              {!!badge && badge > 0 && (
                <span className="absolute -right-2 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-1 text-[9px] font-bold text-white">
                  {badge}
                </span>
              )}

              <div className="flex h-5 w-5 items-center justify-center">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={label}
                    width={20}
                    height={20}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Icon
                    className={`h-5 w-5 ${
                      iconClassName || "text-slate-600"
                    }`}
                  />
                )}
              </div>

              <span className="mt-1">{label}</span>
            </button>
          )
        )}
      </div>

      {/* LOCATION MODAL */}
      <LocationModal
        open={isLocationModalOpen}
        onOpenChange={(value) => {
          if (value) {
            openLocationModal();
          } else {
            closeLocationModal();
          }
        }}
        onLocationSelect={setLocation}
      />
    </div>
  );
}