"use client";

import Link from "next/link";
import {
  ChevronRight,
  Home,
} from "lucide-react";

import { AddressList } from "@/features/address/components/address-list";

export function AddressesPage() {
  return (
    <div className="w-full">
      {/* BREADCRUMBS */}
      <div className="mb-5 flex items-center gap-2 text-sm">
        <Link
          href="/"
          className="
            inline-flex
            items-center
            gap-1.5
            font-medium
            text-slate-500
            transition-colors
            hover:text-teal-600
          "
        >
          <Home className="h-4 w-4" />
          Home
        </Link>

        <ChevronRight
          className="h-4 w-4 text-slate-300"
          strokeWidth={2}
        />

        <span className="font-semibold text-teal-600">
          Saved Addresses
        </span>
      </div>

      <AddressList />
    </div>
  );
}