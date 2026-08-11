"use client";

import Link from "next/link";
import {
  ChevronRight,
  Home,
} from "lucide-react";

import { TierForm } from "@/features/coin-management/components/tier-form";

import { TierTable } from "@/features/coin-management/components/tier-table";

export default function CoinTiersPage() {
  return (
    <div
      className="
        flex
        flex-col
        gap-5
        p-5
      "
    >
      {/* BREADCRUMBS */}

      <div className="flex items-center gap-2 text-sm">
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

        <ChevronRight className="h-4 w-4 text-slate-300" />

        <Link
          href="/coins"
          className="
            font-medium
            text-slate-500
            transition-colors
            hover:text-teal-600
          "
        >
          Coins Management
        </Link>

        <ChevronRight className="h-4 w-4 text-slate-300" />

        <span className="font-semibold text-teal-600">
          Reward Tiers
        </span>
      </div>

      {/* TOP SECTION */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        {/* LEFT */}

        <div>
          <h1
            className="
              text-4xl
              font-bold
              tracking-tight
              text-gray-900
            "
          >
            Reward Tiers
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Manage all reward tiers.
          </p>
        </div>

        {/* RIGHT */}

        <TierForm />
      </div>

      {/* TABLE */}

      <TierTable />
    </div>
  );
}