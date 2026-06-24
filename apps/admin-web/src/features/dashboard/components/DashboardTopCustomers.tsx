"use client";

import { Card } from "@/shared/components/ui/card";
import { useDashboardTopCustomers } from "../hooks/useDashboardTopCustomers";
import { CustomerDisplayName } from "./CustomerDisplayName";

interface Props {
  period: "today" | "week" | "month" | "year";
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(value);

export function DashboardTopCustomers({ period }: Props) {
  const filters = { period };
  const { data: customers } = useDashboardTopCustomers(filters);

  // Fallback to empty array if no data, sliced safely to max 5
  const customerList = customers?.customers?.slice(0, 5) ?? [];
  
  // Creates an explicit 5-slot array to guarantee identical height regardless of data state
  const displayRows = Array.from({ length: 5 }, (_, i) => customerList[i] || null);

  return (
    <Card className="p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Top Customers
        </h3>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
          By Revenue
        </span>
      </div>

      {/* min-h container combined with fixed-height rows keeps layouts perfectly symmetric */}
      <div className="space-y-1 min-h-[220px] flex flex-col justify-between">
        {displayRows.map((customer, index) => {
          if (!customer) {
            // Renders an empty invisible slot that preserves exact line padding/dimensions
            return (
              <div 
                key={`empty-customer-row-${index}`} 
                className="h-[44px] w-full flex items-center justify-between p-2 border border-transparent"
              />
            );
          }

          return (
            <div
              key={customer.userId}
              className="
                flex
                justify-between
                items-center
                p-2
                rounded-lg
                transition-all
                duration-150
                hover:bg-slate-50/70
                group
                h-[44px]
              "
            >
              <div className="flex items-center gap-3">
                {/* Elegant User Initial/Avatar Shell */}
                <div className="w-7 h-7 rounded-full bg-slate-900/5 flex items-center justify-center text-[10px] font-extrabold text-slate-600 tracking-tight shrink-0 border border-slate-100">
                  C{index + 1}
                </div>

                <div className="space-y-0.5">
                  <CustomerDisplayName customerId={customer.userId} />

                  <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                    Total Orders
                    <span className="text-slate-700 font-extrabold bg-slate-100 px-1.5 py-0.2 rounded text-[10px]">
                      {customer.totalOrders}
                    </span>
                  </p>
                </div>
              </div>

              <p className="text-xs font-extrabold text-slate-900 tracking-tight">
                {formatCurrency(customer.totalSpent)}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}