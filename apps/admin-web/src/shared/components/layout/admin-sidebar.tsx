"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  Coins,
  Folder,
  GalleryHorizontalEnd,
  LayoutDashboard,
  LayoutGrid,
  Layers,
  LogOut,
  Network,
  Package,
  RotateCcw,
  ShoppingCart,
  Tag,
  Ticket,
  Users,
} from "lucide-react";

import { logout } from "@/infrastructure/api/auth.api";
import { useAuthStore } from "@/shared/store/auth.store";
import { cn } from "@/shared/lib/cn";
import { stopSilentRefresh } from "@/shared/lib/silent-refresh";

interface NavigationItem {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/products",
    icon: Package,
  },
  {
    name: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    name: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    name: "Categories",
    href: "/categories",
    icon: Folder,
  },
  {
    name: "Subcategories",
    href: "/sub-categories",
    icon: Network,
  },
  {
    name: "Mini-Categories",
    href: "/mini",
    icon: Layers,
  },
  {
    name: "Brands",
    href: "/brands",
    icon: Tag,
  },
  {
    name: "Coupons",
    href: "/coupons",
    icon: Ticket,
  },
  {
    name: "Coins",
    href: "/coins",
    icon: Coins,
  },
  {
    name: "Collections",
    href: "/collections",
    icon: LayoutGrid,
  },
  {
    name: "Banners",
    href: "/banners",
    icon: GalleryHorizontalEnd,
  },
  {
    name: "Order Returns",
    href: "/returns",
    icon: RotateCcw,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      stopSilentRefresh();
      clearAuth();
      router.replace("/login");
    }
  };

  const isRouteActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col overflow-hidden border-r border-slate-800/80 bg-[#0B0F19] shadow-2xl">
     {/* LOGO / BRAND */}
<div className="relative h-20 w-full shrink-0 overflow-hidden border-b border-slate-800/70">
  <Image
    src="/Logo/jpl_logo.png"
    alt="JPL Medwin Logo"
    fill
    sizes="256px"
    className="object-cover"
    priority
  />
</div>

      {/* ADMIN PANEL LABEL */}
      <div className="shrink-0 px-5 pb-2 pt-5">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]" />

          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Administration
          </span>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = isRouteActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-medium transition-all duration-200",
                  active
                    ? "border border-teal-500/20 bg-teal-500/10 text-teal-300 shadow-sm shadow-black/20"
                    : "border border-transparent text-slate-400 hover:bg-slate-800/70 hover:text-slate-100"
                )}
              >
                {/* ACTIVE INDICATOR */}
                {active && (
                  <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.7)]" />
                )}

                {/* ICON */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                    active
                      ? "bg-teal-400/10 text-teal-300"
                      : "text-slate-500 group-hover:bg-slate-700/60 group-hover:text-slate-200"
                  )}
                >
                  <Icon
                    size={17}
                    strokeWidth={active ? 2.2 : 1.8}
                    className="transition-transform duration-200 group-hover:scale-105"
                  />
                </div>

                {/* LABEL */}
                <span className="flex-1 truncate">{item.name}</span>

                {/* ACTIVE DOT */}
                {active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* FOOTER */}
      <div className="shrink-0 border-t border-slate-800/70 bg-[#0A0E17] p-3">
        {/* ADMIN SESSION */}
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2.5">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
            <Users size={15} />

            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0A0E17] bg-emerald-400" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-200">
              Admin Session
            </p>

            <p className="mt-0.5 truncate text-[10px] text-slate-500">
              Administrator Access
            </p>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-rose-500/25 hover:bg-rose-500/10 hover:text-rose-400 active:scale-[0.98]"
        >
          <LogOut
            size={16}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}