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
import { Loader } from "@/shared/components/ui/loader";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRewardTiers } from "@/features/coin-management/hooks/use-coin-tiers";

export const TierTable = () => {
  const { data, isLoading } = useRewardTiers();

  // 🔥 PAGINATION STATES (Max 10 per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // =========================================
  // LOADING
  // =========================================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  const tiers = data ?? [];

  // =========================================
  // EMPTY STATE FALLBACK
  // =========================================
  if (tiers.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-100 p-10 text-center text-sm font-medium text-gray-400">
        No reward tiers found
      </div>
    );
  }

  // =========================================
  // PAGINATION MATH LAYER
  // =========================================
  const totalPages = Math.ceil(tiers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTiers = tiers.slice(startIndex, startIndex + itemsPerPage);

  return (
    /* 👉 UI ENHANCEMENT: Replaced unstyled Card with clean unified table container metrics */
    <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col shadow-sm">
      <div className="w-full overflow-hidden">
        <Table>
          {/* HEADER */}
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Multiplier</TableHead>
              <TableHead>Min Spend</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {paginatedTiers.map((tier) => (
              <TableRow key={tier.id}>
                {/* TIER NAME */}
                <TableCell>
                  <span className="font-semibold text-gray-900">
                    {tier.name}
                  </span>
                </TableCell>

                {/* DESCRIPTION */}
                <TableCell>
                  <span className="text-gray-500 text-sm max-w-[280px] truncate block">
                    {tier.description || "—"}
                  </span>
                </TableCell>

                {/* MULTIPLIER */}
                <TableCell>
                  <span className="inline-flex items-center font-mono font-bold text-xs text-teal-700 bg-teal-50 border border-teal-100/40 rounded px-2 py-0.5">
                    {tier.coinMultiplier}x
                  </span>
                </TableCell>

                {/* MIN SPEND */}
                <TableCell>
                  <span className="font-semibold text-gray-900">
                    ₹{tier.minimumLifetimeSpend?.toLocaleString("en-IN")}
                  </span>
                </TableCell>

                {/* STATUS BADGE */}
                <TableCell>
                  <Badge
                    variant="default"
                    className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                      tier.status === "ACTIVE"
                        ? "border-green-100 bg-green-50 text-green-700"
                        : "border-red-100 bg-red-50 text-red-600"
                    }`}
                  >
                    {tier.status}
                  </Badge>
                </TableCell>

                {/* CREATED DATE */}
                <TableCell>
                  <span className="text-gray-600 text-xs font-medium whitespace-nowrap">
                    {new Date(tier.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ✨ MINI FOOTER PAGINATION MODULE */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
          <span className="text-xs font-medium text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, tiers.length)} of {tiers.length} Reward Tiers
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