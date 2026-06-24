"use client";

import { useMemo, useState } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { ReturnRequest } from "../types/return.type";
import { ReturnStatusBadge } from "./return-status-badge";

interface Props {
  returns: ReturnRequest[];
  onView: (returnRequest: ReturnRequest) => void;
}

export default function ReturnTable({ returns, onView }: Props) {
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(returns.length / ITEMS_PER_PAGE);

  const paginatedReturns = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return returns.slice(start, end);
  }, [returns, currentPage]);

  if (!returns?.length) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white py-12 text-center text-sm text-gray-500 shadow-sm">
        No return requests found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* TABLE CONTAINER */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left">
            {/* THEAD */}
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4 font-semibold">Return ID</th>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Created</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            {/* TBODY */}
            <tbody className="divide-y divide-gray-50 bg-white">
              {paginatedReturns.map((returnRequest) => (
                <tr
                  key={returnRequest.id}
                  className="group transition-colors hover:bg-gray-50/50"
                >
                  {/* RETURN ID */}
                  <td className="max-w-[220px] px-6 py-4">
                    <p className="truncate text-sm font-medium text-gray-800" title={returnRequest.id}>
                      {returnRequest.id}
                    </p>
                  </td>

                  {/* ORDER ID */}
                  <td className="max-w-[220px] px-6 py-4">
                    <p className="truncate text-sm text-gray-600" title={returnRequest.orderId}>
                      {returnRequest.orderId}
                    </p>
                  </td>

                  {/* TYPE */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium tracking-wide text-blue-700 ring-1 ring-inset ring-blue-700/10 uppercase">
                      {returnRequest.type}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ReturnStatusBadge status={returnRequest.status} />
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {new Date(returnRequest.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex justify-end">
                      <button
                        onClick={() => onView(returnRequest)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 shadow-sm"
                      >
                        <Eye size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-800">
            {(currentPage - 1) * ITEMS_PER_PAGE + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium text-gray-800">
            {Math.min(currentPage * ITEMS_PER_PAGE, returns.length)}
          </span>{" "}
          of <span className="font-medium text-gray-800">{returns.length}</span> returns
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm">
            {currentPage} / {totalPages}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}