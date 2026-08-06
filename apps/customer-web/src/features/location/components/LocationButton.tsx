"use client";

import { ChevronDown, Loader2, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";

import type { LocationData } from "../types/location.types";

interface LocationButtonProps {
  location: LocationData | null;
  loading?: boolean;
  onClick: () => void;
  className?: string;
}

export function LocationButton({
  location,
  loading = false,
  onClick,
  className,
}: LocationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Select delivery location"
      className={cn(
        "group flex w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm",
        "transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-teal-500/20",
        "active:scale-[0.98]",
        className
      )}
    >
      {/* Icon */}

      <div
        className={cn(
          "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
          "bg-gradient-to-br from-teal-50 to-emerald-100",
          "transition-all duration-300",
          "group-hover:scale-105 group-hover:shadow-md"
        )}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
        ) : (
          <>
            <MapPin className="h-5 w-5 text-teal-600" />

            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </>
        )}
      </div>

      {/* Content */}

      <div className="min-w-0 flex-1 text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
          Deliver To
        </p>

        {loading ? (
          <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">
            Detecting your location...
          </p>
        ) : location ? (
          <>
            <p className="mt-0.5 truncate text-[15px] font-semibold text-slate-900">
              {location.locality || location.city}
            </p>

            <p className="truncate text-xs text-slate-500">
              {[
                location.city,
                location.postalCode,
              ]
                .filter(Boolean)
                .join(" • ")}
            </p>
          </>
        ) : (
          <>
            <p className="mt-0.5 text-sm font-semibold text-slate-900">
              Choose Location
            </p>

            <p className="text-xs text-slate-500">
              Check delivery availability
            </p>
          </>
        )}
      </div>

      {/* Chevron */}

      <ChevronDown
        className={cn(
          "h-5 w-5 shrink-0 text-slate-400",
          "transition-all duration-300",
          "group-hover:translate-y-0.5 group-hover:text-teal-600"
        )}
      />
    </button>
  );
}