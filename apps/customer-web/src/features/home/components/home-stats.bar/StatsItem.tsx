"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatsItemProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  href: string;
  isLast: boolean;
  color: string;
  bg: string;
}

export function StatsItem({
  icon: Icon,
  title,
  subtitle,
  href,
  isLast,
  color,
  bg,
}: StatsItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-[82px] items-center gap-4 px-6 transition-all duration-300",

        !isLast &&
          "after:absolute after:right-0 after:top-1/2 after:h-10 after:w-px after:-translate-y-1/2 after:bg-slate-200"
      )}
    >
      {/* Icon */}

      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110",
          bg
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5 transition-all duration-300 group-hover:scale-110",
            color
          )}
          strokeWidth={1.8}
        />
      </div>

      {/* Content */}

      <div className="flex-1">
        <h3
          className={cn(
            "text-[11px] font-bold uppercase tracking-[0.12em] text-slate-800 transition-colors duration-300",
            color.replace("text-", "group-hover:text-")
          )}
        >
          {title}
        </h3>

        <p className="mt-1 text-[10px] leading-4 text-slate-500">
          {subtitle}
        </p>
      </div>
    </Link>
  );
}