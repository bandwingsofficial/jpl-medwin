"use client";

import { useState } from "react";
import { WalletTransaction } from "@/features/coins/types/coins.type";
import { TransactionItem } from "./transaction-item";
import { Button } from "@/shared/components/ui/button";
import { History, ChevronLeft, ChevronRight } from "lucide-react";

interface TransactionListProps {
  transactions: WalletTransaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  // 🔥 PAGINATION STATES (Max 10 per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // =========================================
  // EMPTY STATE FALLBACK
  // =========================================
  if (!transactions || !transactions.length) {
    return (
      <div className="w-full bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm select-none">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-500 mb-3">
          <History className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold text-gray-900">
          No transactions yet
        </p>
        <p className="text-xs text-gray-400 mt-1 max-w-[240px] mx-auto leading-normal">
          Your loyalty coin credits and debits statements will appear right here.
        </p>
      </div>
    );
  }

  // =========================================
  // PAGINATION MATH LAYER
  // =========================================
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, startIndex + itemsPerPage);

  return (
    /* 👉 UI ENHANCEMENT: Clean aesthetic box wrap featuring precise blue micro-accents */
    <div className="w-full bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col shadow-sm select-none">
      
      {/* HEADER BAR SECTION */}
      <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-blue-50/20">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600 border border-blue-100/30">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 leading-none">
              Transaction History
            </h2>
            <p className="text-[11px] font-medium text-gray-400 mt-1">
              Detailed tracking log of your point redemptions and rewards.
            </p>
          </div>
        </div>
      </div>

      {/* RENDER DYNAMIC PAGINATED CHILD LIST ITEMS */}
      <div className="p-4 space-y-2.5">
        {paginatedTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
          />
        ))}
      </div>

      {/* ✨ MINI FOOTER PAGINATION NAVIGATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-3.5 border-t border-gray-50 bg-gray-50/40">
          <span className="text-[11px] font-medium text-gray-400">
            Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, transactions.length)} of {transactions.length} items
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              className="h-7 w-7 rounded-lg bg-white border-gray-200"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <div className="text-[11px] font-bold px-2 text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              className="h-7 w-7 rounded-lg bg-white border-gray-200"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}