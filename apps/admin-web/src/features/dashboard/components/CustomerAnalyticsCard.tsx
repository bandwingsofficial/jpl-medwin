"use client";

import { Card } from "@/shared/components/ui/card";

import { useDashboardCustomers } from "../hooks/useDashboardCustomers";

interface Props {
  period:
    | "today"
    | "week"
    | "month"
    | "year";
}

export function CustomerAnalyticsCard({
  period,
}: Props) {
  const { data } =
    useDashboardCustomers({
      period,
    });

  return (
    <Card className="p-6 border-slate-200">
      <div className="mb-5">
        <h3 className="text-lg font-semibold">
          Customer Analytics
        </h3>

        <p className="text-xs text-slate-500 mt-1">
          Customer insights overview
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-slate-500">
            Total Customers
          </span>

          <span className="font-semibold">
            {data?.totalCustomers ?? 0}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">
            Repeat Customers
          </span>

          <span className="font-semibold">
            {data?.repeatCustomers ?? 0}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">
            Avg Orders / Customer
          </span>

          <span className="font-semibold">
            {data?.averageOrdersPerCustomer ??
              0}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">
            Avg Spend / Customer
          </span>

          <span className="font-semibold">
            ₹
            {data?.averageSpendPerCustomer ??
              0}
          </span>
        </div>
      </div>
    </Card>
  );
}