"use client";

import {
  ResponsiveContainer,
  AreaChart, // Switched to AreaChart to allow for gradient fills while keeping the line
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { Card } from "@/shared/components/ui/card";
import { useDashboardRevenueTrend } from "../hooks/useDashboardRevenueTrend";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(value);

export function RevenueTrendChart() {
  const { data } = useDashboardRevenueTrend();
  const chartData = data?.months ?? [];

  return (
    /* Reduced the overall card wrapper size using a standard max-w constraints or parent flex grid */
    <Card className="p-4 border border-slate-100 rounded-xl bg-white shadow-sm flex flex-col justify-between w-full max-w-2xl mx-auto">
      <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Revenue Trend
          </h3>
          <p className="text-[10px] font-medium text-slate-400 mt-0.5">
            Last 6 Months Net Revenue
          </p>
        </div>
      </div>

      {/* Reduced width component container wrapped inside Recharts responsive layer */}
      <div className="h-[210px] w-full px-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            {/* Gradient definition for the area fill beneath the line */}
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            {/* Minimal horizontal lines only */}
            <CartesianGrid
              vertical={false}
              stroke="#f1f5f9"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
              dy={8}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
            />

            <Tooltip
              contentStyle={{
                // MATCHED: Changed to a deep theme-consistent dashboard navy background
                backgroundColor: "#0b1329", 
                border: "none",
                borderRadius: "8px",
                padding: "8px 12px",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.2)",
              }}
              labelStyle={{
                color: "#94a3b8",
                fontSize: "10px",
                fontWeight: 700,
                marginBottom: "2px",
                textTransform: "uppercase",
              }}
              itemStyle={{
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 700,
              }}
              formatter={(value) => [formatCurrency(Number(value)), "Net Revenue"]}
            />

            {/* Used Area component: Acts exactly like a Line but enables our beautiful background color blend */}
            <Area
              type="monotone"
              dataKey="netRevenue"
              stroke="#0ea5e9"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#revenueGradient)"
              dot={{
                r: 4,
                fill: "#ffffff",
                stroke: "#0ea5e9",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "#0ea5e9",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}