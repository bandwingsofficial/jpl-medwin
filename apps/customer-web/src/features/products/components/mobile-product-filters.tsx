"use client";

import { useState } from "react";

import { SlidersHorizontal } from "lucide-react";
import { X } from "lucide-react";

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
      {/* MOBILE + TABLET TOP BAR */}

      <div
        className="
          lg:hidden

          flex
          items-center
          justify-between

          mb-4
        "
      >
        <button
          onClick={() =>
            setOpen(true)
          }
          className="
            flex
            items-center
            gap-2

            border
            rounded-lg

            px-4
            py-2

            bg-white
            text-sm
            font-medium
          "
        >
          <SlidersHorizontal
            className="h-4 w-4"
          />

          Filters
        </button>
      </div>

      {/* OVERLAY */}

      {open && (
        <div
          className="
            fixed
            inset-0

            z-50

            bg-black/40
          "
          onClick={() =>
            setOpen(false)
          }
        />
      )}

      {/* DRAWER */}

      <div
        className={`
          fixed
          top-0
          left-0

          h-screen
          w-[320px]

          bg-white

          z-[60]

          shadow-xl

          transition-transform
          duration-300

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div
          className="
            flex
            items-center
            justify-between

            p-4

            border-b
          "
        >
          <h2
            className="
              text-lg
              font-semibold
            "
          >
            Filters
          </h2>

          <button
            onClick={() =>
              setOpen(false)
            }
          >
            <X
              className="
                h-5
                w-5
              "
            />
          </button>
        </div>

        <div
          className="
            h-[calc(100vh-72px)]
            overflow-y-auto
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
