"use client";

import { cn } from "@/shared/lib/cn";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function TotpInput({ value, onChange }: Props) {
  const handleChange = (v: string) => {
    const cleaned = v.replace(/\D/g, "").slice(0, 6);
    onChange(cleaned);
  };

  return (
    <div className="w-full space-y-3">
      <div className="relative">
        <input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="000000"
          inputMode="numeric"
          maxLength={6}
          className={cn(
            "w-full h-11 text-center font-mono tracking-[0.5em] pl-[0.5em]",
            "bg-white/[0.02] border border-white/10 rounded-md",
            "text-[#F5A623] placeholder:text-slate-700",
            "text-xl font-semibold transition-all focus:outline-none",
            "focus:bg-white/[0.04] focus:border-teal-400/60 focus:ring-[3px] focus:ring-teal-400/5"
          )}
        />
      </div>

      {/* Simplified, low-profile progress indicator lines */}
      <div className="flex items-center justify-center gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-0.5 w-4 rounded-full transition-colors duration-200",
              i < value.length ? "bg-teal-400" : "bg-white/10"
            )}
          />
        ))}
      </div>
    </div>
  );
}