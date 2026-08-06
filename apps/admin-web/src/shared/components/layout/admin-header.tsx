"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/infrastructure/api/auth.api";
import { useAuthStore } from "@/shared/store/auth.store";
import { stopSilentRefresh } from "@/shared/lib/silent-refresh";
import { LogOut, Clock, Calendar, ChevronDown } from "lucide-react";

export function Header() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [open, setOpen] = useState(false);
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  // 🕒 LIVE TIME + DATE
  useEffect(() => {
    const updateTime = () => {
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

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // LOGOUT
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
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40 select-none">

      {/* LEFT: REPLACED SEARCH BAR WITH DASHBOARD BREADCRUMB */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Dashboard</span>
        <span className="text-xs font-medium text-slate-300">/</span>
        <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">Overview</span>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6">

        {/* METRIC CARD: LIVE CLOCK & CALENDAR */}
        <div className="hidden sm:flex items-center gap-3.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-700 border-r border-slate-200 pr-3">
            <Clock className="h-3.5 w-3.5 text-teal-600" />
            <span className="tabular-nums">{time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{date}</span>
          </div>
        </div>

        {/* PROFILE CONTROL ACCORDION */}
        <div
          className="relative flex items-center gap-3 cursor-pointer py-1.5 group"
          onClick={() => setOpen(!open)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="text-right hidden md:block">
            <p className="text-[13px] font-semibold text-slate-900 leading-tight">
              Admin
            </p>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">
              admin@example.com
            </p>
          </div>

          {/* AVATAR BADGE */}
          <div className="relative h-10 w-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl text-white flex items-center justify-center text-sm font-bold shadow-md shadow-teal-600/10 transition-transform duration-200 group-hover:scale-105">
            A
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>

          <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180 text-slate-600' : ''}`} />

          {/* DROP DOWN MENU */}
          {open && (
            <div className="absolute right-0 top-14 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
              <div className="px-3.5 py-2 border-b border-slate-50 md:hidden">
                <p className="text-xs font-semibold text-slate-900">Admin</p>
                <p className="text-[10px] text-slate-400 truncate">admin@example.com</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50/60 transition-colors"
              >
                <LogOut size={14} />
                <span>Logout Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}