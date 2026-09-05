"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { logout } from "@/infrastructure/api/auth.api";
import { useAuthStore } from "@/shared/store/auth.store";
import { stopSilentRefresh } from "@/shared/lib/silent-refresh";

interface PageHeaderConfig {
  section: string;
  title: string;
}

const pageHeaderConfig: Record<string, PageHeaderConfig> = {
  "/dashboard": {
    section: "Dashboard",
    title: "Overview",
  },
  "/products": {
    section: "Products",
    title: "Product Management",
  },
  "/orders": {
    section: "Orders",
    title: "Order Management",
  },
  "/customers": {
    section: "Customers",
    title: "Customer Management",
  },
  "/categories": {
    section: "Categories",
    title: "Category Management",
  },
  "/sub-categories": {
    section: "Subcategories",
    title: "Subcategory Management",
  },
  "/mini": {
    section: "Mini-Categories",
    title: "Mini Category Management",
  },
  "/brands": {
    section: "Brands",
    title: "Brand Management",
  },
  "/coupons": {
    section: "Coupons",
    title: "Coupon Management",
  },
  "/coins": {
    section: "Coins",
    title: "Coin Management",
  },
  "/collections": {
    section: "Collections",
    title: "Collection Management",
  },
  "/banners": {
    section: "Banners",
    title: "Banner Management",
  },
  "/returns": {
    section: "Order Returns",
    title: "Return Management",
  },
};

const defaultPageHeader: PageHeaderConfig = {
  section: "Admin Panel",
  title: "Management",
};

interface HeaderProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function Header({
  isSidebarCollapsed,
  onToggleSidebar,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const currentPage =
    Object.entries(pageHeaderConfig)
      .sort(([firstPath], [secondPath]) => secondPath.length - firstPath.length)
      .find(([path]) => {
        if (path === "/dashboard") {
          return pathname === path;
        }

        return pathname === path || pathname.startsWith(`${path}/`);
      })?.[1] ?? defaultPageHeader;

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      setDate(
        now.toLocaleDateString([], {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      );
    };

    updateDateTime();

    const intervalId = window.setInterval(updateDateTime, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleAccountMenuToggle = () => {
    setIsAccountMenuOpen((previousState) => !previousState);
  };

  return (
  <header className="sticky top-0 z-40 h-20 border-b border-slate-200/70 bg-white/95 px-5 backdrop-blur-xl sm:px-8">
    <div className="flex h-full items-center justify-between gap-6">

      {/* LEFT SIDE */}
      <div className="flex min-w-0 items-center gap-3">

        {/* SIDEBAR TOGGLE */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={
            isSidebarCollapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          title={
            isSidebarCollapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600 active:scale-95"
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="h-5 w-5 transition-transform duration-200 group-hover:scale-105" />
          ) : (
            <PanelLeftClose className="h-5 w-5 transition-transform duration-200 group-hover:scale-105" />
          )}
        </button>

        {/* CURRENT PAGE CONTEXT */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="hidden h-10 w-1 rounded-full bg-teal-600 sm:block" />

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              {currentPage.section}
            </p>

            <div className="mt-0.5 flex items-center gap-2">
              <span className="truncate text-base font-bold text-slate-800">
                {currentPage.title}
              </span>

              <span className="hidden text-xs text-slate-300 sm:inline">
                /
              </span>

              <span className="hidden text-xs font-medium text-slate-400 sm:inline">
                Admin Panel
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex shrink-0 items-center gap-3 sm:gap-5">

        {/* DATE & TIME */}
        <div className="hidden items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 shadow-sm md:flex">

          {/* TIME */}
          <div className="flex items-center gap-2 border-r border-slate-200 px-4 py-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <Clock3 className="h-3.5 w-3.5" />
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Current Time
              </p>

              <p className="mt-0.5 text-xs font-bold tabular-nums text-slate-700">
                {time}
              </p>
            </div>
          </div>

          {/* DATE */}
          <div className="flex items-center gap-2 px-4 py-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <CalendarDays className="h-3.5 w-3.5" />
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Today
              </p>

              <p className="mt-0.5 whitespace-nowrap text-xs font-semibold text-slate-600">
                {date}
              </p>
            </div>
          </div>
        </div>

        {/* ACCOUNT */}
        <div ref={accountMenuRef} className="relative">
          <button
            type="button"
            onClick={handleAccountMenuToggle}
            aria-expanded={isAccountMenuOpen}
            aria-label="Open account menu"
            className="group flex items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition-all duration-200 hover:border-slate-200 hover:bg-slate-50"
          >

            {/* ACCOUNT ICON */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-lg shadow-teal-600/15 transition-transform duration-200 group-hover:scale-105">
              <UserRound className="h-5 w-5" />

              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            {/* ACCOUNT DETAILS */}
            <div className="hidden text-left lg:block">
              <p className="text-sm font-semibold leading-tight text-slate-800">
                Admin
              </p>

              <p className="mt-1 text-xs text-slate-400">
                admin@example.com
              </p>
            </div>

            <ChevronDown
              className={`hidden h-4 w-4 text-slate-400 transition-transform duration-200 sm:block ${
                isAccountMenuOpen
                  ? "rotate-180 text-slate-700"
                  : ""
              }`}
            />
          </button>

          {/* ACCOUNT DROPDOWN */}
          {isAccountMenuOpen && (
            <div className="absolute right-0 top-[calc(100%+10px)] w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">

              {/* ACCOUNT INFO */}
              <div className="border-b border-slate-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      Admin
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      admin@example.com
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-lg border border-teal-100 bg-teal-50/60 px-3 py-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-teal-600" />

                  <span className="text-xs font-medium text-teal-700">
                    Administrator Account
                  </span>
                </div>
              </div>

              {/* LOGOUT */}
              <div className="p-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-rose-600 transition-colors duration-200 hover:bg-rose-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50">
                    <LogOut className="h-4 w-4" />
                  </div>

                  <div>
                    <p>Logout</p>

                    <p className="mt-0.5 text-[11px] font-medium text-rose-400">
                      End your current session
                    </p>
                  </div>
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

    </div>
  </header>
);
}