"use client";

import { useState, useMemo } from "react";
import { Brand } from "../types/brand.type";
import { useBrands, useDeleteBrand, useUpdateBrandStatus } from "../hooks/use-brand";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import { Pencil, Trash2, Power, Loader2, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { showError, showSuccess, showWarning, showConfirmToast } from "@/shared/store/toast.store";

export default function BrandTable({
  onEdit,
}: {
  onEdit: (brand: Brand) => void;
}) {
  const { data, isLoading, isError, refetch } = useBrands();
  const deleteMutation = useDeleteBrand();
  const statusMutation = useUpdateBrandStatus();

  const [loadingId, setLoadingId] = useState<string | null>(null);

  // 🔥 SEARCH & FILTER STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // 🔥 PAGINATION STATES (Max 10 per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // =========================================
  // DELETE
  // =========================================

  const handleDelete = async (id: string, status: string, name: string) => {
    if (status === "ACTIVE") {
      showWarning("Deactivate brand before deleting");
      return;
    }

    showConfirmToast(
      `Are you sure you want to delete "${name}" ?`,
      async () => {
        setLoadingId(id);
        deleteMutation.mutate(id, {
          onSuccess: () => {
            showSuccess("Brand deleted successfully");
            setLoadingId(null);
          },
          onError: () => {
            showError("Failed to delete brand");
            setLoadingId(null);
          },
        });
      }
    );
  };

  // =========================================
  // TOGGLE STATUS
  // =========================================

  const handleToggle = (brand: Brand) => {
    setLoadingId(brand.id);
    statusMutation.mutate(
      {
        id: brand.id,
        status: brand.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      },
      {
        onSuccess: () => {
          showSuccess(brand.status === "ACTIVE" ? "Brand deactivated" : "Brand activated");
          setLoadingId(null);
        },
        onError: () => {
          showError("Failed to update status");
          setLoadingId(null);
        },
      }
    );
  };

  // =========================================
  // FILTER MEMO LAYER
  // =========================================
  const filteredBrands = useMemo(() => {
    const brandsList = data ?? [];
    
    return brandsList.filter((brand) => {
      const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" ? true : brand.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  // Helper to change filters and seamlessly reset page index
  const handleFilterChange = (type: "search" | "status", value: string) => {
    if (type === "search") setSearchQuery(value);
    if (type === "status") setStatusFilter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setCurrentPage(1);
  };

  // =========================================
  // LOADING / ERROR RENDERS
  // =========================================

  if (isLoading) {
    return <div className="py-6 text-sm text-gray-500 font-medium">Loading brands...</div>;
  }

  if (isError) {
    return (
      <div className="py-6 text-center space-y-3">
        <p className="text-sm font-semibold text-red-500">Failed to load brands</p>
        <button onClick={() => refetch()} className="text-xs text-blue-600 underline font-medium">
          Retry
        </button>
      </div>
    );
  }

  const brands = data ?? [];

  if (brands.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-sm font-medium text-gray-400">
        No brands found
      </div>
    );
  }

  // =========================================
  // PAGINATION MATH LAYER
  // =========================================
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBrands = filteredBrands.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4 w-full flex flex-col">

      {/* ✨ FILTER PANEL BAR */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by brand name..."
            className="pl-9 bg-gray-50/50 border-gray-200 text-sm h-9"
            value={searchQuery}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Native select drop-down styled to blend with UI design without third-party component errors */}
          <div className="w-[140px]">
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

          {(searchQuery || statusFilter !== "ALL") && (
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
                <TableHead>Brand</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                {/* 👉 FIX 1: Forced text alignment rules inside TableHead to clean layout boundaries */}
                <TableHead><div className="text-right w-full pr-4">Actions</div></TableHead>
              </TableRow>
            </TableHeader>

            {/* ROWS */}
            <TableBody>
              {paginatedBrands.map((brand) => {
                const isRowLoading = loadingId === brand.id;

                return (
                  <TableRow key={brand.id}>
                    {/* BRAND DETAILS */}
                    <TableCell>
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={brand.imageUrl || "/placeholder.png"}
                          alt={brand.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.png";
                          }}
                          className="h-10 w-10 rounded-md border border-gray-100 object-cover"
                        />
                        <span className="font-semibold text-gray-900 truncate">
                          {brand.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* STATUS BADGE */}
                    <TableCell>
                      <Badge
                        variant="default"
                        className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                          brand.status === "ACTIVE"
                            ? "border-green-100 bg-green-50 text-green-700"
                            : "border-red-100 bg-red-50 text-red-600"
                        }`}
                      >
                        {brand.status}
                      </Badge>
                    </TableCell>

                    {/* CREATED TIMESTAMP */}
                    <TableCell>
                      <span className="text-gray-600 text-xs font-medium">
                        {brand.createdAt
                          ? new Date(brand.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "May 2026"}
                      </span>
                    </TableCell>

                    {/* CORE BUTTON ACTIONS */}
                    <TableCell>
                      {/* 👉 FIX 2: Added pr-4 to perfectly align button layouts with the actions text head boundary */}
                      <div className="flex justify-end items-center gap-1.5 whitespace-nowrap pr-4">
                        {isRowLoading && (
                          <Loader2 className="animate-spin text-gray-400 mr-1" size={14} />
                        )}

                        {/* TOGGLE CONFIGURATION */}
                        <Button
                          variant="secondary"
                          size="icon"
                          disabled={isRowLoading}
                          onClick={() => handleToggle(brand)}
                          title="Toggle Status"
                          className="h-8 w-8 hover:bg-gray-100"
                        >
                          <Power
                            size={14}
                            className={brand.status === "ACTIVE" ? "text-green-600" : "text-gray-400"}
                          />
                        </Button>

                        {/* EDIT CALL */}
                        <Button
                          variant="secondary"
                          size="icon"
                          disabled={isRowLoading}
                          onClick={() => onEdit(brand)}
                          title="Edit"
                          className="h-8 w-8 hover:bg-gray-100"
                        >
                          <Pencil size={14} className="text-gray-500" />
                        </Button>

                        {/* DELETE TRIGGER */}
                        <Button
                          variant="secondary"
                          size="icon"
                          disabled={brand.status === "ACTIVE" || isRowLoading}
                          onClick={() => handleDelete(brand.id, brand.status, brand.name)}
                          title={brand.status === "ACTIVE" ? "Deactivate before deleting" : "Delete"}
                          className="h-8 w-8 hover:bg-red-50 hover:text-red-600 group"
                        >
                          <Trash2 size={14} className="text-gray-500 group-hover:text-red-600" />
                        </Button>
                      </div>
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBrands.length)} of {filteredBrands.length} Brands
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