"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/shared/lib/cn";
import { logout } from "@/infrastructure/api/auth.api";
import { useAuthStore } from "@/shared/store/auth.store";
import { stopSilentRefresh } from "@/shared/lib/silent-refresh";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Folder,
  Layers,
  Tag,
  Ticket,
  Coins,
  LogOut,
  Network,
  LayoutGrid,
  GalleryHorizontalEnd,
  RotateCcw,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Categories", href: "/categories", icon: Folder },
  { name: "Subcategories", href: "/sub-categories", icon: Network }, 
  { name: "Mini-Categories", href: "/mini", icon: Layers }, 
  { name: "Brands", href: "/brands", icon: Tag }, 
  { name: "Coupons", href: "/coupons", icon: Ticket },
  { name: "Coins", href: "/coins", icon: Coins },
  { name: "Collections", href: "/collections", icon: LayoutGrid },
  { name: "Banners", href: "/banners", icon: GalleryHorizontalEnd },
  { name: "Order-Returns", href: "/returns", icon: RotateCcw },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      stopSilentRefresh();
      clearAuth();
      router.replace("/login");
    }
  };

  return (
    <aside className="w-64 bg-[#0B0F19] border-r border-slate-800/80 flex flex-col h-screen select-none shadow-2xl">
      
      {/* 🖼️ LOGO CONTAINER WITH MATCHING BACKGROUND SURFACE */}
      <div className="flex-none border-b border-slate-800/60 bg-[#0B0F19] w-full">
        <div className="relative w-full h-20">
          <Image
            src="/Logo/Jpl_Logo.png"
            alt="JPL Medwin Logo"
            fill
            sizes="(max-width: 768px) 100vw, 250px"
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </div>

      {/* 🧭 NAVIGATION ROUTE ITEM CONTAINER */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-200 tracking-normal",
                  active
                    ? "bg-teal-500/10 text-teal-400 font-semibold border border-teal-500/20 shadow-sm"
                    : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                )}
              >
                {/* ICON */}
                <Icon
                  size={18}
                  className={cn(
                    "transition-transform duration-200 group-hover:scale-105",
                    active ? "text-teal-400" : "text-slate-400 group-hover:text-slate-300"
                  )}
                />

                <span className="flex-1 truncate">{item.name}</span>

                {/* ACTIVE LEFT FLUID BAR VERTICAL PIN */}
                {active && (
                  <span className="absolute left-0 top-1/4 h-1/2 w-1 bg-teal-500 rounded-r-md shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 🛑 DESTRUCTIVE SESSION LOGOUT BUTTON FOOTER */}
      <div className="flex-none p-3.5 border-t border-slate-800/60 bg-[#0B0F19]">
        <button
          onClick={handleLogout}
          className="
            w-full 
            flex 
            items-center 
            justify-center 
            gap-2.5 
            px-4 
            py-2.5 
            text-sm 
            font-medium
            rounded-xl 
            bg-slate-900/80
            text-slate-300
            border
            border-slate-800
            transition-all 
            duration-200
            hover:bg-rose-500/10 
            hover:text-rose-400 
            hover:border-rose-500/20
            active:scale-[0.98]
          "
        >
          <LogOut size={16} className="transition-transform duration-200" />
          <span>Logout</span>
        </button>
      </div>
      
    </aside>
  );
}