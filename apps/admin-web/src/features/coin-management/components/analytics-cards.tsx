"use client";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Loader } from "@/shared/components/ui/loader";
import { useCoinAnalytics } from "@/features/coin-management/hooks/use-coin-analytics";
import { 
  Wallet, 
  Coins, 
  TrendingUp, 
  Gift, 
  AlertTriangle, 
  RefreshCcw 
} from "lucide-react";

export const AnalyticsCards = () => {
  const { data, isLoading } = useCoinAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const cards = [
    {
      title: "Total Wallets",
      value: data.wallets?.totalWallets?.toLocaleString("en-IN") ?? "0",
      icon: Wallet,
      iconClass: "bg-blue-50 text-blue-600 border-blue-100/30",
    },
    {
      title: "Total Balance",
      value: data.wallets?.totalBalance?.toLocaleString("en-IN") ?? "0",
      icon: Coins,
      iconClass: "bg-teal-50 text-teal-600 border-teal-100/30",
    },
    {
      title: "Lifetime Earned",
      value: data.wallets?.totalLifetimeEarned?.toLocaleString("en-IN") ?? "0",
      icon: TrendingUp,
      iconClass: "bg-green-50 text-green-600 border-green-100/30",
    },
    {
      title: "Lifetime Redeemed",
      value: data.wallets?.totalLifetimeRedeemed?.toLocaleString("en-IN") ?? "0",
      icon: Gift,
      iconClass: "bg-purple-50 text-purple-600 border-purple-100/30",
    },
    {
      title: "Lifetime Expired",
      value: data.wallets?.totalLifetimeExpired?.toLocaleString("en-IN") ?? "0",
      icon: AlertTriangle,
      iconClass: "bg-amber-50 text-amber-600 border-amber-100/30",
    },
    {
      title: "Refunded Coins",
      value: data.coins?.totalRefundedCoins?.toLocaleString("en-IN") ?? "0",
      icon: RefreshCcw,
      iconClass: "bg-rose-50 text-rose-600 border-rose-100/30",
    },
  ];

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-3.5
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            className="
              relative
              overflow-hidden
              border
              border-gray-200/80
              bg-white
              rounded-xl
              shadow-sm
              transition-all
              duration-200
              hover:shadow-md
              hover:border-gray-300
            "
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3.5">
                
                {/* 🛡️ GRAPHIC METRIC ACCENT CONTAINER */}
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${card.iconClass}`}>
                  <Icon className="h-4 w-4" />
                </div>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 truncate leading-none">
                    {card.title}
                  </p>
                  <h2 className="text-xl font-black tracking-tight text-gray-900 truncate">
                    {card.value}
                  </h2>
                </div>

              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};