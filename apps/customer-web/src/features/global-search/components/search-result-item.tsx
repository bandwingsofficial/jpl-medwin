"use client";

import { SearchResult } from "../types/global-search.types";
import { Package, Tags, FolderTree } from "lucide-react";
import Image from "next/image";
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
    <Image
  src={item.image}
  alt={item.name}
  width={40}
  height={40}
  className="h-10 w-10 rounded-md object-contain bg-white"
/>
  ) : (
    <Package className="h-4 w-4" />
  );
      case "BRAND":
        return <Tags className="h-4 w-4" />;

      default:
        return <FolderTree className="h-4 w-4" />;
    }
  };

  return (
    <button
      onClick={() => onSelect(item)}
      className="
        w-full
        flex
        items-center
        justify-between
        px-4
        py-3
        hover:bg-slate-50
        transition
      "
    >
      <div className="flex items-center gap-3">
        {getIcon()}

        <div className="text-left">
          <p className="text-sm font-medium text-slate-900">
            {item.name}
          </p>

          <p className="text-xs text-slate-500">
            {item.type}
          </p>
        </div>
      </div>
    </button>
  );
}