"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2, Coins, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRedeemCoins } from "@/features/coins/hooks/use-redeem-coins";

interface RedeemCardProps {
  checkoutSessionId: string;
  onValidated: (coins: number, payableAmount: number) => void;
}

export function RedeemCard({
  checkoutSessionId,
  onValidated,
}: RedeemCardProps) {
  /*
   |--------------------------------------------------------------------------
   | LOCAL STATE
   |--------------------------------------------------------------------------
   */
  const [coins, setCoins] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   |--------------------------------------------------------------------------
   | APPLY REWARDS MUTATION
   |--------------------------------------------------------------------------
   */
  const applyRewardsMutation = useRedeemCoins();

  /*
   |--------------------------------------------------------------------------
   | APPLY REWARDS
   |--------------------------------------------------------------------------
   */
  const handleApplyRewards = async () => {
    try {
      setError("");
      setSuccess("");

      const parsedCoins = Number(coins);

      if (!parsedCoins || parsedCoins <= 0) {
        setError("Enter valid coins");
        return;
      }

      const response = await applyRewardsMutation.mutateAsync({
        checkoutSessionId,
        coins: parsedCoins,
      });

      const data = response;

      const payableAmount =
        data?.rewards?.payableAfterRewards ??
        data?.summary?.grandTotal ??
        0;

      onValidated(parsedCoins, payableAmount);
      setSuccess("Coins applied successfully");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (message?.toLowerCase().includes("insufficient")) {
          setError("Insufficient coins balance");
          return;
        }

        if (message?.toLowerCase().includes("maximum redeemable")) {
          setError(message);
          return;
        }

        setError(message || "Failed to apply coins");
        return;
      }

      setError("Something went wrong");
    }
  };

  return (
    /* 👉 UI ENHANCEMENT: Upgraded container into a clean, modern card shell component */
    <div className="w-full bg-white rounded-xl border border-gray-100 p-4 my-5 shadow-sm select-none">
      
      {/* HEADER SECTION */}
      <div className="flex items-start gap-2.5 mb-4">
        <div className="p-2 bg-teal-50 rounded-lg text-teal-600 border border-teal-100/30 shrink-0">
          <Coins className="h-4 w-4" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-gray-900 leading-none">
            Redeem Loyalty Coins
          </h3>
          <p className="text-[11px] font-medium text-gray-400 leading-normal">
            Apply your reward points for instant checkout savings. Max allowance limit is 20%.
          </p>
        </div>
      </div>

      {/* INPUT / BUTTON ROW */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="number"
            placeholder="0"
            value={coins}
            onChange={(e) => setCoins(e.target.value)}
            disabled={applyRewardsMutation.isPending}
            className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-4 pr-12 text-sm font-semibold text-gray-900 outline-none transition-all focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-50/50 disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Coins
          </span>
        </div>

        <button
          type="button"
          onClick={handleApplyRewards}
          disabled={applyRewardsMutation.isPending || !coins}
          className="h-10 rounded-xl bg-teal-600 px-5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-teal-700 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center min-w-[80px]"
        >
          {applyRewardsMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Apply"
          )}
        </button>
      </div>

      {/* ⚠️ ERROR BLOCK NOTIFICATION */}
      {error && (
        <div className="mt-3 flex items-start gap-2 p-2.5 rounded-xl border border-rose-100 bg-rose-50/50 text-rose-600 animate-in fade-in duration-200">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <p className="text-[11px] font-semibold leading-normal">
            {error}
          </p>
        </div>
      )}

      {/* 🎉 SUCCESS BLOCK NOTIFICATION */}
      {success && (
        <div className="mt-3 flex items-start gap-2 p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/50 text-emerald-700 animate-in fade-in duration-200">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <p className="text-[11px] font-semibold leading-normal">
            {success}
          </p>
        </div>
      )}

    </div>
  );
}