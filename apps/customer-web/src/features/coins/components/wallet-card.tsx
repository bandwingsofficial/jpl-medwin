"use client";

import { Wallet } from "@/features/coins/types/coins.type";
import { Coins, TrendingUp, Gift, AlertTriangle, RefreshCcw } from "lucide-react";

interface WalletCardProps {
  wallet: Wallet;
}

export function WalletCard({ wallet }: WalletCardProps) {
  return (
    /* 👉 UI ENHANCEMENT: Clean aesthetic box wrap featuring precise blue micro-accents */
    <div className="w-full bg-white rounded-2xl border border-gray-100 overflow-hidden p-5 shadow-sm select-none">
      
      {/* HEADER SECTION PANEL */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-50">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 leading-none">
            Available Coins Balance
          </p>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">
            {wallet.balance?.toLocaleString("en-IN") ?? "0"}
          </h2>
        </div>

        {/* COMPACT ICON WRAPPER */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/30">
          <Coins className="h-5 w-5" />
        </div>
      </div>

      {/* METRICS STATS SUB GRID */}
      <div
        className="
          mt-4
          grid
          grid-cols-2
          gap-3
          sm:grid-cols-4
        "
      >
        <StatItem
          label="Earned"
          value={wallet.lifetimeEarned}
          icon={TrendingUp}
          iconClass="text-green-600 bg-green-50/50 border-green-100/20"
        />

        <StatItem
          label="Redeemed"
          value={wallet.lifetimeRedeemed}
          icon={Gift}
          iconClass="text-purple-600 bg-purple-50/50 border-purple-100/20"
        />

        <StatItem
          label="Expired"
          value={wallet.lifetimeExpired}
          icon={AlertTriangle}
          iconClass="text-amber-600 bg-amber-50/50 border-amber-100/20"
        />

        <StatItem
          label="Refunded"
          value={wallet.lifetimeRefunded}
          icon={RefreshCcw}
          iconClass="text-rose-600 bg-rose-50/50 border-rose-100/20"
        />
      </div>
    </div>
  );
}

interface StatItemProps {
  label: string;
  value: number;
  icon: any;
  iconClass: string;
}

function StatItem({
  label,
  value,
  icon: Icon,
  iconClass,
}: StatItemProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/40 p-3 flex flex-col justify-between gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
          {label}
        </span>
        {/* SMALL COMPACT CONTEXT ICON */}
        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${iconClass}`}>
          <Icon className="h-3 w-3" />
        </div>
      </div>

      <h4 className="text-base font-black tracking-tight text-gray-900 truncate">
        {value?.toLocaleString("en-IN") ?? "0"}
      </h4>
    </div>
  );
}