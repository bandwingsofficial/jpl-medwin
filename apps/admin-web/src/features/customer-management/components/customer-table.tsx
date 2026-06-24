"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, UserX } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Loader } from "@/shared/components/ui/loader";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Customer } from "@/features/customer-management/types/customer.types";
import { CustomerStatusBadge } from "./customer-status-badge";

interface Props {
  data: Customer[];
  isLoading: boolean;
  onView: (customer: Customer) => void;
  onDeactivate: (customer: Customer) => void;
}

export function CustomerTable({ data, isLoading, onView, onDeactivate }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (isLoading) return <Loader />;
  if (!data.length) return <EmptyState title="No customers found" />;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50/80 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-600">Customer</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-600">Phone</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-600">Orders</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-600">Total Spent</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-600">Joined</th>
              <th className="px-6 py-4 text-right font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{customer.name ?? "-"}</p>
                  <p className="text-xs text-gray-500">{customer.email ?? "-"}</p>
                </td>
                <td className="px-6 py-4 text-gray-600">{customer.phoneNumber ?? "-"}</td>
                <td className="px-6 py-4 text-gray-600">{customer.totalOrders}</td>
                <td className="px-6 py-4 font-medium text-gray-900">₹{customer.totalSpent.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <CustomerStatusBadge isActive={customer.isActive} />
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(customer.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => onView(customer)}>
                      <Eye size={16} />
                    </Button>
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
          <span className="text-xs text-gray-500">
            Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, data.length)} of {data.length}
          </span>
          <div className="flex gap-1">
            <Button size="sm" variant="primary" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
              <ChevronLeft size={16} />
            </Button>
            <Button size="sm" variant="primary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}