"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/cn";
import { ACCOUNT_SIDEBAR_ITEMS } from "@/features/account/constants/account-sidebar.constant";

interface AccountSidebarProps {
  isMobile?: boolean;
}

export function AccountSidebar({
  isMobile = false,
}: AccountSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "w-full overflow-hidden select-none",
        isMobile
          ? "border-0 bg-transparent shadow-none"
          : "rounded-2xl border border-gray-200 bg-white shadow-sm lg:w-[290px]"
      )}
    >
      {/* =========================================================
          DESKTOP HEADER ONLY
          ========================================================= */}

      {!isMobile && (
        <div className="border-b border-gray-100 bg-gradient-to-b from-gray-50/50 to-white px-6 py-5">
          <h2
            className="
              animate-text-shine
              bg-gradient-to-r
              from-[#001f3f]
              via-[#0d9488]
              to-[#001f3f]
              bg-clip-text
              text-[22px]
              font-bold
              text-transparent
            "
          >
            My Account
          </h2>

          <p className="mt-0.5 text-xs font-medium text-gray-400">
            Manage your customer profile & records
          </p>
        </div>
      )}

      {/* =========================================================
          ACCOUNT NAVIGATION
          ========================================================= */}

      <div
        className={cn(
          isMobile
            ? "w-full p-1"
            : "p-3"
        )}
      >
        <div className="space-y-1">
          {ACCOUNT_SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  `
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-2.5
                    py-2
                    text-sm
                    font-medium
                    transition-all
                    duration-200
                    active:scale-[0.99]
                  `,
                  isMobile && `
                    min-h-[44px]
                    touch-manipulation
                  `,
                  isActive
                    ? "bg-[#f0fdfa] font-semibold text-teal-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900"
                )}
              >
                {/* ICON ACCENT CONTAINER */}

                <div
                  className={cn(
                    `
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      transition-all
                      duration-200
                    `,
                    isActive
                      ? "bg-teal-600 text-white"
                      : "border border-gray-100/70 bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-gray-600"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* ITEM LABEL */}

                <span
                  className="
                    min-w-0
                    flex-1
                    truncate
                    text-[13px]
                    tracking-wide
                  "
                >
                  {item.label}
                </span>

                {/* ACTIVE INDICATOR */}

                {isActive && (
                  <div
                    className="
                      mr-1
                      h-1.5
                      w-1.5
                      shrink-0
                      rounded-full
                      bg-teal-500
                      animate-in
                      fade-in
                      zoom-in-50
                      duration-150
                    "
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}