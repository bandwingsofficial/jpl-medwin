"use client";

import * as React from "react";
import { cn } from "@/shared/lib/cn";

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "w-full px-4 py-2 rounded-lg text-sm appearance-none",
            "border transition-all",
            "bg-white text-gray-900",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-purple-500",
            "focus:outline-none focus:ring-2",
            "pr-10", // space for arrow
            className
          )}
          {...props}
        >
          {children}
        </select>

        {/* custom arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
          ▼
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";