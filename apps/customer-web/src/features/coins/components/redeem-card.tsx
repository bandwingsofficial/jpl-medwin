"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2, Coins, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRedeemCoins } from "@/features/coins/hooks/use-redeem-coins";

interface RedeemCardProps {
  checkoutSessionId: string;
  orderAmount: number;
  maxRedemptionPercentage: number;
  coinValue: number;
  walletBalance: number;

  onValidated: (
    coins: number,
    payableAmount: number
  ) => void;
}

export function RedeemCard({
  checkoutSessionId,
  orderAmount,
  maxRedemptionPercentage,
  coinValue, 
  walletBalance,
  onValidated,
}: RedeemCardProps) {

  const maxRedeemableCoins =
  Math.floor(
    ((orderAmount * maxRedemptionPercentage) / 100) /
      coinValue
  );
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

    /*
     |----------------------------------------------------------------------
     | VALIDATE INTEGER
     |----------------------------------------------------------------------
     */

    if (
      !Number.isInteger(parsedCoins) ||
      parsedCoins <= 0
    ) {
      setError(
        "Enter a valid whole number of coins"
      );
      return;
    }

    /*
     |----------------------------------------------------------------------
     | VALIDATE MAXIMUM
     |----------------------------------------------------------------------
     */

    if (maxRedeemableCoins <= 0) {
      setError(
        "Coins cannot be redeemed for this order."
      );
      return;
    }

    if (
      parsedCoins >
      maxRedeemableCoins
    ) {
      setError(
        `You can redeem a maximum of ${maxRedeemableCoins} coins for this order.`
      );
      return;
    }

    /*
     |----------------------------------------------------------------------
     | APPLY REWARD
     |----------------------------------------------------------------------
     */

    const response =
      await applyRewardsMutation.mutateAsync({
        checkoutSessionId,
        coins: parsedCoins,
      });

    const data = response;

    const payableAmount =
      data?.rewards?.payableAfterRewards ??
      data?.summary?.grandTotal ??
      0;

    onValidated(
      parsedCoins,
      payableAmount
    );

    setSuccess(
      "Coins applied successfully"
    );
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message;

      if (
        message
          ?.toLowerCase()
          .includes("insufficient")
      ) {
        setError(
          "Insufficient coins balance"
        );
        return;
      }

      if (
        message
          ?.toLowerCase()
          .includes("maximum redeemable")
      ) {
        setError(message);
        return;
      }

      setError(
        message ||
          "Failed to apply coins"
      );
      return;
    }

    setError(
      "Something went wrong"
    );
  }
};

  return (
    /* 👉 UI ENHANCEMENT: Upgraded container into a clean, modern card shell component */
    <div className="w-full bg-white rounded-xl border border-gray-100 p-4 my-5 shadow-sm select-none">
      
      {/* HEADER SECTION */}
      {/* HEADER SECTION */}
<div className="mb-4">

  {/* TITLE ROW */}
  <div className="flex items-start gap-3">
    {/* COIN ICON */}
   <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl">
  <img
    src="/Logo/coin10.png"
    alt="Coins"
    className="h-full w-full object-cover"
  />
</div>

    {/* TITLE */}
    <div className="pt-0.5">
      <h3 className="text-base font-bold leading-tight text-gray-900">
        Redeem Loyalty Coins
      </h3>

      <p className="mt-1 text-xs font-medium leading-tight text-gray-400">
        Use your loyalty coins on this order
      </p>
    </div>
  </div>

  {/* COINS SUMMARY */}
  <div className="mt-3 grid grid-cols-2 gap-2.5">

    {/* TOTAL COINS */}
    <div className="min-w-0 rounded-xl border border-orange-100 bg-orange-50/60 px-3.5 py-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wide text-orange-500">
          Total Coins
        </span>

        <Coins className="h-4 w-4 shrink-0 text-orange-500" />
      </div>

      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-xl font-black leading-none text-gray-900">
          {walletBalance.toLocaleString("en-IN")}
        </span>

        <span className="text-[9px] font-bold uppercase text-gray-400">
          Coins
        </span>
      </div>
    </div>

    {/* AVAILABLE COINS */}
    <div className="min-w-0 rounded-xl border border-teal-100 bg-teal-50/60 px-3.5 py-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wide text-teal-600">
          Available
        </span>

        <Coins className="h-4 w-4 shrink-0 text-teal-500" />
      </div>

      <div className="mt-1 flex items-center justify-between gap-2">

        <div className="flex min-w-0 items-baseline gap-1">
          <span className="text-xl font-black leading-none text-gray-900">
            {Math.min(
              walletBalance,
              maxRedeemableCoins
            ).toLocaleString("en-IN")}
          </span>

          <span className="text-[9px] font-bold uppercase text-gray-400">
            Coins
          </span>
        </div>

        {/* REDEMPTION % */}
        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-teal-600 ring-1 ring-teal-100">
          {maxRedemptionPercentage}%
        </span>

      </div>
    </div>

  </div>

</div>{/* INPUT / BUTTON ROW */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
  type="number"
  min={1}
  max={maxRedeemableCoins}
  step={1}
  placeholder="0"
  value={coins}
  onChange={(e) => {
    const value = e.target.value;

    if (value === "") {
      setCoins("");
      setError("");
      return;
    }

    if (!/^\d+$/.test(value)) {
      return;
    }

    setCoins(value);
    setError("");
  }}
  disabled={applyRewardsMutation.isPending}
  className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-4 pr-12 text-base font-semibold text-gray-900 outline-none transition-all focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-50/50 disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
/>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Coins
          </span>
        </div>

        <button
          type="button"
          onClick={handleApplyRewards}
          disabled={applyRewardsMutation.isPending || !coins}
         className="h-10 min-w-[80px] rounded-xl border border-orange-100 bg-orange-50 px-5 text-xs font-bold uppercase tracking-wider text-orange-600 shadow-sm transition-all hover:bg-orange-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40" >
          {applyRewardsMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Redeem Now"
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