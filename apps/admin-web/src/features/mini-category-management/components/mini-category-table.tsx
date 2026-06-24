"use client";

import { useState, useMemo } from "react";

import { MiniCategory } from "../types/mini-category.type";
import { Category } from "@/features/category-management/types/category.type";
import { SubCategory } from "@/features/sub-category-management/types/sub-category.type";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import { Power, Pencil, Trash2, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { showError, showSuccess, showWarning, showConfirmToast } from "@/shared/store/toast.store";

interface Props {
  data: MiniCategory[];
  categories: Category[];
  subCategories: SubCategory[];

  onEdit: (item: MiniCategory) => void;
  onDelete: (item: MiniCategory) => Promise<void> | void;
  onToggleStatus: (item: MiniCategory) => Promise<void> | void;
}

export function MiniCategoryTable({
  data,
  categories,
  subCategories,
  onEdit,
  onDelete,
  onToggleStatus,
}: Props) {
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 🔥 SEARCH & FILTER STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [subCategoryFilter, setSubCategoryFilter] = useState("ALL");

  // 🔥 PAGINATION STATES (Max 10 per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // =========================================
  // FILTER MEMO LAYER
  // =========================================
  const filteredData = useMemo(() => {
    const list = data ?? [];
    return list.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" ? true : item.status === statusFilter;
      const matchesCategory = categoryFilter === "ALL" ? true : item.categoryId === categoryFilter;
      const matchesSubCategory = subCategoryFilter === "ALL" ? true : item.subCategoryId === subCategoryFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesSubCategory;
    });
  }, [data, searchQuery, statusFilter, categoryFilter, subCategoryFilter]);

  // Dynamic Sub-Category Dropdown Options dependent on Category Filter selection
  const filteredSubCategoryOptions = useMemo(() => {
    if (categoryFilter === "ALL") return subCategories ?? [];
    return (subCategories ?? []).filter((sub) => sub.categoryId === categoryFilter);
  }, [subCategories, categoryFilter]);

  // Handlers to change filters and seamlessly reset page index
  const handleFilterChange = (type: "search" | "status" | "category" | "subCategory", value: string) => {
    if (type === "search") setSearchQuery(value);
    if (type === "status") setStatusFilter(value);
    if (type === "category") {
      setCategoryFilter(value);
      setSubCategoryFilter("ALL"); // Reset subcategory when parent category changes
    }
    if (type === "subCategory") setSubCategoryFilter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
    setSubCategoryFilter("ALL");
    setCurrentPage(1);
  };

  // =========================
  // EMPTY STATE
  // =========================
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-sm font-medium text-gray-400">
        No mini categories found
      </div>
    );
  }

  // =========================================
  // PAGINATION MATH LAYER
  // =========================================
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4 w-full flex flex-col">

      {/* ✨ FILTER PANEL BAR */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by mini category name..."
            className="pl-9 bg-gray-50/50 border-gray-200 text-sm h-9"
            value={searchQuery}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Main Category Dropdown Filter */}
          <div className="w-[150px]">
            <select
              value={categoryFilter}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-md text-xs h-9 px-3 py-1.5 font-medium text-gray-700 outline-none focus:ring-1 focus:ring-gray-300"
            >
              <option value="ALL">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Category Dropdown Filter */}
          <div className="w-[150px]">
            <select
              value={subCategoryFilter}
              onChange={(e) => handleFilterChange("subCategory", e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-md text-xs h-9 px-3 py-1.5 font-medium text-gray-700 outline-none focus:ring-1 focus:ring-gray-300"
            >
              <option value="ALL">All SubCategories</option>
              {filteredSubCategoryOptions?.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown Filter */}
          <div className="w-[120px]">
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

          {(searchQuery || statusFilter !== "ALL" || categoryFilter !== "ALL" || subCategoryFilter !== "ALL") && (
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
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>SubCategory</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><div className="text-right w-full pr-4">Actions</div></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.map((item) => {
                const isToggling = togglingId === item.id;
                const isDeleting = deletingId === item.id;
                const isBusy = isToggling || isDeleting;

                // =========================
                // RELATIONS
                // =========================
                const parentCategory = categories?.find(
                  (c) => c.id === item.categoryId
                );

                const parentSub = subCategories?.find(
                  (s) => s.id === item.subCategoryId
                );

                const isBlocked =
                  parentCategory?.status === "INACTIVE" ||
                  parentSub?.status === "INACTIVE";

                // 🔥 TOOLTIP MESSAGE
                const tooltipText = isBlocked
                  ? "Activate parent category & sub-category first"
                  : item.status === "ACTIVE"
                  ? "Deactivate"
                  : "Activate";

                return (
                  <TableRow key={item.id}>
                    {/* IMAGE */}
                    <TableCell>
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          className="w-10 h-10 rounded-md object-cover border border-gray-100"
                          alt={item.name}
                        />
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center bg-gray-50 border border-dashed rounded-md text-[10px] font-medium text-gray-400">
                          N/A
                        </div>
                      )}
                    </TableCell>

                    {/* NAME */}
                    <TableCell>
                      <span className="font-semibold text-gray-900">
                        {item.name}
                      </span>
                    </TableCell>

                    {/* CATEGORY */}
                    <TableCell>
                      <span className="text-gray-600 text-sm">
                        {parentCategory?.name || "—"}
                      </span>
                    </TableCell>

                    {/* SUB CATEGORY */}
                    <TableCell>
                      <span className="text-gray-600 text-sm">
                        {parentSub?.name || "—"}
                      </span>
                    </TableCell>

                    {/* STATUS */}
                    <TableCell>
                      <Badge
                        variant="default"
                        className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                          item.status === "ACTIVE"
                            ? "border-green-100 bg-green-50 text-green-700"
                            : "border-red-100 bg-red-50 text-red-700"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell>
                      <div className="flex justify-end items-center gap-1.5 pr-4">
                        
                        {/* STATUS TOGGLE */}
                        <Button
                          variant="secondary"
                          size="icon"
                          disabled={isBusy || isBlocked}
                          title={tooltipText}
                          className={`h-8 w-8 transition-colors ${
                            isBlocked
                              ? "opacity-40 cursor-not-allowed"
                              : item.status === "ACTIVE"
                              ? "bg-green-50/50 hover:bg-green-100/60"
                              : "bg-yellow-50/50 hover:bg-yellow-100/60"
                          }`}
                          onClick={async () => {
                            if (isBusy || isBlocked) return;

                            try {
                              setTogglingId(item.id);
                              await onToggleStatus(item);
                            } catch (e) {
                              console.error(e);
                              showError("Failed to update status");
                            } finally {
                              setTogglingId(null);
                            }
                          }}
                        >
                          <Power
                            size={14}
                            className={
                              isBlocked
                                ? "text-gray-400"
                                : item.status === "ACTIVE"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }
                          />
                        </Button>

                        {/* EDIT */}
                        <Button
                          variant="secondary"
                          size="icon"
                          disabled={isBusy}
                          className="h-8 w-8 hover:bg-gray-100"
                          onClick={() => onEdit(item)}
                          aria-label="Edit"
                          title="Edit"
                        >
                          <Pencil size={14} className="text-gray-500" />
                        </Button>

                        {/* DELETE */}
                        <Button
                          variant="secondary"
                          size="icon"
                          disabled={item.status === "ACTIVE" || isDeleting}
                          className="h-8 w-8 hover:bg-red-50 hover:text-red-600 group"
                          aria-label="Delete"
                          title={item.status === "ACTIVE" ? "Deactivate first" : "Delete"}
                          onClick={async () => {
                            if (isBusy) return;

                            showConfirmToast(
                              `Are you sure you want to delete "${item.name}" ?`,
                              async () => {
                                try {
                                  setDeletingId(item.id);
                                  showWarning(`Deleting "${item.name}"...`);
                                  await onDelete(item);
                                  showSuccess(`"${item.name}" deleted successfully`);
                                } catch (e) {
                                  console.error(e);
                                  showError("Delete failed");
                                } finally {
                                  setDeletingId(null);
                                }
                              }
                            );
                          }}
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} Mini Categories
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