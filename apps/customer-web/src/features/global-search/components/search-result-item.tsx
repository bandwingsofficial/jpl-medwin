"use client";

import Image from "next/image";
import { FolderTree, Package, Tags } from "lucide-react";

import { SearchResult } from "../types/global-search.types";

interface Props {
  item: SearchResult;
  onSelect: (item: SearchResult) => void;
}

export function SearchResultItem({
  item,
  onSelect,
}: Props) {
  const getIcon = () => {
    switch (item.type) {
      case "PRODUCT":
        return item.image ? (
          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="56px"
              className="object-contain p-1 transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
            <Package className="h-6 w-6 text-slate-400" />
          </div>
        );

      case "BRAND":
        return (
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
            <Tags className="h-6 w-6 text-[#0BACAE]" />
          </div>
        );

      default:
        return (
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
            <FolderTree className="h-6 w-6 text-slate-500" />
          </div>
        );
    }
  };

  const discount =
    item.price &&
    item.mrp &&
    item.mrp > item.price
      ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
      : 0;

  return (
    <button
      onClick={() => onSelect(item)}
      className="
        group
        flex
        w-full
        items-center
        gap-4
        rounded-xl
        px-4
        py-3
        transition-all
        duration-200
        hover:bg-slate-50
      "
    >
      {getIcon()}

      <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
        <div className="min-w-0 flex-1 text-left">
          <h4 className="truncate text-[15px] font-semibold text-slate-900">
            {item.name}
          </h4>

          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
            {item.type}
          </p>

          {item.type === "PRODUCT" &&
            item.price !== undefined &&
            item.price !== null && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-base font-bold text-[#0BACAE]">
                  ₹{Number(item.price).toLocaleString()}
                </span>

                {item.mrp !== undefined &&
  item.mrp !== null &&
  Number(item.mrp) > 0 &&
  Number(item.mrp) > Number(item.price) && (
                    <>
                      <span className="text-xs text-slate-400 line-through">
                        ₹{Number(item.mrp).toLocaleString()}
                      </span>

                      <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                        {discount}% OFF
                      </span>
                    </>
                  )}
              </div>
            )}
        </div>

        {item.type === "PRODUCT" && (
          <span className="rounded-md border border-[#0BACAE] px-3 py-1 text-xs font-semibold text-[#0BACAE] transition-colors duration-200 group-hover:bg-[#0BACAE] group-hover:text-white">
            View
          </span>
        )}
      </div>
    </button>
  );
}