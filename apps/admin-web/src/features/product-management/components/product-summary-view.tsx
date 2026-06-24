"use client";

import { Badge } from "@/shared/components/ui/badge";

interface Props {
  data: any;
}

export function ProductSummaryView({ data }: Props) {
  return (
    <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-8 space-y-6">
      <h3 className="text-lg font-bold text-gray-900">Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left Column: Status */}
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Type</p>
            <p className="text-sm font-bold text-gray-700">{data.type || "SIMPLE"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</p>
            <Badge variant={data.status === "ACTIVE" ? "success" : "default"} className="mt-1">
              {data.status || "ACTIVE"}
            </Badge>
          </div>
        </div>

        {/* Center Column: Categories */}
        <div className="space-y-4 border-x border-gray-200 px-12">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Categories</p>
            <div className="space-y-1">
              <SummaryItem label="Category" value={data.categoryId ? "Selected" : "-"} />
              <SummaryItem label="Sub Category" value={data.subCategoryId ? "Selected" : "-"} />
              <SummaryItem label="Mini Category" value={data.miniCategoryId ? "Selected" : "-"} />
              <SummaryItem label="Brand" value={data.brandId ? "Selected" : "-"} />
            </div>
          </div>
        </div>

        {/* Right Column: Media */}
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Media</p>
            <div className="space-y-1">
              <SummaryItem 
                label="Main Image" 
                value={data.mainImage ? "Selected" : "Not selected"} 
                isHighlight={!!data.mainImage} 
              />
              <SummaryItem 
                label="Additional Images" 
                value={`${data.images?.length || 0}`} 
              />
              <SummaryItem 
                label="Total Variants" 
                value={`${data.variants?.length || 0}`} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ label, value, isHighlight }: { label: string, value: string, isHighlight?: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}:</span>
      <span className={`font-medium ${isHighlight ? "text-purple-600" : "text-gray-800"}`}>
        {value}
      </span>
    </div>
  );
}