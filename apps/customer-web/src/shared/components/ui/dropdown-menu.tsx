"use client";

import * as React from "react";

interface DropdownMenuProps {
  children: React.ReactNode;
}

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Clone children to seamlessly pass open state and toggle actions down
  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        if (child.type === DropdownMenuTrigger) {
          return React.cloneElement(child as React.ReactElement<any>, {
            onClick: () => setIsOpen((prev) => !prev),
          });
        }

        if (child.type === DropdownMenuContent) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isOpen,
            closeMenu: () => setIsOpen(false),
          });
        }

        return child;
      })}
    </div>
  );
};

/* -------------------------------------------------------------------------- */

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: () => void;
}

export const DropdownMenuTrigger = ({ children, onClick }: DropdownMenuTriggerProps) => {
  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        onClick?.();
      },
    });
  }
  return <button onClick={onClick}>{children}</button>;
};

/* -------------------------------------------------------------------------- */

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "end";
  isOpen?: boolean;
  closeMenu?: () => void;
}

export const DropdownMenuContent = ({
  children,
  className = "",
  align = "end",
  isOpen,
  closeMenu,
}: DropdownMenuContentProps) => {
  if (!isOpen) return null;

  const alignmentClass = align === "end" ? "right-0" : "left-0";

  return (
    <div
      className={`
        absolute mt-2 z-50
        min-w-[8rem] overflow-hidden rounded-xl border border-gray-100 
        bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
        ${alignmentClass} 
        ${className}
      `}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Explicitly cast to target typing to resolve 'child.props' is of type 'unknown' error
          const typedChild = child as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
          
          return React.cloneElement(typedChild, {
            onClick: (e: React.MouseEvent) => {
              // Execute the original onClick handler (e.g., router navigation or item action)
              typedChild.props.onClick?.(e);
              // Cleanly close the menu after the click completes
              closeMenu?.();
            },
          });
        }
        return child;
      })}
    </div>
  );
};

/* -------------------------------------------------------------------------- */

interface DropdownMenuItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const DropdownMenuItem = ({
  children,
  className = "",
  onClick,
}: DropdownMenuItemProps) => {
  return (
    <div
      role="menuitem"
      onClick={onClick}
      className={`
        relative flex cursor-pointer select-none items-center 
        rounded-lg px-3 py-2 text-sm outline-none transition-colors 
        hover:bg-gray-50 focus:bg-gray-50
        ${className}
      `}
    >
      {children}
    </div>
  );
};