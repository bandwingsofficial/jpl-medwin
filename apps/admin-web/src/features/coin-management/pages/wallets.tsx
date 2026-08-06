"use client";

import { useState } from "react";

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
      <div>
        <h1 className="text-3xl font-bold">
          Wallet Management
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Search and manage user wallets.
        </p>
      </div>

      <WalletSearch
        onSearch={(userId) =>
          setSelectedUserId(userId)
        }
      />

      <WalletCard
        userId={selectedUserId}
      />

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