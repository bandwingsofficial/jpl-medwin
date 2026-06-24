"use client";

import { useState, useMemo } from "react";

import {
  useActivateCoupon,
  useCoupons,
  useDeactivateCoupon,
  useDeleteCoupon,
  useRestoreCoupon,
} from "../hooks/use-coupons";

import { Coupon } from "../types/coupon.type";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import CouponStatusBadge from "./coupon-status-badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import {
  Pencil,
  Power,
  Trash2,
  RotateCcw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

import {
  showError,
  showSuccess,
  showWarning,
  showInfo,
  showConfirmToast,
} from "@/shared/store/toast.store";

interface Props {
  onEdit: (coupon: Coupon) => void;
}

export default function CouponTable({ onEdit }: Props) {
  const { data = [], isLoading, isError } = useCoupons();

  const activateMutation = useActivateCoupon();
  const deactivateMutation = useDeactivateCoupon();
  const deleteMutation = useDeleteCoupon();
  const restoreMutation = useRestoreCoupon();

  // 🔥 SEARCH & FILTER STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // 🔥 PAGINATION STATES (Max 10 per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // =========================================
  // FILTER MEMO LAYER
  // =========================================
  const filteredCoupons = useMemo(() => {
    const list = data ?? [];
    return list.filter((coupon) => {
      const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "ALL" ? true : coupon.discountType === typeFilter;
      const matchesStatus = statusFilter === "ALL" ? true : coupon.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [data, searchQuery, typeFilter, statusFilter]);

  // Handlers to control search updates and automatically snap viewports back to Page 1
  const handleFilterChange = (type: "search" | "discountType" | "status", value: string) => {
    if (type === "search") setSearchQuery(value);
    if (type === "discountType") setTypeFilter(value);
    if (type === "status") setStatusFilter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("ALL");
    setStatusFilter("ALL");
    setCurrentPage(1);
  };

  // =========================================
  // LOADING
  // =========================================

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-100 py-10 text-center text-sm font-medium text-gray-400">
        Loading coupons...
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (isError) {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-100 py-10 text-center text-sm font-medium text-red-500">
        Failed to load coupons
      </div>
    );
  }

  // =========================================
  // EMPTY
  // =========================================

  if (!data.length) {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-100 p-10 text-center text-sm font-medium text-gray-400">
        No coupons found
      </div>
    );
  }

  // =========================================
  // PAGINATION MATH LAYER
  // =========================================
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCoupons = filteredCoupons.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4 w-full flex flex-col">

      {/* ✨ FILTER PANEL BAR */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by coupon code..."
            className="pl-9 bg-gray-50/50 border-gray-200 text-sm h-9"
            value={searchQuery}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Discount Type Dropdown Filter */}
          <div className="w-[140px]">
            <select
              value={typeFilter}
              onChange={(e) => handleFilterChange("discountType", e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-md text-xs h-9 px-3 py-1.5 font-medium text-gray-700 outline-none focus:ring-1 focus:ring-gray-300"
            >
              <option value="ALL">All Types</option>
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED">Fixed</option>
            </select>
          </div>

          {/* Status Dropdown Filter */}
          <div className="w-[130px]">
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-md text-xs h-9 px-3 py-1.5 font-medium text-gray-700 outline-none focus:ring-1 focus:ring-gray-300"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {(searchQuery || typeFilter !== "ALL" || statusFilter !== "ALL") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 px-2.5 text-gray-500 hover:text-red-600 transition-colors text-xs flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* TABLE BOUNDARY CONTAINER */}
      <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col">
        <div className="w-full overflow-hidden">
          <Table>
            {/* HEADER */}
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Public</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead><div className="text-right w-full pr-4">Actions</div></TableHead>
              </TableRow>
            </TableHeader>

            {/* BODY */}
            <TableBody>
              {paginatedCoupons.map((coupon: Coupon) => {
                const isActivating = activateMutation.isPending;
                const isDeactivating = deactivateMutation.isPending;
                const isDeleting = deleteMutation.isPending;
                const isRestoring = restoreMutation.isPending;

                const isMutating =
                  isActivating || isDeactivating || isDeleting || isRestoring;

                return (
                  <TableRow key={coupon.id}>
                    {/* CODE */}
                    <TableCell>
                      <span className="font-mono font-semibold text-gray-900 tracking-wide">
                        {coupon.code}
                      </span>
                    </TableCell>

                    {/* TYPE */}
                    <TableCell>
                      <span className="text-gray-600 text-xs font-medium">
                        {coupon.discountType}
                      </span>
                    </TableCell>

                    {/* DISCOUNT */}
                    <TableCell>
                      <span className="text-sm font-bold text-gray-900">
                        {coupon.discountType === "PERCENTAGE"
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}
                      </span>
                    </TableCell>

                    {/* USAGE */}
                    <TableCell>
                      <span className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-100 rounded px-1.5 py-0.5">
                        {coupon.usedCount} / {coupon.usageLimit}
                      </span>
                    </TableCell>

                    {/* STATUS */}
                    <TableCell>
                      <CouponStatusBadge status={coupon.status} />
                    </TableCell>

                    {/* PUBLIC */}
                    <TableCell>
                      <span className="text-gray-600 text-sm font-medium">
                        {coupon.isPublic ? "Yes" : "No"}
                      </span>
                    </TableCell>

                    {/* EXPIRY */}
                    <TableCell>
                      <span className="text-gray-600 text-xs font-medium whitespace-nowrap">
                        {new Date(coupon.expiresAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell>
                      <div className="flex justify-end items-center gap-1.5 whitespace-nowrap pr-4">
                        {isMutating && (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400 mr-1" />
                        )}

                        {/* EDIT */}
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 hover:bg-gray-100"
                          disabled={isMutating}
                          onClick={() => {
                            showInfo(`Editing "${coupon.code}"`);
                            onEdit(coupon);
                          }}
                        >
                          <Pencil className="h-4 w-4 text-gray-500" />
                        </Button>

                        {/* STATUS TOGGLE */}
                        {coupon.status === "ACTIVE" ? (
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 hover:bg-gray-100"
                            disabled={isMutating}
                            onClick={async () => {
                              try {
                                await deactivateMutation.mutateAsync(coupon.id);
                                showSuccess("Coupon deactivated");
                              } catch (error: any) {
                                showError(
                                  error?.message || "Failed to deactivate coupon"
                                );
                              }
                            }}
                          >
                            <Power className="h-4 w-4 text-green-600" />
                          </Button>
                        ) : (
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 hover:bg-gray-100"
                            disabled={isMutating}
                            onClick={async () => {
                              try {
                                await activateMutation.mutateAsync(coupon.id);
                                showSuccess("Coupon activated");
                              } catch (error: any) {
                                showError(
                                  error?.message || "Failed to activate coupon"
                                );
                              }
                            }}
                          >
                            <Power className="h-4 w-4 text-gray-400" />
                          </Button>
                        )}

                        {/* DELETE / RESTORE */}
                        {!coupon.deletedAt ? (
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 hover:bg-red-50 hover:text-red-600 group"
                            disabled={isMutating}
                            onClick={async () => {
                              showConfirmToast(
                                `Delete "${coupon.code}" ?`,
                                async () => {
                                  try {
                                    showInfo(`Deleting "${coupon.code}"...`);
                                    await deleteMutation.mutateAsync(coupon.id);
                                    showSuccess("Coupon deleted successfully");
                                  } catch (error: any) {
                                    showError(
                                      error?.message || "Failed to delete coupon"
                                    );
                                  }
                                }
                              );
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-gray-500 group-hover:text-red-600" />
                          </Button>
                        ) : (
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 hover:bg-gray-100"
                            disabled={isMutating}
                            onClick={async () => {
                              showConfirmToast(
                                `Restore "${coupon.code}" ?`,
                                async () => {
                                  try {
                                    await restoreMutation.mutateAsync(coupon.id);
                                    showSuccess("Coupon restored successfully");
                                  } catch (error: any) {
                                    showError(
                                      error?.message || "Failed to restore coupon"
                                    );
                                  }
                                }
                              );
                            }}
                          >
                            <RotateCcw className="h-4 w-4 text-gray-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* MINI FOOTER PAGINATION MODULE */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
            <span className="text-xs font-medium text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCoupons.length)} of {filteredCoupons.length} Coupons
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
    </div>
  );
}