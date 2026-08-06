"use client";

import {
  ReactNode,
  useEffect,
} from "react";

import { X } from "lucide-react";

import { cn } from "@/shared/lib/cn";

interface Props {
  open: boolean;

  onClose: () => void;

  title?: string;

  children: ReactNode;

  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: Props) {
  // ========================================
  // ESC CLOSE
  // ========================================

  useEffect(() => {
    function handleEscape(
      e: KeyboardEvent
    ) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      document.body.style.overflow =
        "hidden";

      window.addEventListener(
        "keydown",
        handleEscape
      );
    }

    return () => {
      document.body.style.overflow =
        "auto";

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open, onClose]);

  // ========================================
  // CLOSED
  // ========================================

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      {/* OVERLAY */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className={cn(
          "relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border bg-white shadow-2xl",
          className
        )}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            {title && (
              <h2 className="text-xl font-semibold tracking-tight">
                {title}
              </h2>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="max-h-[80vh] overflow-y-auto px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}