"use client";

import { cn } from "@/shared/lib/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "default" | "success" | "danger";
}

export function Badge({
  children,
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const baseStyles =
    "text-xs px-2.5 py-1 rounded-full font-semibold inline-flex items-center tracking-wide";

  const variants = {
    default: "bg-slate-100 text-slate-700 border border-slate-200",
    success: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    danger: "bg-rose-100 text-rose-700 border border-rose-200",
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}