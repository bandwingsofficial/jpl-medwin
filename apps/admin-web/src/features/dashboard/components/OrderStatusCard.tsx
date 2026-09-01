"use client";

import { useEffect, useState } from "react";

import { Card } from "@/shared/components/ui/card";
import { useRouter } from "next/navigation";
import type {
  DashboardFilterPeriod,
  DashboardFilters,
} from "../types/dashboard.types";

import { useDashboardOrderStatus } from "../hooks/useDashboardOrderStatus";

interface Props {
  filters: DashboardFilters;
  filterPeriod: DashboardFilterPeriod;
  onFiltersChange: (
    filters: DashboardFilters,
    filterPeriod: DashboardFilterPeriod
  ) => void;
}

export function OrderStatusCard({
  filters,
  filterPeriod,
  onFiltersChange,
}: Props) {

  const router = useRouter();

const handleStatusClick = (status: string) => {
  router.push(`/orders?status=${encodeURIComponent(status)}`);
};


  const { data } =
    useDashboardOrderStatus(filters);

  const [from, setFrom] = useState(
    filters.from ?? ""
  );

  const [to, setTo] = useState(
    filters.to ?? ""
  );

  const [showCustomRange, setShowCustomRange] =
    useState(
      filterPeriod === "custom"
    );

  useEffect(() => {
    if (filterPeriod === "custom") {
      setFrom(filters.from ?? "");
      setTo(filters.to ?? "");
    }
  }, [
    filters.from,
    filters.to,
    filterPeriod,
  ]);

  const handlePeriodChange = (
    value: DashboardFilterPeriod
  ) => {
    if (value === "custom") {
      setShowCustomRange(true);

      return;
    }

    setShowCustomRange(false);

    onFiltersChange(
      {
        period: value,
      },
      value
    );
  };

  const handleApplyCustomRange = () => {
  if (!from || !to) {
    return;
  }

  if (new Date(from) > new Date(to)) {
    return;
  }

  onFiltersChange(
    {
      period: "custom",
      from,
      to,
    },
    "custom"
  );

  setShowCustomRange(false);
};

  const handleCancelCustomRange = () => {
    setFrom(
      filters.from ?? ""
    );

    setTo(
      filters.to ?? ""
    );

    setShowCustomRange(false);
  };

  const statuses = [
    {
      label: "Confirmed",
      value: data?.confirmed ?? 0,
      dotColor: "bg-blue-500",
      textColor: "text-blue-700",
       status: "CONFIRMED",
      bgClass:
        "hover:border-blue-200/60 hover:bg-blue-50/20",
    },
    {
      label: "Delivered",
      status: "DELIVERED",
      value: data?.delivered ?? 0,
      dotColor: "bg-emerald-500",
      textColor: "text-emerald-700",
      bgClass:
        "hover:border-emerald-200/60 hover:bg-emerald-50/20",
    },
    {
      label: "Pending",
      status: "PENDING_PAYMENT",
      value: data?.pending ?? 0,
      dotColor: "bg-amber-500",
      textColor: "text-amber-700",
      bgClass:
        "hover:border-amber-200/60 hover:bg-amber-50/20",
    },
    {
      label: "Processing",
      value: data?.processing ?? 0,
      dotColor: "bg-purple-500",
       status: "PROCESSING",
      textColor: "text-purple-700",
      bgClass:
        "hover:border-purple-200/60 hover:bg-purple-50/20",
    },
    {
      label: "Shipped",
      value: data?.shipped ?? 0,
      dotColor: "bg-indigo-500",
      status: "SHIPPED",
      textColor: "text-indigo-700",
      bgClass:
        "hover:border-indigo-200/60 hover:bg-indigo-50/20",
    },
  ];

  return (
    <Card className="relative overflow-visible p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-3 mb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Order Status
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
            Distribution
          </p>

          <select
            value={
              showCustomRange ||
              filterPeriod === "custom"
                ? "custom"
                : filterPeriod
            }
            onChange={(e) =>
              handlePeriodChange(
                e.target
                  .value as DashboardFilterPeriod
              )
            }
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
            <option value="today">
              Today
            </option>

            <option value="week">
              7 Days
            </option>

            <option value="month">
              Month
            </option>

            <option value="year">
              Year
            </option>

            <option value="custom">
              Custom Range
            </option>
          </select>
        </div>
      </div>

      {showCustomRange && (
        <div
          className="
            absolute
            right-4
            top-[76px]
            z-50
            w-[min(100%,500px)]
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-xl
          "
        >
          <div className="mb-5">
            <h4 className="text-base font-bold text-slate-800">
              Select Date Range
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Choose the period for dashboard data.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-600">
                From Date
              </label>

              <input
                type="date"
                value={from}
                max={to || undefined}
                onChange={(e) =>
                  setFrom(
                    e.target.value
                  )
                }
                className="
                  h-11
                  px-3
                  border
                  border-slate-200
                  rounded-lg
                  text-sm
                  text-slate-700
                  outline-none
                  focus:border-primary
                  focus:ring-1
                  focus:ring-primary
                "
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-600">
                To Date
              </label>

              <input
                type="date"
                value={to}
                min={from || undefined}
                onChange={(e) =>
                  setTo(
                    e.target.value
                  )
                }
                className="
                  h-11
                  px-3
                  border
                  border-slate-200
                  rounded-lg
                  text-sm
                  text-slate-700
                  outline-none
                  focus:border-primary
                  focus:ring-1
                  focus:ring-primary
                "
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={
                handleCancelCustomRange
              }
              className="
                h-10
                px-5
                rounded-lg
                border
                border-slate-200
                bg-white
                text-sm
                font-semibold
                text-slate-600
                transition-colors
                hover:bg-slate-50
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={
                handleApplyCustomRange
              }
              disabled={
                !from ||
                !to ||
                new Date(from) >
                  new Date(to)
              }
              className="
h-10
      rounded-xl
      bg-teal-600
      px-4
      text-sm
      font-semibold
      text-white
      shadow-[0_6px_20px_rgba(13,148,136,0.22)]
      transition-all
      duration-200
      hover:-translate-y-[1px]
      hover:bg-teal-700
      hover:shadow-[0_8px_24px_rgba(13,148,136,0.28)]
      disabled:pointer-events-none
      disabled:opacity-50
              "
            >
              Apply
            </button>
          </div>
        </div>
      )}

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
  <button
    key={item.label}
    type="button"
    onClick={() => handleStatusClick(item.status)}
    className={`
      flex
      items-center
      justify-between
      w-full
      p-2
      bg-slate-50/40
      border
      border-slate-100
      rounded-lg
      transition-all
      duration-200
      cursor-pointer
      text-left
      ${item.bgClass}
    `}
  >
            <div className="flex items-center gap-2">
              <span
                className={`
                  w-1.5
                  h-1.5
                  rounded-full
                  shrink-0
                  ${item.dotColor}
                `}
              />

              <span className="text-xs font-semibold text-slate-600">
                {item.label}
              </span>
            </div>

            <span
              className={`
                text-xs
                font-bold
                tracking-tight
                ${item.textColor}
              `}
            >
              {item.value}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}