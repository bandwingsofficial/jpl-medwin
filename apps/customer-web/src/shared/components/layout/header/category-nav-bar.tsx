"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { BrandsMegaMenu } from "./brands-mega-menu";
import { CategoryMegaMenu } from "./category-mega-menu";
import { Phone } from "lucide-react";
import { CollectionMegaMenu } from "./collection-mega-menu";

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
  className = "",
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
      <span className="shiny-glow absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none rounded-md" />
      <span className="relative z-10">{children}</span>
      {/* Animated underline that expands from center on hover */}
      <span className="shiny-underline pointer-events-none absolute left-1/2 bottom-1 h-[2px] w-0 -translate-x-1/2 rounded-full bg-white transition-all duration-300 ease-out" />
    </Link>
  );
}

export function CategoryNavBar() {
  const [showBrands, setShowBrands] =
    useState(false);

  const [showCategory, setShowCategory] =
    useState(false);
  const [
    hoveredCollection,
    setHoveredCollection,
  ] = useState<string | null>(null);

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
    <div className="relative border-b border-white/10 bg-gradient-to-r from-[#0BACAE] via-[#089981] to-[#0F8A6B]">  {/* continuous diagonal shimmer sweep across the whole bar */}
      <span className="navbar-shimmer pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="navbar-shimmer-streak" />
      </span>

        <div
          className="
            relative
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
                      border-white/20
                      bg-white/10
                      backdrop-blur-sm
                      px-3
                      py-2
                      text-[13px]
                      whitespace-nowrap
                      text-white
                      font-semibold
                      hover:bg-white/20
                      active:scale-95
                      transition-all
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
                    border-white/20
                    bg-white/10
                    backdrop-blur-sm
                    px-3
                    py-2
                    text-[13px]
                    whitespace-nowrap
                    text-white
                    font-semibold
                    hover:bg-white/20
                    active:scale-95
                    transition-all
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
                            mega-menu-pop
                            absolute
                            left-1/2
                            top-full
                            z-50
                            mt-0
                            -translate-x-1/2
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
                            mega-menu-pop
                            absolute
                            left-1/2
                            top-full
                            z-50
                            mt-0
                            -translate-x-1/2
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
                <div
                  key={collection.id}
                  className="flex items-center h-full flex-shrink-0"
                  onMouseEnter={() =>
                    setHoveredCollection(collection.id)
                  }
                  onMouseLeave={() =>
                    setHoveredCollection(null)
                  }
                >
                  <ShinyNavLink
                    href={`/collections/${collection.id}`}
                  >
                    {collection.name}
                  </ShinyNavLink>

                  {hoveredCollection === collection.id && (
                    <div
                      className="
                        mega-menu-pop
                        absolute
                        left-1/2
                        top-full
                        z-50
                        mt-0
                        -translate-x-1/2
                      "
                    >
                      <CollectionMegaMenu
                        collectionId={collection.id}
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* PHONE (Included directly after collection elements to automatically inherit the design layout gaps) */}
              <ShinyNavLink href="tel:+919187969350" className="phone-link">
                <span className="flex items-center gap-2">
                  <span className="phone-ring-wrap relative flex items-center justify-center">
                    <span className="phone-ring absolute inline-flex h-full w-full rounded-full bg-white/60" />
                    <Phone size={16} className="relative z-10" />
                  </span>
                  +91 91879 69350    
                </span>
              </ShinyNavLink>
            </div>
          </nav>
        </div>

        {/* animated glowing scan-line along the bottom edge of the whole bar */}
        <span className="navbar-glow-line pointer-events-none absolute -bottom-[1px] left-0 h-[2px] w-full" />
      </div>

      {/* 🔥 CUSTOM STYLES FOR SCROLLBAR & PREMIUM EFFECTS */}
      <style>
        {`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }

          /* ---------- Flowing animated gradient background ---------- */
          .navbar-shell {
            background-size: 220% 220%;
            animation: navbarGradientMove 8s ease infinite;
          }
          @keyframes navbarGradientMove {
            0%   { background-position: 0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          /* ---------- Continuous shimmer sweep across full bar ---------- */
          .navbar-shimmer {
            z-index: 0;
          }
          .navbar-shimmer-streak {
            position: absolute;
            top: 0;
            left: -35%;
            width: 20%;
            height: 100%;
            background: linear-gradient(
              100deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.16) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            transform: skewX(-20deg);
            animation: navbarShimmerSweep 5s ease-in-out infinite;
          }
          @keyframes navbarShimmerSweep {
            0%   { left: -35%; }
            55%  { left: 130%; }
            100% { left: 130%; }
          }

          /* ---------- Animated glowing scan-line under the bar ---------- */
          .navbar-glow-line {
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(110, 231, 216, 0.9) 50%,
              transparent 100%
            );
            background-size: 200% 100%;
            animation: glowLineSweep 3.5s ease-in-out infinite;
            box-shadow: 0 0 10px rgba(110, 231, 216, 0.6);
          }
          @keyframes glowLineSweep {
            0%   { background-position: 200% 0; opacity: 0.3; }
            50%  { background-position: 0% 0;   opacity: 1; }
            100% { background-position: -200% 0; opacity: 0.3; }
          }

          /* ---------- Shiny Hover Effect Core Styles ---------- */
          .shiny-link:hover .shiny-glow {
            opacity: 1;
          }
          .shiny-link:hover .shiny-underline {
            width: 60%;
          }
          .shiny-link:active {
            transform: scale(0.97);
          }
          .shiny-link {
            transition: transform 0.15s ease;
          }

          .shiny-glow {
            background: radial-gradient(
              80px circle at var(--mouse-x, 0px) var(--mouse-y, 0px),
              rgba(255, 255, 255, 0.35),
              transparent 80%
            );
          }

          /* ---------- Mega menu entrance: bouncy scale + fade + slide ---------- */
          @keyframes megaMenuPopIn {
            0% {
              opacity: 0;
              transform: translate(-50%, -14px) scale(0.95);
            }
            60% {
              opacity: 1;
              transform: translate(-50%, 3px) scale(1.01);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, 0) scale(1);
            }
          }
          .mega-menu-pop {
            animation: megaMenuPopIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          }

          /* ---------- Phone icon pulsing ring ---------- */
          .phone-ring-wrap {
            width: 16px;
            height: 16px;
          }
          .phone-ring {
            animation: phoneRingPulse 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          @keyframes phoneRingPulse {
            0% {
              transform: scale(0.7);
              opacity: 0.6;
            }
            70% {
              transform: scale(1.9);
              opacity: 0;
            }
            100% {
              transform: scale(1.9);
              opacity: 0;
            }
          }
        `}
      </style>
    </>
  );
}