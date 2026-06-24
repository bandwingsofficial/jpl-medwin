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
    <input
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="Enter 6-digit OTP"
      inputMode="numeric"
      className={cn(
        "w-full px-4 py-2 text-center tracking-[0.3em]",
        "border border-gray-300 rounded-lg",
        "focus:outline-none focus:ring-2 focus:ring-purple-500",
        "text-lg font-medium"
      )}
    />
  );
}