"use client";

import { useCoinWallet } from "@/features/coin-management/hooks/use-coin-wallet";
import { Loader } from "@/shared/components/ui/loader";
import { 
  Wallet, 
  TrendingUp, 
  Gift, 
  AlertTriangle, 
  RefreshCcw, 
  User,
  WalletCards
} from "lucide-react";

interface WalletCardProps {
  userId?: string;
}

export const WalletCard = ({ userId }: WalletCardProps) => {
  const { data, isLoading } = useCoinWallet(userId);

  if (!userId) {
    return null;
  }

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

  return (
    /* 👉 UI ENHANCEMENT: Swapped layout wrappers with structured premium card panels */
    <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col shadow-sm">
      
      {/* CARD HEADER */}
      <div className="flex items-center gap-2.5 p-5 border-b border-gray-50 bg-gray-50/30">
        <div className="p-2 bg-teal-50 rounded-lg text-teal-600 border border-teal-100/30">
          <WalletCards className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900 leading-none">
            Wallet Overview
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Real-time balance breakdown and transactional statistics for this user account.
          </p>
        </div>
      </div>

      {/* METRICS GRID CONTENT */}
      <div
        className="
          p-5
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-3
        "
      >
        <WalletItem
          label="Balance"
          value={data.balance?.toLocaleString("en-IN") ?? "0"}
          icon={Wallet}
          iconClass="bg-teal-50 text-teal-600 border-teal-100/30"
        />

        <WalletItem
          label="Lifetime Earned"
          value={data.lifetimeEarned?.toLocaleString("en-IN") ?? "0"}
          icon={TrendingUp}
          iconClass="bg-green-50 text-green-600 border-green-100/30"
        />

        <WalletItem
          label="Lifetime Redeemed"
          value={data.lifetimeRedeemed?.toLocaleString("en-IN") ?? "0"}
          icon={Gift}
          iconClass="bg-purple-50 text-purple-600 border-purple-100/30"
        />

        <WalletItem
          label="Lifetime Expired"
          value={data.lifetimeExpired?.toLocaleString("en-IN") ?? "0"}
          icon={AlertTriangle}
          iconClass="bg-amber-50 text-amber-600 border-amber-100/30"
        />

        <WalletItem
          label="Lifetime Refunded"
          value={data.lifetimeRefunded?.toLocaleString("en-IN") ?? "0"}
          icon={RefreshCcw}
          iconClass="bg-rose-50 text-rose-600 border-rose-100/30"
        />

        <WalletItem
          label="User ID"
          value={data.userId}
          isMono
          icon={User}
          iconClass="bg-blue-50 text-blue-600 border-blue-100/30"
        />
      </div>
    </div>
  );
};

interface WalletItemProps {
  label: string;
  value: string | number;
  isMono?: boolean;
  icon: any;
  iconClass: string;
}

const WalletItem = ({
  label,
  value,
  isMono = false,
  icon: Icon,
  iconClass,
}: WalletItemProps) => {
  return (
    <div className="rounded-xl border border-gray-200/70 bg-white p-3.5 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${iconClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      
      <div className="space-y-0.5 min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 truncate leading-none">
          {label}
        </p>
        <h3
          className={`text-base font-black tracking-tight truncate mt-1 text-gray-900 ${
            isMono ? "font-mono text-xs text-gray-500 font-semibold" : ""
          }`}
        >
          {value}
        </h3>
      </div>
    </div>
  );
};