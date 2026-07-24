"use client";

import { Clock3, MapPin, Trash2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

import type { RecentLocation } from "../types/location.types";

interface RecentLocationsProps {
  locations: RecentLocation[];
  onSelect: (location: RecentLocation) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export function RecentLocations({
  locations,
  onSelect,
  onDelete,
  className,
}: RecentLocationsProps) {
  const recentLocations = locations.slice(0, 5);

  if (recentLocations.length === 0) {
    return null;
  }

  return (
    <section className={cn("space-y-4", className)}>
      {/* Header */}

      <div className="flex items-center gap-2">
        <Clock3 className="h-5 w-5 text-teal-600" />

        <h3 className="text-sm font-semibold text-slate-900">
          Recent Locations
        </h3>
      </div>

      {/* List */}

      <div className="space-y-2">
        {recentLocations.map((item) => (
          <div
            key={item.id}
            className="group flex items-center gap-2 rounded-xl hover:bg-slate-50"
          >
            <Button
              type="button"
              variant="ghost"
              onClick={() => onSelect(item)}
              className={cn(
                "flex h-auto flex-1 items-start justify-start gap-3 rounded-xl px-4 py-3"
              )}
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />

              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium text-slate-900">
                  {item.location.locality
                    ? `${item.location.locality}, ${item.location.city}`
                    : `${item.location.city}, ${item.location.state}`}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {item.location.postalCode
                    ? `${item.location.postalCode} • ${item.location.state}`
                    : item.location.formatted}
                </p>
              </div>
            </Button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="mr-3 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
              aria-label="Delete recent location"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}