"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Loader } from "@/shared/components/ui/loader";
import { Search, ChevronLeft, ChevronRight, History } from "lucide-react";
import { useCoinTransactions } from "@/features/coin-management/hooks/use-coin-transactions";

export const TransactionTable = () => {
  const [searchUserId, setSearchUserId] = useState("");
  const [appliedUserId, setAppliedUserId] = useState("");

  const { data, isLoading } = useCoinTransactions(appliedUserId);

  // 🔥 PAGINATION STATES (Max 10 per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // =========================================
  // LOADING
  // =========================================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader />
      </div>
    );
  }

  const transactions = data ?? [];

  // =========================================
  // PAGINATION MATH LAYER
  // =========================================
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col shadow-sm">
      
      {/* 🔍 TOP INTERACTIVE ACTIONS & SEARCH HEADER */}
      <div className="flex flex-col gap-4 p-5 border-b border-gray-50 bg-gray-50/30 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-teal-50 rounded-lg text-teal-600 border border-teal-100/30">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 leading-none">
              Transaction History
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Audit global coin ledger balances, conversions, and historical statements.
            </p>
          </div>
        </div>

        {/* SEARCH CONTROLLER */}
        <div className="flex items-center gap-2 max-w-sm w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by User ID..."
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
              className="h-9 rounded-xl pl-9 pr-3 text-xs font-medium border-gray-200 focus-visible:ring-teal-500/20"
            />
          </div>
          <Button
            size="sm"
            onClick={() => {
              setCurrentPage(1);
              setAppliedUserId(searchUserId);
            }}
            className="rounded-xl px-4 text-xs font-semibold h-9 shadow-sm"
          >
            Search
          </Button>
        </div>
      </div>

      {/* CORE DATA TABLE MODULE */}
      <div className="w-full overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Coins</TableHead>
              <TableHead>Before</TableHead>
              <TableHead>After</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedTransactions.map((transaction: any) => {
              const type = transaction.type?.toUpperCase() || "";
              const status = transaction.status?.toUpperCase() || "";

              return (
                <TableRow key={transaction.id}>
                  {/* TRANSACTION TYPE */}
                  <TableCell>
                    <Badge
                      variant="default"
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        type === "EARNED" || type === "CREDIT"
                          ? "border-green-100 bg-green-50 text-green-700"
                          : type === "REDEEMED" || type === "DEBIT"
                          ? "border-purple-100 bg-purple-50 text-purple-700"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    >
                      {type}
                    </Badge>
                  </TableCell>

                  {/* TRANSACTION STATUS */}
                  <TableCell>
                    <Badge
                      variant="default"
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        status === "COMPLETED" || status === "SUCCESS"
                          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                          : status === "PENDING"
                          ? "border-amber-100 bg-amber-50 text-amber-700"
                          : "border-rose-100 bg-rose-50 text-rose-600"
                      }`}
                    >
                      {status}
                    </Badge>
                  </TableCell>

                  {/* COINS VOLUME */}
                  <TableCell>
                    <span className={`font-mono font-bold text-sm ${type === "EARNED" || type === "CREDIT" ? "text-green-600" : "text-gray-900"}`}>
                      {type === "EARNED" || type === "CREDIT" ? "+" : "-"}{transaction.coins?.toLocaleString("en-IN")}
                    </span>
                  </TableCell>

                  {/* BALANCE BEFORE */}
                  <TableCell>
                    <span className="font-mono text-xs text-gray-500">
                      {transaction.balanceBefore?.toLocaleString("en-IN")}
                    </span>
                  </TableCell>

                  {/* BALANCE AFTER */}
                  <TableCell>
                    <span className="font-mono text-xs font-semibold text-gray-900">
                      {transaction.balanceAfter?.toLocaleString("en-IN")}
                    </span>
                  </TableCell>

                  {/* DESCRIPTION STATEMENT */}
                  <TableCell>
                    <span className="font-mono text-xs font-medium text-gray-500 whitespace-nowrap">
                       {transaction.description || "—"}
                    </span>
                  </TableCell>

                  {/* TARGET USER ID */}
                  <TableCell>
  <span className="font-mono text-xs font-medium text-gray-500 whitespace-nowrap">
    {transaction.userId}
  </span> 
</TableCell>

                  {/* TIMESTAMP */}
                  <TableCell>
                    <span className="text-gray-600 text-xs font-medium whitespace-nowrap">
                      {new Date(transaction.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* EMPTY RESULT LAYER FALLBACK */}
      {transactions.length === 0 && (
        <div className="w-full bg-white p-12 text-center text-sm font-medium text-gray-400 border-t border-gray-50">
          No transactions matching selection criteria found.
        </div>
      )}

      {/* ✨ MINI FOOTER PAGINATION MODULE */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
          <span className="text-xs font-medium text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, transactions.length)} of {transactions.length} Statements
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="primary"
              size="icon"
              className="h-7 w-7 rounded-md bg-white border-gray-200"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <div className="text-xs font-bold px-2.5 text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="primary"
              size="icon"
              className="h-7 w-7 rounded-md bg-white border-gray-200"
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
};