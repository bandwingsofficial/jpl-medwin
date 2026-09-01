"use client";

import { ReactNode, useEffect, useState } from "react";

import { createPortal } from "react-dom";

import { cn } from "@/shared/lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  children,
  className,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !open) return null;

  return createPortal(
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(
            `
            w-full
            max-w-2xl
            rounded-2xl
            bg-white
            shadow-2xl
            overflow-hidden
            `,
            className
          )}
        >
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}