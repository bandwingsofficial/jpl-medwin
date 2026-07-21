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
  GitFork,
  Layers,
  Tag,
  BadgeCheck,
  Ticket,
  Coins,
  LogOut,
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
  { name: "Subcategories", href: "/sub-categories", icon: GitFork }, 
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
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen select-none shadow-xl">
      
      
<div className="flex-none px-1 py-1 border-b border-slate-800 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
  {/* The container is now justify-center and has a much larger height/width to scale the logo */}
  <div className="relative h-20 w-48 flex items-center justify-center">
    <Image
      src="/Logo/Jpl_Logo.png"
      alt="JPL Medwin Logo"
      fill
      sizes="(max-width: 768px) 100vw, 250px" // Adjusted sizes hint for performance
      className="object-contain transition-transform duration-200 hover:scale-[1.02]"
      priority
    />
  </div>
</div>

      {/* 🧭 NAVIGATION ROUTE ITEM CONTAINER */}
      <div className="flex-1 overflow-y-auto pt-5 px-4 space-y-1.5 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 tracking-normal",
                  active
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/10 font-semibold"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                )}
              >
                {/* ICON */}
                <Icon
                  size={18}
                  className={cn(
                    "transition-transform duration-200 group-hover:scale-105",
                    active ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                  )}
                />

                <span className="flex-1 truncate">{item.name}</span>

                {/* ACTIVE LEFT FLUID BAR VERTICAL PIN */}
                {active && (
                  <span className="absolute left-0 top-1/4 h-1/2 w-1 bg-white rounded-r-md" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 🛑 DESTRUCTIVE SESSION LOGOUT BUTTON FOOTER */}
      <div className="flex-none p-4 border-t border-slate-800 bg-slate-900">
        <button
          onClick={handleLogout}
          className="
            w-full 
            flex 
            items-center 
            justify-center 
            gap-2.5 
            px-4 
            py-3 
            text-sm 
            font-medium
            rounded-xl 
            bg-slate-800
            text-slate-300
            border
            border-slate-700/50
            transition-all 
            duration-200
            hover:bg-rose-600/10 
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