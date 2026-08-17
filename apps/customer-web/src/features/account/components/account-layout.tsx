"use client";

import { ReactNode } from "react";

import { AccountSidebar } from "@/features/account/components/account-sidebar";

interface Props {
  children: ReactNode;
}

export function AccountLayout({ children }: Props) {
  return (
    <section className="relative w-full flex-1 bg-gray-50/50">
      <div
        className="
          mx-auto
          w-full
          max-w-[1280px]
          px-4
          py-6
          sm:px-6
          lg:py-10
        "
      >
        <div className="flex flex-col items-start gap-6 lg:flex-row">
          {/* 🏷️ DESKTOP SIDEBAR PANEL (Hidden on Mobile) */}
          <div className="hidden w-full flex-shrink-0 lg:sticky lg:top-28 lg:block lg:w-[280px]">
            <AccountSidebar />
          </div>

          {/* 📦 MAIN PAGE CONTENT PANEL */}
          <div
  className="
    min-w-0
    w-full
    flex-1
    rounded-none
    border-0
    bg-transparent
    p-0
    shadow-none

    sm:rounded-2xl
    sm:border
    sm:border-gray-200
    sm:bg-white
    sm:p-6
    sm:shadow-sm
  "
>
  {children}
</div>
        </div>
      </div>
    </section>
  );
}