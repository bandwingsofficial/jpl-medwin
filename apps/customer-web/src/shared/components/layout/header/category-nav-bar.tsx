"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { BrandsMegaMenu } from "./brands-mega-menu";
import { CategoryMegaMenu } from "./category-mega-menu";
import { Phone } from "lucide-react";

import {
  useCollections,
} from "@/features/collections/hooks/use-collections";

const navItems = [
  {
    label: "Categories",
    href: "/categories",
  },
  {
    label: "Brands",
    href: "/brands",
  },
  {
    label: "Products",
    href: "/products",
  },
];

// Reusable Shiny Link Component to manage the mouse-tracking hover effect
function ShinyNavLink({ 
  href, 
  children, 
  className = "" 
}: { 
  href: string; 
  children: React.ReactNode; 
  className?: string;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = linkRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Calculate cursor position relative to the element
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <Link
      ref={linkRef}
      href={href}
      onMouseMove={handleMouseMove}
      className={`
        shiny-link
        relative
        overflow-hidden
        text-[15px]
        font-semibold
        text-white
        transition-colors
        px-4
        py-2
        rounded-md
        flex-shrink-0
        ${className}
      `}
    >
      {/* Background radial reflection tracker */}
      <span className="shiny-glow absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none" />
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

export function CategoryNavBar() {
  const [showBrands, setShowBrands] =
    useState(false);

  const [showCategory, setShowCategory] =
    useState(false);

  const [isMobile, setIsMobile] =
    useState(false);

  const {
    data: collections = [],
  } = useCollections();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth < 640
      );
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  return (
    <>
      {/* Outer wrapper provides container-relative grid bounds instead of the small inner text link bounds */}
      <div className="relative border-b bg-teal-600">
        <div
          className="
            mx-auto
            flex
            h-14
            max-w-[1280px]
            items-center
            px-4
            sm:px-6
          "
        >
          <nav
            className="
              scrollbar-hide
              flex
              w-full
              items-center
              overflow-x-auto
              whitespace-nowrap
              text-sm
              font-medium
              text-white
            "
          >
            {/* ===================================================== */}
            {/* MOBILE VIEW */}
            {/* ===================================================== */}
            <div
              className="
                scrollbar-hide
                flex
                items-center
                gap-3
                sm:hidden
                w-full
                overflow-x-auto
              "
            >
              {navItems.map((item) => {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="
                      flex-shrink-0
                      rounded-md
                      border
                      border-slate-200
                      bg-slate-50
                      px-3
                      py-2
                      text-[13px]
                      whitespace-nowrap
                      text-teal-800
                      font-semibold
                    "
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* DYNAMIC COLLECTIONS ADDED TO MOBILE VIEW */}
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.id}`}
                  className="
                    flex-shrink-0
                    rounded-md
                    border
                    border-slate-200
                    bg-slate-50
                    px-3
                    py-2
                    text-[13px]
                    whitespace-nowrap
                    text-teal-800
                    font-semibold
                  "
                >
                  {collection.name}
                </Link>
              ))}
            </div>

            {/* ===================================================== */}
            {/* DESKTOP CENTERED NAV WITH CONTROLLER SCROLLBAR HIDE */}
            {/* ===================================================== */}
            <div
              className="
                scrollbar-hide
                hidden
                w-full
                items-center
                justify-center
                gap-4
                lg:gap-6
                sm:flex
                h-full
                overflow-x-auto
              "
            >
              {navItems.map((item) => {
                // 🔥 CATEGORY WITH DROPDOWN PRESERVED (Removed inner relative positioning wrapper)
                if (item.label === "Categories") {
                  return (
                    <div
                      key={item.label}
                      className="flex items-center h-full flex-shrink-0"
                      onMouseEnter={() => setShowCategory(true)}
                      onMouseLeave={() => setShowCategory(false)}
                    >
                      <ShinyNavLink href={item.href}>
                        {item.label}
                      </ShinyNavLink>

                      {showCategory && (
                        <div
                          className="
                            absolute
                            left-1/2
                            top-full
                            z-50
                            mt-0
                            -translate-x-1/2
                            animate-in fade-in duration-150
                          "
                        >
                          <CategoryMegaMenu />
                        </div>
                      )}
                    </div>
                  );
                }

                // 🔥 BRANDS WITH DROPDOWN PRESERVED (Removed inner relative positioning wrapper)
                if (item.label === "Brands") {
                  return (
                    <div
                      key={item.label}
                      className="flex items-center h-full flex-shrink-0"
                      onMouseEnter={() => setShowBrands(true)}
                      onMouseLeave={() => setShowBrands(false)}
                    >
                      <ShinyNavLink href={item.href}>
                        {item.label}
                      </ShinyNavLink>

                      {showBrands && (
                        <div
                          className="
                            absolute
                            left-1/2
                            top-full
                            z-50
                            mt-0
                            -translate-x-1/2
                            animate-in fade-in duration-150
                          "
                        >
                          <BrandsMegaMenu />
                        </div>
                      )}
                    </div>
                  );
                }

                // 🔥 NORMAL LINKS WITH SHINY HOVER EFFECT
                return (
                  <ShinyNavLink key={item.label} href={item.href}>
                    {item.label}
                  </ShinyNavLink>
                );
              })}

              {/* COLLECTIONS */}
              {collections.map((collection) => (
                <ShinyNavLink
                  key={collection.id}
                  href={`/collections/${collection.id}`}
                >
                  {collection.name}
                </ShinyNavLink>
              ))}

              {/* PHONE (Included directly after collection elements to automatically inherit the design layout gaps) */}
              <ShinyNavLink href="tel:+919876152430">
                <span className="flex items-center gap-2">
                  <Phone size={16} />
                  +91 98761 52430
                </span>
              </ShinyNavLink>
            </div>
          </nav>
        </div>
      </div>

      {/* 🔥 CUSTOM STYLES FOR SCROLLBAR & SHINY EFFECT */}
      <style>
        {`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }

          /* Shiny Hover Effect Core Styles */
          .shiny-link:hover .shiny-glow {
            opacity: 1;
          }

          .shiny-glow {
            background: radial-gradient(
              80px circle at var(--mouse-x, 0px) var(--mouse-y, 0px),
              rgba(255, 255, 255, 0.3),
              transparent 80%
            );
          }
        `}
      </style>
    </>
  );
}