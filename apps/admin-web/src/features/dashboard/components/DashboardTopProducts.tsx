"use client";

import { Card } from "@/shared/components/ui/card";
import { useDashboardTopProducts } from "../hooks/useDashboardTopProducts";

interface Props {
  period: "today" | "week" | "month" | "year";
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(value);

export function DashboardTopProducts({ period }: Props) {
  const filters = { period };
  const { data: products } = useDashboardTopProducts(filters);

  // Safe fallback to an empty array slice if data hasn't arrived or is empty
  const productList = products?.products?.slice(0, 5) ?? [];

  // Creates an explicit 5-slot structure to hold the card's exact dimensions
  const displayRows = Array.from({ length: 5 }, (_, i) => productList[i] || null);

  // Calculate totals and cumulative data for the SVG Pie/Donut Chart
  const totalVolume = productList.reduce((sum, p) => sum + p.quantitySold, 0);
  
  // Tailwind color palette mapping for the 5 slots
  const chartColors = [
    "#3b82f6", // Blue (Product 1)
    "#10b981", // Emerald (Product 2)
    "#f59e0b", // Amber (Product 3)
    "#8b5cf6", // Purple (Product 4)
    "#ec4899", // Pink (Product 5)
  ];

  let accumulatedPercentage = 0;

  return (
    <Card className="p-4 border border-slate-100 rounded-xl bg-white shadow-sm w-full">
      {/* Header section preserved entirely */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Top Products
        </h3>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
          By Volume
        </span>
      </div>

      {/* Main Grid Wrapper: Left for Pie Chart, Right for Product List */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center min-h-[220px]">
        
        {/* LEFT SIDE: Simple, Beautiful SVG Donut Chart */}
        <div className="md:col-span-4 flex flex-col items-center justify-center relative">
          {totalVolume === 0 ? (
            // Fallback Empty State State for Chart
            <div className="w-32 h-32 rounded-full border-4 border-dashed border-slate-100 flex items-center justify-center text-[10px] text-slate-400 font-medium">
              No Data
            </div>
          ) : (
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="3.5" />
                
                {/* Dynamic Pie Segments */}
                {productList.map((product, index) => {
                  const percentage = (product.quantitySold / totalVolume) * 100;
                  const strokeDashArray = `${percentage} ${100 - percentage}`;
                  const strokeDashOffset = 100 - accumulatedPercentage;
                  accumulatedPercentage += percentage;

                  return (
                    <circle
                      key={`pie-seg-${product.productId}`}
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="transparent"
                      stroke={chartColors[index]}
                      strokeWidth="3.8"
                      strokeDasharray={strokeDashArray}
                      strokeDashoffset={strokeDashOffset}
                      className="transition-all duration-500 ease-out"
                    />
                  );
                })}
              </svg>
              {/* Inner Label for Donut Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</span>
                <span className="text-sm font-black text-slate-800">{totalVolume}</span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: 5 Products List (Preserving all original UI structures and rules) */}
        <div className="md:col-span-8 space-y-1 flex flex-col justify-between h-full">
          {displayRows.map((product, index) => {
            if (!product) {
              {/* Invisible structural layout placeholder keeping height exactly aligned with graph */}
              return (
                <div
                  key={`empty-product-row-${index}`}
                  className="h-[44px] w-full flex items-center justify-between p-2 border border-transparent"
                />
              );
            }

            return (
              <div
                key={product.productId}
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
                  {/* Premium Index Numbering with Contextual Color Indicators */}
                  <span 
                    className="text-[10px] font-extrabold text-white w-5 h-5 rounded-md flex items-center justify-center border transition-colors shadow-sm"
                    style={{ backgroundColor: chartColors[index], borderColor: chartColors[index] }}
                  >
                    {index + 1}
                  </span>

                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800 tracking-tight">
                      {product.productName}
                    </p>

                    <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                      Units Sold
                      <span className="text-slate-700 font-extrabold bg-slate-100 px-1.5 py-0.2 rounded text-[10px]">
                        {product.quantitySold}
                      </span>
                    </p>
                  </div>
                </div>

                <p className="text-xs font-extrabold text-slate-900 tracking-tight">
                  {formatCurrency(product.revenue)}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </Card>
  );
}