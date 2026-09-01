"use client";

import Link from "next/link";
import {
  ChevronRight,
  Home,
} from "lucide-react";

import { TransactionTable } from "@/features/coin-management/components/transaction-table";

export default function CoinTransactionsPage() {
  return (
    <div
      className="
        flex
        flex-col
        gap-6
        p-6
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
          Transactions
        </span>
      </div>

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">
          Transactions
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View all wallet transactions.
        </p>
      </div>

      {/* TABLE */}

      <TransactionTable />
    </div>
  );
}