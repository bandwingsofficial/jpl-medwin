"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  Home,
} from "lucide-react";

import { WalletSearch } from "@/features/coin-management/components/wallet-search";

import { WalletCard } from "@/features/coin-management/components/wallet-card";

import { CreditCoinsModal } from "@/features/coin-management/components/credit-coins-modal";

import { RefundCoinsModal } from "@/features/coin-management/components/refund-coins-modal";

import { ExpireCoinsModal } from "@/features/coin-management/components/expire-coins-modal";

export default function CoinWalletPage() {
  const [selectedUserId, setSelectedUserId] =
    useState("");

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
          Wallet Management
        </span>
      </div>

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">
          Wallet Management
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Search and manage user wallets.
        </p>
      </div>

      {/* WALLET SEARCH */}

      <WalletSearch
        onSearch={(userId) =>
          setSelectedUserId(userId)
        }
      />

      {/* WALLET */}

      <WalletCard
        userId={selectedUserId}
      />

      {/* COIN ACTIONS */}

      {selectedUserId && (
        <div
          className="
            grid
            grid-cols-1
            gap-4
            xl:grid-cols-3
          "
        >
          <CreditCoinsModal
            userId={selectedUserId}
          />

          <RefundCoinsModal
            userId={selectedUserId}
          />

          <ExpireCoinsModal />
        </div>
      )}
    </div>
  );
}