"use client";

import { Card } from "@/shared/components/ui/card";
import { useDashboardRecentOrders } from "../hooks/useDashboardRecentOrders";

interface Props {
  period: "today" | "week" | "month" | "year";
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(value);

// Helper function to return beautiful status badge colors dynamically
const getStatusStyles = (status: string) => {
  const norm = status?.toLowerCase() || "";
  if (norm.includes("deliver")) return "bg-emerald-50 text-emerald-700 border-emerald-100/80";
  if (norm.includes("pend")) return "bg-amber-50 text-amber-700 border-amber-100/80";
  if (norm.includes("fail") || norm.includes("cancel")) return "bg-rose-50 text-rose-700 border-rose-100/80";
  if (norm.includes("process")) return "bg-purple-50 text-purple-700 border-purple-100/80";
  return "bg-blue-50 text-blue-700 border-blue-100/80";
};

export function RecentOrdersTable({ period }: Props) {
  const { data } = useDashboardRecentOrders({ period });

  // Safe fallback to an empty array slice if data hasn't arrived or is empty
  const orderList = data?.orders?.slice(0, 5) ?? [];

  // Creates an explicit 5-slot structure to hold the table rows' exact dimensions
  const displayRows = Array.from({ length: 5 }, (_, i) => orderList[i] || null);

  return (
    <Card className="p-4 border border-slate-100 rounded-xl bg-white shadow-sm h-full flex flex-col justify-between">
      <div>
        {/* Tightened Header Configuration */}
        <div className="flex items-baseline justify-between border-b border-slate-100 pb-3 mb-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Recent Orders
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-3 px-2">
                  Order ID
                </th>
                <th className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-3 px-2">
                  Fulfillment
                </th>
                <th className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-3 px-2">
                  Payment Status
                </th>
                <th className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-3 px-2 text-right">
                  Amount
                </th>
                <th className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-3 px-2 text-right">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {displayRows.map((order, index) => {
                if (!order) {
                  // Structural spacer row to keep total table box footprint exact and static
                  return (
                    <tr key={`empty-order-row-${index}`} className="h-[39px]">
                      <td colSpan={5} className="py-2.5 px-2">&nbsp;</td>
                    </tr>
                  );
                }

                return (
                  <tr
                    key={order.id}
                    className="
                      transition-colors 
                      duration-150 
                      hover:bg-slate-50/50
                      h-[39px]
                    "
                  >
                    {/* Order Code */}
                    <td className="py-2.5 px-2 text-xs font-bold text-slate-900 tracking-tight">
                      {order.orderNumber}
                    </td>

                    {/* Order Status Badge */}
                    <td className="py-2.5 px-2">
                      <span
                        className={`
                          inline-flex 
                          items-center 
                          px-2 
                          py-0.5 
                          rounded-md 
                          text-[10px] 
                          font-bold 
                          border
                          capitalize
                          ${getStatusStyles(order.status)}
                        `}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Payment Status Badge */}
                    <td className="py-2.5 px-2">
                      <span
                        className={`
                          inline-flex 
                          items-center 
                          px-2 
                          py-0.5 
                          rounded-md 
                          text-[10px] 
                          font-bold 
                          border
                          capitalize
                          ${getStatusStyles(order.paymentStatus)}
                        `}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* Formatted Pricing */}
                    <td className="py-2.5 px-2 text-xs font-extrabold text-slate-900 text-right tracking-tight">
                      {formatCurrency(order.grandTotal)}
                    </td>

                    {/* Date Column */}
                    <td className="py-2.5 px-2 text-xs font-medium text-slate-500 text-right">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}