"use client";

import { useState } from "react";

import {
  SlidersHorizontal,
  X,
} from "lucide-react";

import { ProductFilters } from "./product-filters";

interface MobileProductFiltersProps {
  filters: any;
  onChange: (filters: any) => void;
}

export function MobileProductFilters({
  filters,
  onChange,
}: MobileProductFiltersProps) {
  const [open, setOpen] =
    useState(false);

  return (
    <>
      {/* =========================================
          MOBILE + TABLET FILTER BUTTON
      ========================================= */}

      <div
        className="
          mb-4
          flex
          items-center
          justify-between
          lg:hidden
        "
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="
            inline-flex
            h-10
            items-center
            gap-2
            rounded-xl
            border
            border-teal-200
            bg-white
            px-4
            text-sm
            font-semibold
            text-teal-700
            shadow-sm
            shadow-teal-900/5
            transition-all
            hover:border-teal-400
            hover:bg-teal-50
            hover:text-teal-800
            active:scale-[0.98]
          "
        >
          <span
            className="
              flex
              h-6
              w-6
              items-center
              justify-center
              rounded-md
              bg-teal-600
              text-white
            "
          >
            <SlidersHorizontal
              className="h-3.5 w-3.5"
              strokeWidth={2.2}
            />
          </span>

          Filters
        </button>
      </div>

      {/* =========================================
          OVERLAY
      ========================================= */}

      {open && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-slate-950/45
            backdrop-blur-[2px]
          "
          onClick={() => setOpen(false)}
        />
      )}

      {/* =========================================
          FILTER DRAWER
      ========================================= */}

      <div
        className={`
          fixed
          left-0
          top-0
          z-[60]
          h-screen
          w-[320px]
          max-w-[88vw]
          overflow-hidden
          border-r
          border-teal-100
          bg-slate-50
          shadow-[8px_0_30px_rgba(15,23,42,0.16)]
          transition-transform
          duration-300
          ease-out
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* =========================================
            DRAWER HEADER
        ========================================= */}

        <div
          className="
            relative
            flex
            h-[72px]
            items-center
            justify-between
            overflow-hidden
            border-b
            border-teal-100
            bg-gradient-to-r
            from-teal-700
            via-teal-600
            to-cyan-600
            px-4
          "
        >
          {/* DECORATIVE CIRCLE */}

          <div
            className="
              absolute
              -right-8
              -top-10
              h-28
              w-28
              rounded-full
              bg-white/10
            "
          />

          <div
            className="
              absolute
              -bottom-10
              left-24
              h-20
              w-20
              rounded-full
              bg-cyan-300/10
            "
          />

          {/* TITLE */}

          <div className="relative flex items-center gap-2.5">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                bg-white/15
                text-white
                ring-1
                ring-white/20
              "
            >
              <SlidersHorizontal
                className="h-[18px] w-[18px]"
                strokeWidth={2.2}
              />
            </div>

            <div>
              <h2
                className="
                  text-base
                  font-bold
                  tracking-tight
                  text-white
                "
              >
                Filters
              </h2>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  font-medium
                  text-teal-50/90
                "
              >
                Refine your products
              </p>
            </div>
          </div>

          {/* CLOSE */}

          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
            className="
              relative
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              bg-white/10
              text-white
              ring-1
              ring-white/20
              transition-all
              hover:bg-white/20
              active:scale-95
            "
          >
            <X
              className="h-[18px] w-[18px]"
              strokeWidth={2.2}
            />
          </button>
        </div>

        {/* =========================================
            FILTER CONTENT
        ========================================= */}

        <div
          className="
            h-[calc(100vh-72px)]
            overflow-y-auto
            px-3
            py-3
            [&::-webkit-scrollbar]:hidden
            [-ms-overflow-style:none]
            [scrollbar-width:none]
          "
        >
          <ProductFilters
            filters={filters}
            onChange={onChange}
          />
        </div>
      </div>
    </>
  );
}