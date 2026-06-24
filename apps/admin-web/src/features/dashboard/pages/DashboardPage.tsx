"use client";

import { useState } from "react";
import { DashboardStatsCards } from "../components/DashboardStatsCards";
import { OrderStatusCard } from "../components/OrderStatusCard";
import { RevenueTrendChart } from "../components/RevenueTrendChart";
import { RecentOrdersTable } from "../components/RecentOrdersTable";
import { DashboardTopProducts } from "../components/DashboardTopProducts";
import { DashboardTopCustomers } from "../components/DashboardTopCustomers";

export type RevenuePeriod = "today" | "week" | "month" | "year";

export function DashboardPage() {
  const [period, setPeriod] = useState<RevenuePeriod>("month");

  return (
    <div className="space-y-5 w-full">
      {/* 1. Main KPI Statistics Row (Receives period state) */}
      <DashboardStatsCards period={period} />

      {/* 2. Horizontal Distribution Row (Hosts the filter dropdown) */}
      <OrderStatusCard period={period} onPeriodChange={setPeriod} />

      {/* 3. Midsection Row: Divided exactly 50/50 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <div className="flex flex-col">
          <RevenueTrendChart />
        </div>
        <div className="flex flex-col">
          <DashboardTopProducts period={period} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <DashboardTopCustomers period={period} />
        </div>
        <div className="lg:col-span-2">
          <RecentOrdersTable period={period} />
        </div>
      </div>
    </div>
  );
}