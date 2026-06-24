"use client";

import { Card } from "@/shared/components/ui/card";
import { useDashboardOrders } from "../hooks/useDashboardOrders";
import { useDashboardRevenue } from "../hooks/useDashboardRevenue";

type RevenuePeriod = "today" | "week" | "month" | "year";

interface Props {
  period: RevenuePeriod;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export function DashboardStatsCards({ period }: Props) {
  const filters = { period };

  const { data: orders } = useDashboardOrders(filters);
  const { data: revenue } = useDashboardRevenue(filters);

  const stats = [
    {
      title: "Total Orders",
      value: orders?.totalOrders ?? 0,
      trend: "+12.5%",
      positive: true,
      bgClass: "bg-gradient-to-br from-blue-50 to-indigo-50/50 border-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Gross Revenue",
      value: formatCurrency(revenue?.grossRevenue ?? 0),
      trend: "+10.4%",
      positive: true,
      bgClass: "bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Net Revenue",
      value: formatCurrency(revenue?.netRevenue ?? 0),
      trend: "-2.1%",
      positive: false,
      bgClass: "bg-gradient-to-br from-rose-50 to-pink-50/50 border-rose-100",
      iconColor: "text-rose-600",
    },
    {
      title: "Average Order Value",
      value: formatCurrency(revenue?.averageOrderValue ?? 0),
      trend: "+4.8%",
      positive: true,
      bgClass: "bg-gradient-to-br from-cyan-50 to-sky-50/50 border-cyan-100",
      iconColor: "text-cyan-600",
    },
  ];

  return (
    <div className="w-full">
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-4
        "
      >
        {stats.map((item) => (
          <Card
            key={item.title}
            className={`
              p-4
              border
              shadow-sm
              hover:shadow-md
              hover:-translate-y-0.5
              transition-all
              duration-300
              rounded-xl
              flex
              flex-col
              justify-between
              ${item.bgClass}
            `}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <p
                className="
                  text-[11px]
                  font-sans
                  font-bold
                  tracking-wider
                  uppercase
                  text-slate-500/90
                  truncate
                "
              >
                {item.title}
              </p>

              <div
                className={`
                  px-2
                  py-0.5
                  rounded-full
                  text-[10px]
                  font-bold
                  shrink-0
                  shadow-xs
                  ${
                    item.positive
                      ? "bg-emerald-500 text-white"
                      : "bg-rose-500 text-white"
                  }
                `}
              >
                {item.trend}
              </div>
            </div>

            <div>
              <h2
                className={`
                  font-sans
                  font-bold
                  tracking-tight
                  text-slate-950
                  ${
                    typeof item.value === "string"
                      ? "text-xl lg:text-lg xl:text-xl"
                      : "text-2xl"
                  }
                `}
              >
                {item.value}
              </h2>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}