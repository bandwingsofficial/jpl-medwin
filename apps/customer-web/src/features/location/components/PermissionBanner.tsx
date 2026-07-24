"use client";

import {
  AlertTriangle,
  MapPinOff,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

import type {
  LocationPermissionState,
} from "../types/location.types";

interface PermissionBannerProps {
  permission: LocationPermissionState;
  onRetry?: () => void;
  className?: string;
}

export function PermissionBanner({
  permission,
  onRetry,
  className,
}: PermissionBannerProps) {
  if (
    permission === "granted" ||
    permission === "unknown"
  ) {
    return null;
  }

  const isDenied =
    permission === "denied";

  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        isDenied
          ? "border-amber-200 bg-amber-50"
          : "border-blue-200 bg-blue-50",
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}

        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            isDenied
              ? "bg-amber-100"
              : "bg-blue-100"
          )}
        >
          {isDenied ? (
            <MapPinOff className="h-6 w-6 text-amber-600" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-blue-600" />
          )}
        </div>

        {/* Content */}

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900">
            {isDenied
              ? "Location Permission Blocked"
              : "Location Permission Required"}
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {isDenied
              ? "Location access is currently blocked. You can still search manually or enable location permission in your browser settings."
              : "Allow location access for accurate delivery availability and nearby warehouse detection."}
          </p>

          {onRetry && (
            <Button
              type="button"
              variant="outline"
              onClick={onRetry}
              className="mt-4"
            >
              <RefreshCw className="mr-2 h-4 w-4" />

              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}