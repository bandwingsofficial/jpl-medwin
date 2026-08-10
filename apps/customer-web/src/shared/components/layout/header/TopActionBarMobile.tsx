"use client";

import Link from "next/link";
import Image from "next/image";
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
  setLoginOpen(true);
  return;
}

setOpen((prev) => !prev);
  };
  const handleActionClick = (href: string) => {
  if (isLoading) {
    return;
  }

  // Allow guest access
 if (href === "/wishlist") {
    router.push(href);
    return;
  }

  // Allow guest access
  if (href === "/cart") {
    router.push(href);
    return;
  }

  // Require login for protected pages
if (!isAuthenticated) {
  setLoginOpen(true);
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
      <div className="mb-1">
        <GlobalSearch />
      </div>

      {/* ====================================================== */}
{/* FLOATING BOTTOM NAVIGATION - MOBILE */}
{/* ====================================================== */}
<div
  className="
    fixed
    inset-x-0
    bottom-0
    z-[9999]
    sm:hidden
    overflow-hidden
    rounded-t-[22px]
    border
    border-white/20
    bg-gradient-to-r
    from-teal-600
    via-teal-500
    to-emerald-600
    shadow-[0_-8px_30px_rgba(0,0,0,0.18)]
    backdrop-blur-xl
    pb-[env(safe-area-inset-bottom)]
  "
>
  <div
  className="
    flex
    h-[64px]
    min-h-[64px]
    items-center
    justify-around
    px-2
  "
>
    {/* HOME */}
    <Link
      href="/"
      className="
        flex
        min-w-[52px]
        flex-col
        items-center
        justify-center
        rounded-xl
        px-2
        py-1.5
        text-[10px]
        font-medium
        text-white
        transition-all
        duration-200
        hover:bg-white/10
        active:scale-95
      "
    >
      <svg
        className="h-5 w-5 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>

      <span className="mt-1 leading-none text-white">
        Home
      </span>
    </Link>

    {/* DYNAMIC ACTION ITEMS */}
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
          className="
            relative
            flex
            min-w-[52px]
            flex-col
            items-center
            justify-center
            rounded-xl
            px-2
            py-1.5
            text-[10px]
            font-medium
            text-white
            transition-all
            duration-200
            hover:bg-white/10
            active:scale-95
          "
        >
          {/* BADGE */}
          {!!badge && badge > 0 && (
            <span
              className="
                absolute
                right-0
                top-0
                z-10
                flex
                h-[17px]
                min-w-[17px]
                items-center
                justify-center
                rounded-full
                border-2
                border-teal-600
                bg-red-500
                px-1
                text-[9px]
                font-bold
                leading-none
                text-white
                shadow-sm
              "
            >
              {badge}
            </span>
          )}

          {/* ICON / PNG */}
          <div className="flex h-6 w-6 items-center justify-center">
            {imageSrc ? (
              /*
               * PNG IMAGES:
               * Keep their original colors.
               * Do NOT apply text-white.
               */
              <Image
                src={imageSrc}
                alt={label}
                width={24}
                height={24}
                className="
                  h-6
                  w-6
                  object-contain
                  drop-shadow-sm
                "
              />
            ) : (
              /*
               * LUCIDE ICONS:
               * All icons use the same white color.
               */
              <Icon
                className="
                  h-5
                  w-5
                  text-white
                  stroke-[2]
                "
              />
            )}
          </div>

          {/* LABEL */}
          <span
            className="
              mt-1
              leading-none
              text-white
            "
          >
            {label}
          </span>
        </button>
      )
    )}
  </div>
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