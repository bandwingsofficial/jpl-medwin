"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/shared/lib/cn";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50",
      className
    )}
    {...props}
  />
));

SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    side?: "top" | "right" | "bottom" | "left";
  }
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />

    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 bg-white shadow-lg",
        side === "top" &&
          "inset-x-0 top-0 border-b p-6",
        side === "bottom" &&
          "inset-x-0 bottom-0 border-t p-6",
        side === "left" &&
          "inset-y-0 left-0 h-full w-3/4 border-r p-6",
        side === "right" &&
          "inset-y-0 right-0 h-full w-3/4 border-l p-6",
        className
      )}
      {...props}
    >
      {children}

      <SheetClose className="absolute right-4 top-4">
        <X className="h-4 w-4" />
      </SheetClose>
    </SheetPrimitive.Content>
  </SheetPortal>
));

SheetContent.displayName = SheetPrimitive.Content.displayName;

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetOverlay,
  SheetPortal,
  SheetTrigger,
};