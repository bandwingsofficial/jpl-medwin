"use client";

import { useRouter } from "next/navigation";
import { AnalyticsCards } from "@/features/coin-management/components/analytics-cards";
import { BarChart3, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function CoinAnalyticsPage() {
  const router = useRouter();

  return (
    <div className="w-full space-y-5 select-none">
      
      {/* 📊 PLATFORM ANALYTICS SECTION HEADER */}
      <div className="pb-3 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-teal-50 rounded-lg text-teal-600 border border-teal-100/30">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Analytics Overview
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Real-time track overview of platform coin statistics, balances, and ledger conversions.
            </p>
          </div>
        </div>

        {/* ⬅️ CLEAN BACK BUTTON */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push("/coins")}
          className="
            inline-flex 
            items-center 
            gap-1.5 
            rounded-xl 
            border 
            border-gray-200 
            bg-white 
            px-3 
            py-1.5 
            text-xs 
            font-medium 
            text-gray-600 
            shadow-sm 
            transition-all 
            hover:bg-gray-50 
            hover:text-gray-900
            active:scale-95
          "
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back</span>
        </Button>
      </div>

      {/* CORE METRICS GRID SECTION */}
      <AnalyticsCards />

    </div>
  );
}