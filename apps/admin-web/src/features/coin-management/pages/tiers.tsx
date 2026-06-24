"use client";

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