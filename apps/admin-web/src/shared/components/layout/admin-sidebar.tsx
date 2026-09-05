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
  ShoppingBag,
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
    name: "Abandoned Checkouts",
    href: "/checkouts",
    icon: ShoppingBag,
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

interface SidebarProps {
  isCollapsed: boolean;
}

export function Sidebar({ isCollapsed }: SidebarProps) {
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
   <aside
  className={cn(
    "relative flex h-screen shrink-0 flex-col overflow-hidden border-r border-white/40 shadow-2xl transition-[width] duration-300 ease-in-out",
    isCollapsed ? "w-20" : "w-64"
  )}  style={{
        background:
          "linear-gradient(160deg, #ffffff 0%, #ffffff 10%, #f0fbf9 20%, #eaf8f2 30%, #f0faea 40%, #f7fbe9 50%, #fdf9ec 60%, #fdf3ec 70%, #f6eef9 80%, #f0eefb 90%, #ffffff 100%)",
      }}
    >
      {/* soft color blobs for extra depth */}
      <div
        className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #2dd4bf, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute right-[-4rem] top-1/3 h-64 w-64 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #a78bfa, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -left-10 bottom-24 h-56 w-56 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #facc15, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute right-[-3rem] bottom-[-3rem] h-56 w-56 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #60a5fa, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute left-1/3 top-1/2 h-48 w-48 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #4ade80, transparent 70%)" }}
      />

   {/* LOGO / BRAND */}
<div
  className={cn(
    "relative z-10 flex h-20 w-full shrink-0 items-center justify-center overflow-hidden border-b border-slate-900/10 bg-white/50 backdrop-blur-sm transition-all duration-300",
    isCollapsed ? "px-1" : "px-0"
  )}
>
  <Image
    src="/Logo/jpl_logo.png"
    alt="JPL Medwin Logo"
    width={260}
    height={80}
    priority
    className={cn(
      "h-auto object-contain transition-transform duration-300",
      isCollapsed
        ? "w-14"
        : "w-[240px]"
    )}
  />
</div>
      {/* ADMIN PANEL LABEL */}
      <div
  className={cn(
    "relative z-10 shrink-0 overflow-hidden transition-all duration-300",
    isCollapsed
      ? "h-0 px-0 py-0 opacity-0"
      : "px-5 pb-2 pt-5 opacity-100"
  )}
>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]" />

          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
            Administration
          </span>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="relative z-10 flex-1 overflow-y-auto px-3 pb-4 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = isRouteActive(item.href);
            const Icon = item.icon;

            return (
              <Link
  key={item.href}
  href={item.href}
  title={isCollapsed ? item.name : undefined}
  className={cn(
    "group relative flex items-center rounded-xl py-3 text-[13px] font-medium transition-all duration-200",
    isCollapsed
      ? "justify-center px-2"
      : "gap-3 px-3.5", active
                    ? "border border-teal-500/30 bg-white/80 text-teal-700 shadow-sm shadow-black/5 backdrop-blur-sm"
                    : "border border-transparent text-slate-600 hover:border-white/60 hover:bg-white/60 hover:text-slate-900"
                )}
              >
                {/* ACTIVE INDICATOR */}
                {active && (
                  <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.6)]" />
                )}

                {/* ICON */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                    active
                      ? "bg-teal-400/20 text-teal-700"
                      : "text-slate-500 group-hover:bg-white/80 group-hover:text-slate-800"
                  )}
                >
                  <Icon
                    size={17}
                    strokeWidth={active ? 2.2 : 1.8}
                    className="transition-transform duration-200 group-hover:scale-105"
                  />
                </div>

                {/* LABEL */}
                <span
  className={cn(
    "truncate transition-all duration-300",
    isCollapsed
      ? "w-0 flex-none overflow-hidden opacity-0"
      : "flex-1 opacity-100"
  )}
>
  {item.name}
</span>

                {/* ACTIVE DOT */}
                {active && !isCollapsed && (
  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
)}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 shrink-0 border-t border-slate-900/10 bg-white/50 p-3 backdrop-blur-sm">
        {/* ADMIN SESSION */}
        <div
  className={cn(
    "mb-3 flex items-center rounded-xl border border-slate-900/10 bg-white/70 py-2.5 transition-all duration-300",
    isCollapsed
      ? "justify-center px-2"
      : "gap-3 px-3"
  )}
  title={isCollapsed ? "Admin Session" : undefined}
>
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/15 text-teal-700">
            <Users size={15} />

            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>

         <div
  className={cn(
    "min-w-0 overflow-hidden transition-all duration-300",
    isCollapsed
      ? "w-0 opacity-0"
      : "w-auto opacity-100"
  )}
>
  <p className="truncate text-xs font-semibold text-slate-800">
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
  title={isCollapsed ? "Logout" : undefined}
  className={cn(
    "group flex w-full items-center rounded-xl border border-slate-900/10 bg-white/70 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-rose-400/40 hover:bg-rose-50 hover:text-rose-500 active:scale-[0.98]",
    isCollapsed
      ? "justify-center px-2"
      : "justify-center gap-2.5 px-4"
  )}
>
          <LogOut
            size={16}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />

          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}