"use client";

import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

import { cn } from "@/shared/lib/cn";

import { useToastStore } from "@/shared/store/toast.store";

export function Toast() {
  const {
    message,
    type,
    visible,
    hideToast,
  } = useToastStore();

  if (!visible) {
    return null;
  }

  const styles = {
    success: {
      container:
        "border-green-200 bg-green-50",

      icon: "text-green-600",

      Icon: CheckCircle2,
    },

    error: {
      container:
        "border-red-200 bg-red-50",

      icon: "text-red-600",

      Icon: AlertCircle,
    },

    warning: {
      container:
        "border-yellow-200 bg-yellow-50",

      icon: "text-yellow-600",

      Icon: AlertTriangle,
    },

    info: {
      container:
        "border-blue-200 bg-blue-50",

      icon: "text-blue-600",

      Icon: Info,
    },
  };

  const currentStyle =
    styles[type];

  const Icon =
    currentStyle.Icon;

  return (
    <div
      className="
        fixed
        top-4
        right-4
        z-[9999]
        animate-in
        slide-in-from-top-2
        duration-300
      "
    >
      <div
        className={cn(
          `
            flex
            min-w-[320px]
            max-w-[420px]
            items-start
            gap-3
            rounded-xl
            border
            px-4
            py-3
            shadow-lg
            backdrop-blur-sm
          `,
          currentStyle.container
        )}
      >
        <Icon
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0",
            currentStyle.icon
          )}
        />

        <div className="flex-1">
          <p
            className="
              text-sm
              font-medium
              text-gray-900
            "
          >
            {message}
          </p>
        </div>

        <button
          onClick={
            hideToast
          }
          className="
            text-gray-400
            transition-colors
            hover:text-gray-700
          "
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}