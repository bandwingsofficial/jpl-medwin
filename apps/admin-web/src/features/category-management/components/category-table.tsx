"use client";

import { useState, useMemo } from "react";
import { Category } from "@/features/category-management/types/category.type";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Loader } from "@/shared/components/ui/loader";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";

import { Pencil, Trash2, Power, ChevronLeft, ChevronRight, Search, X } from "lucide-react";

interface Props {
  data: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
}

export function CategoryTable({
  data,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
}: Props) {
  // 🔥 SEARCH & FILTER STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // 🔥 PAGINATION STATES (Max 10 per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // =========================================
  // FILTER MEMO LAYER
  // =========================================
  const filteredData = useMemo(() => {
    if (!data) return [];
    
    return data.filter((cat) => {
      const matchesSearch =
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ? true : cat.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  if (isLoading) return <Loader />;

  if (!data || data.length === 0) {
    return <EmptyState title="No categories found" />;
  }

  // =========================================
  // PAGINATION MATH LAYER
  // =========================================
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

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

  return (
    <div className="space-y-4 w-full flex flex-col">
      
      {/* ✨ FILTER PANEL BAR */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by category name or slug..."
            className="pl-9 bg-gray-50/50 border-gray-200 text-sm h-9"
            value={searchQuery}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Using your custom project Select component */}
          <div className="w-[140px]">
            <Select 
              value={statusFilter} 
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="bg-gray-50/50 border-gray-200 text-xs h-9 py-1.5"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </Select>
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

      {/* 👉 FIX: Strict overflow hidden prevents raw unstyled horizontal scrollbars */}
      <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col shadow-sm">
        <div className="w-full overflow-hidden">
          <table className="w-full text-sm border-collapse">
            
            {/* HEADER */}
            <thead className="bg-gray-50/70 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Slug</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Created</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-gray-100">
              {paginatedData.length > 0 ? (
                paginatedData.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* IMAGE */}
                    <td className="px-5 py-3 whitespace-nowrap">
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="w-10 h-10 rounded-md object-cover border border-gray-100"
                        />
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center text-[10px] font-medium text-gray-400 border border-dashed rounded-md bg-gray-50">
                          N/A
                        </div>
                      )}
                    </td>

                    {/* NAME */}
                    <td className="px-5 py-3 font-semibold text-gray-900 whitespace-nowrap">
                      {cat.name}
                    </td>

                    {/* SLUG */}
                    <td className="px-5 py-3 text-gray-500 font-mono text-xs whitespace-nowrap">
                      {cat.slug}
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-3 whitespace-nowrap">
                      <Badge
                        variant="default"
                        className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                          cat.status === "ACTIVE"
                            ? "border-green-100 bg-green-50 text-green-700"
                            : "border-red-100 bg-red-50 text-red-600"
                        }`}
                      >
                        {cat.status}
                      </Badge>
                    </td>

                    {/* CREATED */}
                    <td className="px-5 py-3 text-gray-600 text-xs whitespace-nowrap">
                      {new Date(cat.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex justify-end items-center gap-1.5">

                        {/* TOGGLE */}
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-100"
                          onClick={() => onToggleStatus(cat)}
                          title="Toggle Status"
                        >
                          <Power
                            size={14}
                            className={
                              cat.status === "ACTIVE"
                                ? "text-green-600"
                                : "text-gray-400"
                            }
                          />
                        </Button>

                        {/* EDIT */}
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-100"
                          onClick={() => onEdit(cat)}
                          title="Edit"
                        >
                          <Pencil size={14} className="text-gray-500" />
                        </Button>

                        {/* DELETE */}
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-50 hover:text-red-600 group"
                          disabled={cat.status === "ACTIVE"}
                          onClick={() => onDelete(cat)}
                          title="Delete"
                        >
                          <Trash2 size={14} className="text-gray-500 group-hover:text-red-600" />
                        </Button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="h-32 text-center text-gray-400 text-sm">
                    No categories found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* ✨ MINI FOOTER PAGINATION MODULE */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
            <span className="text-xs font-medium text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} Categories
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