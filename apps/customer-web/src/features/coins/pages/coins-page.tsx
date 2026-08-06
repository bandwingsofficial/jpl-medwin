"use client";

import Image from "next/image";
import { useState } from "react";
import { WalletCard } from "@/features/coins/components/wallet-card";
import { TransactionList } from "@/features/coins/components/transaction-list";
import { useWallet } from "@/features/coins/hooks/use-wallet";
import { useTransactions } from "@/features/coins/hooks/use-transactions";
import { History, Wallet } from "lucide-react";

export function CoinsPage() {
  const { data: walletData, isLoading: walletLoading } = useWallet();
  const { data: transactionData, isLoading: transactionLoading } = useTransactions();

  // Bone SHIMMER SKELETON STATE (Clean loading placeholder)
  if (walletLoading || transactionLoading) {
    return (
      <div className="space-y-5 animate-pulse">
        {/* Wallet Card Skeleton */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl h-[120px] w-full" />
        
        {/* Transaction History Section Skeleton */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-100 rounded-md w-32" />
          <div className="bg-gray-50 border border-gray-100 rounded-xl h-[60px] w-full" />
          <div className="bg-gray-50 border border-gray-100 rounded-xl h-[60px] w-full" />
          <div className="bg-gray-50 border border-gray-100 rounded-xl h-[60px] w-full" />
        </div>
      </div>
    );
  }

  const wallet = walletData?.data;
  const transactions = transactionData?.data || [];

  if (!wallet) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
        <Wallet className="w-8 h-8 text-gray-300 mb-2" />
        <p className="text-sm font-medium text-gray-500">Wallet data unavailable</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 select-none max-w-4xl mx-auto">
      
      {/* TOP LEVEL SECTION HEADER */}
      <div className="flex items-center gap-2 pb-1">
        <div className="bg-amber-50 h-7 w-7 rounded-full overflow-hidden flex items-center justify-center shrink-0">
          <Image 
            src="/Logo/coin2.png" 
            alt="Coins" 
            width={28} 
            height={28} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-900 leading-none">My Rewards</h1>
          <p className="text-[11px] text-gray-400 mt-0.5">Manage your currency balance and ledger tracking</p>
        </div>
      </div>

      {/* CORE WALLET DISPLAY BALANCE */}
      <div className="transition-all hover:shadow-sm rounded-2xl">
        <WalletCard wallet={wallet} />
      </div>

      {/* TRANSACTION LEDGER TRACKING AREA */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 px-1">
          <History className="w-3.5 h-3.5 text-gray-400" />
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Statement Activity
          </h2>
          <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-md font-bold ml-auto">
            {transactions.length} Total
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-10 border border-gray-100 bg-white rounded-xl">
            <p className="text-xs text-gray-400">No transaction records logged yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <TransactionList transactions={transactions} />
          </div>
        )}
      </div>

    </div>
  );
}