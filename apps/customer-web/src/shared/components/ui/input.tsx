"use client";

import * as React from "react";
import { cn } from "@/shared/lib/cn";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full px-3 py-2 rounded-lg text-sm",
          "bg-white text-gray-900 placeholder:text-gray-400",
          "border transition-all",

          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500",

          "focus:outline-none focus:ring-2",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";