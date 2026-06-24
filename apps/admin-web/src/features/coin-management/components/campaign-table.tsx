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
import { useCampaigns } from "@/features/coin-management/hooks/use-coin-campaigns";

export const CampaignTable = () => {
  const { data, isLoading } = useCampaigns();

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

  const campaigns = data ?? [];

  // =========================================
  // EMPTY STATE FALLBACK
  // =========================================
  if (campaigns.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-100 p-10 text-center text-sm font-medium text-gray-400">
        No campaigns found
      </div>
    );
  }

  // =========================================
  // PAGINATION MATH LAYER
  // =========================================
  const totalPages = Math.ceil(campaigns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCampaigns = campaigns.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col shadow-sm">
      <div className="w-full overflow-hidden">
        <Table>
          {/* HEADER */}
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Multiplier</TableHead>
              <TableHead>Starts</TableHead>
              <TableHead>Ends</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {paginatedCampaigns.map((campaign) => {
              // 🔥 AUTO-INACTIVE REALTIME CHECK LOGIC
              const currentDate = new Date();
              const endDate = new Date(campaign.endsAt);
              const isPastExpiry = currentDate > endDate;
              
              // Determine live conditional status values explicitly
              const liveActiveState = campaign.isActive && !isPastExpiry;

              return (
                <TableRow key={campaign.id}>
                  {/* TITLE */}
                  <TableCell>
                    <span className="font-semibold text-gray-900 whitespace-nowrap">
                      {campaign.title}
                    </span>
                  </TableCell>

                  {/* DESCRIPTION */}
                  <TableCell>
                    <span className="text-gray-500 text-sm max-w-[240px] truncate block">
                      {campaign.description || "—"}
                    </span>
                  </TableCell>

                  {/* MULTIPLIER */}
                  <TableCell>
                    <span className="inline-flex items-center font-mono font-bold text-xs text-teal-700 bg-teal-50 border border-teal-100/40 rounded px-2 py-0.5">
                      {campaign.bonusMultiplier}x
                    </span>
                  </TableCell>

                  {/* STARTS AT */}
                  <TableCell>
                    <span className="text-gray-600 text-xs font-medium whitespace-nowrap">
                      {new Date(campaign.startsAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </TableCell>

                  {/* ENDS AT */}
                  <TableCell>
                    <span className={`text-xs font-medium whitespace-nowrap ${isPastExpiry ? "text-rose-600 font-semibold" : "text-gray-600"}`}>
                      {endDate.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </TableCell>

                  {/* STATUS BADGE */}
                  <TableCell>
                    <Badge
                      variant="default"
                      className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                        liveActiveState
                          ? "border-green-100 bg-green-50 text-green-700"
                          : isPastExpiry
                          ? "border-amber-100 bg-amber-50 text-amber-700" // Styled explicitly as expired
                          : "border-red-100 bg-red-50 text-red-600"
                      }`}
                    >
                      {liveActiveState ? "ACTIVE" : isPastExpiry ? "EXPIRED" : "INACTIVE"}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* ✨ MINI FOOTER PAGINATION MODULE */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
          <span className="text-xs font-medium text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, campaigns.length)} of {campaigns.length} Campaigns
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