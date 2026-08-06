"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LocationSkeletonProps {
  className?: string;
}

export function LocationSkeleton({
  className,
}: LocationSkeletonProps) {
  return (
    <div
      className={cn(
        "space-y-6",
        className
      )}
    >
      {/* Current Location Card */}

      <div className="rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-36" />

            <Skeleton className="h-3 w-56" />
          </div>

          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      </div>

      {/* Search */}

      <Skeleton className="h-11 w-full rounded-xl" />

      {/* Popular Cities */}

      <div className="space-y-3">
        <Skeleton className="h-5 w-36" />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-11 rounded-xl"
            />
          ))}
        </div>
      </div>

      {/* Recent Locations */}

      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />

        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-xl border p-3"
          >
            <Skeleton className="h-10 w-10 rounded-full" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-44" />

              <Skeleton className="h-3 w-60" />
            </div>
          </div>
        ))}
      </div>

      {/* Saved Addresses */}

      <div className="space-y-3">
        <Skeleton className="h-5 w-44" />

        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-2xl border p-4"
          >
            <Skeleton className="h-12 w-12 rounded-xl" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-28" />

              <Skeleton className="h-3 w-56" />

              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}