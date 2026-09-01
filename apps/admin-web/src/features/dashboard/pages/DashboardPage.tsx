"use client";

import { useState } from "react";

import { DashboardStatsCards } from "../components/DashboardStatsCards";
import { OrderStatusCard } from "../components/OrderStatusCard";
import { RevenueTrendChart } from "../components/RevenueTrendChart";
import { RecentOrdersTable } from "../components/RecentOrdersTable";
import { DashboardTopProducts } from "../components/DashboardTopProducts";
import { DashboardTopCustomers } from "../components/DashboardTopCustomers";

import type {
  DashboardFilterPeriod,
  DashboardFilters,
} from "../types/dashboard.types";

export function DashboardPage() {
  const [period, setPeriod] =
    useState<DashboardFilterPeriod>("month");

  const [filters, setFilters] =
    useState<DashboardFilters>({
      period: "month",
    });

  const handleFiltersChange = (
    newFilters: DashboardFilters,
    newFilterPeriod: DashboardFilterPeriod
  ) => {
    setFilters(newFilters);
    setPeriod(newFilterPeriod);
  };

  return (
    <div className="space-y-5 w-full">
      {/* 1. Main KPI Statistics */}
      <DashboardStatsCards
        filters={filters}
      />

      {/* 2. Order Status + Date Filter */}
      <OrderStatusCard
        filters={filters}
        filterPeriod={period}
        onFiltersChange={handleFiltersChange}
      />

      {/* 3. Midsection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <div className="flex flex-col">
          <RevenueTrendChart
            filters={filters}
          />
        </div>

        <div className="flex flex-col">
          <DashboardTopProducts
            filters={filters}
          />
        </div>
      </div>

      {/* 4. Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <DashboardTopCustomers
            filters={filters}
          />
        </div>

        <div className="lg:col-span-2">
          <RecentOrdersTable
            filters={filters}
          />
        </div>
      </div>
    </div>
  );
}