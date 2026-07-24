"use client";

import { Loader2, MapPin, Navigation } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

import type { LocationData } from "../types/location.types";

interface CurrentLocationCardProps {
  location: LocationData | null;
  loading?: boolean;
  onUseCurrentLocation: () => void | Promise<void>;
}

export function CurrentLocationCard({
  location,
  loading = false,
  onUseCurrentLocation,
}: CurrentLocationCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-br",
        "from-teal-50 via-white to-cyan-50"
      )}
    >
      <div className="flex items-center gap-4 p-5">
        {/* Icon */}

        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
            "bg-teal-600 text-white shadow-lg shadow-teal-600/20"
          )}
        >
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Navigation className="h-6 w-6" />
          )}
        </div>

        {/* Content */}

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-slate-900">
            Use Current Location
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Detect your current location using GPS for
            faster and more accurate delivery estimates.
          </p>

          {location && (
            <div className="mt-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-teal-600" />

              <span className="truncate text-sm font-medium text-slate-700">
                {location.city}, {location.state}
              </span>
            </div>
          )}
        </div>

        {/* Action */}

        <Button
          type="button"
          disabled={loading}
          onClick={onUseCurrentLocation}
          className={cn(
            "rounded-xl px-5",
            "bg-teal-600 hover:bg-teal-700"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Detecting...
            </>
          ) : (
            "Use"
          )}
        </Button>
      </div>
    </div>
  );
}