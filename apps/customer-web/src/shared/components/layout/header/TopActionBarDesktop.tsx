"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthModal } from "@/shared/context/auth-modal-context";
import { useLocation } from "@/features/location/context/LocationProvider";
import { useLocationModal } from "@/features/location/hooks/useLocationModal";
import { LocationModal } from "@/features/location/components/LocationModal";

import {  LogOut, MapPin } from "lucide-react";
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

interface TopActionBarDesktopProps {
  mounted: boolean;
  actionItems: ActionItem[];
}

export function TopActionBarDesktop({
  mounted,
  actionItems,
}: TopActionBarDesktopProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Account dropdown
  const [open, setOpen] = useState(false);

  // Shared location state
  const { location, loading, setLocation } = useLocation();
  const { setLoginOpen } = useAuthModal();

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
  if (isLoading) {
    return;
  }

  // Allow guest access
  if (href === "/wishlist") {
    router.push(href);
    return;
  }

  // Require login for protected pages
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
   <div className="hidden h-16 items-center sm:flex sm:h-20 sm:items-center sm:gap-6">
      {/* LOGO */}
      <Link
  href="/"
  className="flex h-full shrink-0 items-center"
>
  <Image
    src="/Logo/jpl_logo.png"
    alt="JPL Medwin"
    width={160}
    height={80}
    priority
    className="block w-[110px] translate-y-[5px] object-contain sm:w-[190px]"
  />
</Link>
      {/* LOCATION */}
      <button
        type="button"
        onClick={openLocationModal}
        className="hidden items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow-sm transition-all duration-300 hover:border-teal-300 hover:shadow-md md:flex"
      >
        <MapPin className="h-5 w-5 shrink-0 text-red-600" />

        <div className="min-w-0 text-left">
          <p className="text-[11px] font-medium tracking-wider text-slate-400">
            Delivering to
          </p>

          <p className="max-w-[220px] truncate text-[15px] font-semibold text-slate-700">
            {loading
              ? "Fetching..."
              : location
              ? [location.locality, location.city]
                  .filter(Boolean)
                  .join(", ")
              : "Select Location"}
          </p>
        </div>
      </button>

      {/* SEARCH */}
      <div className="flex-1">
        <GlobalSearch />
      </div>

      {/* ACTIONS */}
      <div className="relative flex items-center gap-5 sm:gap-6">
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
  className="group relative flex flex-col items-center text-[10px] text-slate-700 transition-all duration-300 hover:text-black sm:text-xs"
>
              {!!badge && badge > 0 && (
                <span className="absolute -right-2 -top-1.5 z-10 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-1.5 text-[10px] font-bold text-white shadow-md ring-2 ring-white">
                  {badge}
                </span>
              )}

              <div className="relative flex h-8 w-8 items-center justify-center transition-all duration-300">
                {imageSrc?.endsWith(".mp4") ? (
                  <video
                    src={imageSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-8 w-8 object-contain"
                  />
                ) : imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={label}
                    width={28}
                    height={28}
                    className="h-[26px] w-[26px] object-contain"
                  />
                ) : (
                  <Icon
                    className={`h-5 w-5 transition-all duration-300 ${
                      iconClassName || "text-slate-700"
                    }`}
                  />
                )}
              </div>

              <span className="mt-1 hidden font-medium sm:block">{label}</span>
            </button>
          )
        )}

        {/* ACCOUNT */}
        <div className="relative">
          <button
            type="button"
            onClick={handleProfileClick}
            className="group flex flex-col items-center text-[10px] text-slate-700 transition-all duration-300 hover:text-black sm:text-xs"
          >
           <div className="relative flex h-8 w-8 items-center justify-center">
  <Image
    src="/Logo/jpl-profile-icon.png"
    alt="Profile"
    width={27}
    height={27}
    className="-translate-y-[2px] h-[27px] w-[27px] object-contain transition-transform duration-300 group-hover:scale-105"
  />
</div>

       <span className="mt-0.5 hidden font-medium leading-none sm:block">
              {!mounted
                ? "Account"
                : isLoading
                ? "Loading..."
                : isAuthenticated
                ? "Account"
                : "Login"}
            </span>
          </button>

          {mounted && open && isAuthenticated && (
            <div className="absolute right-0 z-50 mt-3 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  router.push("/account");
                }}
                className="block w-full px-4 py-3 text-left text-sm transition hover:bg-gray-550"
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