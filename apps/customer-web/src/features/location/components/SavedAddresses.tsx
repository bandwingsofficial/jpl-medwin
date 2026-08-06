"use client";

import {
  CheckCircle2,
  Home,
  Building2,
  MapPin,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

import type { SavedLocation } from "../types/location.types";

interface SavedAddressesProps {
  addresses: SavedLocation[];
  onSelect: (address: SavedLocation) => void;
  className?: string;
}

export function SavedAddresses({
  addresses,
  onSelect,
  className,
}: SavedAddressesProps) {
  if (addresses.length === 0) {
    return null;
  }

  return (
    <section className={cn("space-y-4", className)}>
      {/* Header */}

      <div className="flex items-center gap-2">
        <Home className="h-5 w-5 text-teal-600" />

        <h3 className="text-sm font-semibold text-slate-900">
          Saved Addresses
        </h3>
      </div>

      {/* List */}

      <div className="space-y-3">
        {addresses.map((address) => {
          const Icon =
            address.label.toLowerCase() === "office"
              ? Building2
              : Home;

          return (
            <Button
              key={address.id}
              type="button"
              variant="ghost"
              onClick={() => onSelect(address)}
              className={cn(
                "relative flex h-auto w-full items-start justify-start rounded-2xl border border-slate-200 px-4 py-4",
                "hover:border-teal-200 hover:bg-teal-50"
              )}
            >
              {/* Icon */}

              <div
                className={cn(
                  "mr-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                  "bg-slate-100"
                )}
              >
                <Icon className="h-5 w-5 text-teal-600" />
              </div>

              {/* Content */}

              <div className="min-w-0 flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">
                    {address.label}
                  </span>

                  {address.isDefault && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  )}
                </div>

                <div className="mt-2 flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-700">
                      {address.location.city},{" "}
                      {address.location.state}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {address.location.formatted}
                    </p>
                  </div>
                </div>
              </div>

              {/* Default Badge */}

              {address.isDefault && (
                <span
                  className={cn(
                    "absolute right-4 top-4 rounded-full",
                    "bg-emerald-100 px-2 py-1",
                    "text-[10px] font-semibold text-emerald-700"
                  )}
                >
                  Default
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </section>
  );
}