"use client";

import React, {
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const Dialog = ({
  open,
  children,
}: DialogProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) {
    return null;
  }

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[2147483647]
        flex
        items-center
        justify-center
      "
    >
      {/* OVERLAY */}
      <div
        className="
          absolute
          inset-0
          z-0
          bg-black/60
          backdrop-blur-sm
        "
      />

      {/* DIALOG CONTENT LAYER */}
      <div
        className="
          relative
          z-[1]
          flex
          w-full
          items-center
          justify-center
          px-4
        "
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export const DialogContent = ({
  children,
  className = "",
}: DialogContentProps) => {
  return (
    <div
      className={`
        relative
        w-full
        max-w-lg
        rounded-3xl
        bg-white
        shadow-2xl
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const DialogHeader = ({
  children,
  className = "",
}: DialogHeaderProps) => {
  return (
    <div
      className={`space-y-2 ${className}`}
    >
      {children}
    </div>
  );
};

export const DialogFooter = ({
  children,
  className = "",
}: DialogFooterProps) => {
  return (
    <div
      className={`
        flex
        items-center
        justify-end
        gap-3
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const DialogTitle = ({
  children,
  className = "",
}: DialogTitleProps) => {
  return (
    <h2
      className={`
        text-2xl
        font-bold
        text-black
        ${className}
      `}
    >
      {children}
    </h2>
  );
};

export const DialogDescription = ({
  children,
  className = "",
}: DialogDescriptionProps) => {
  return (
    <p
      className={`
        text-sm
        text-black/60
        ${className}
      `}
    >
      {children}
    </p>
  );
};