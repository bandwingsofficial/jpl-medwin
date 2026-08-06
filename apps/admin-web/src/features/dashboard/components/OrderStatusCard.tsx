"use client";

import { Card } from "@/shared/components/ui/card";
import { useDashboardOrderStatus } from "../hooks/useDashboardOrderStatus";

type RevenuePeriod = "today" | "week" | "month" | "year";

interface Props {
  period: RevenuePeriod;
  onPeriodChange: (period: RevenuePeriod) => void;
}

export function OrderStatusCard({ period, onPeriodChange }: Props) {
  const { data } = useDashboardOrderStatus({ period });

  const statuses = [
    {
      label: "Confirmed",
      value: data?.confirmed ?? 0,
      dotColor: "bg-blue-500",
      textColor: "text-blue-700",
      bgClass: "hover:border-blue-200/60 hover:bg-blue-50/20",
    },
    {
      label: "Delivered",
      value: data?.delivered ?? 0,
      dotColor: "bg-emerald-500",
      textColor: "text-emerald-700",
      bgClass: "hover:border-emerald-200/60 hover:bg-emerald-50/20",
    },
    {
      label: "Pending",
      value: data?.pending ?? 0,
      dotColor: "bg-amber-500",
      textColor: "text-amber-700",
      bgClass: "hover:border-amber-200/60 hover:bg-amber-50/20",
    },
    {
      label: "Processing",
      value: data?.processing ?? 0,
      dotColor: "bg-purple-500",
      textColor: "text-purple-700",
      bgClass: "hover:border-purple-200/60 hover:bg-purple-50/20",
    },
    {
      label: "Shipped",
      value: data?.shipped ?? 0,
      dotColor: "bg-indigo-500",
      textColor: "text-indigo-700",
      bgClass: "hover:border-indigo-200/60 hover:bg-indigo-50/20",
    },
  ];

  return (
    <Card className="p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
      {/* Reconfigured Header: Houses the dropdown beautifully on the right side */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Order Status
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
            Distribution
          </p>
          <select
            value={period}
            onChange={(e) => onPeriodChange(e.target.value as RevenuePeriod)}
            className="
              px-3
              py-1.5
              bg-white
              border
              border-slate-200
              rounded-md
              text-xs
              font-medium
              text-slate-600
              focus:outline-none
              focus:ring-1
              focus:ring-primary
              focus:border-primary
              transition-colors
              cursor-pointer
            "
          >
            <option value="today">Today</option>
            <option value="week">7 Days</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>
      </div>

      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-3
          lg:grid-cols-5
          gap-2.5
        "
      >
        {statuses.map((item) => (
          <div
            key={item.label}
            className={`
              flex
              items-center
              justify-between
              p-2
              bg-slate-50/40
              border
              border-slate-100
              rounded-lg
              transition-all
              duration-200
              ${item.bgClass}
            `}
          >
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.dotColor}`} />
              <span className="text-xs font-semibold text-slate-600">
                {item.label}
              </span>
            </div>
            <span className={`text-xs font-bold tracking-tight ${item.textColor}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}