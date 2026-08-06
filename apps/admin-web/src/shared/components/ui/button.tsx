"use client";

import * as React from "react";

import { cn } from "@/shared/lib/cn";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "destructive";

type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  type = "button", // ✅ CRITICAL FIX
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const sizes: Record<Size, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "h-10 w-10 p-0 flex-shrink-0",
  };

  const variants: Record<Variant, string> = {
  primary:
    "bg-teal-600 text-white hover:bg-teal-700 shadow-md focus:ring-teal-500",

  secondary:
    "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm focus:ring-gray-400",

  outline:
    "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-400",

  ghost:
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-200",

  destructive:
    "bg-red-600 text-white hover:bg-red-700 shadow-md focus:ring-red-500",
};

  return (
    <button
      type={type} // ✅ CRITICAL FIX
      className={cn(
        base,
        sizes[size],
        variants[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="h-4 w-4 animate-spin text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />

            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>

          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}