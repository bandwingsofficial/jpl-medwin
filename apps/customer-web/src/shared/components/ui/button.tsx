"use client";

import * as React from "react";
import { cn } from "@/shared/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  loading,
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";

  const variants = {
    primary:
      "bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200",
    outline:
      "border border-gray-300 bg-white hover:bg-gray-50",
    ghost:
      "hover:bg-gray-100 text-gray-700",
  };

  return (
    <button
      className={cn(base, variants[variant], "px-4 py-2", className)}
      {...props}
    >
      {loading && (
        <span className="mr-2 h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
      )}
      {children}
    </button>
  );
}