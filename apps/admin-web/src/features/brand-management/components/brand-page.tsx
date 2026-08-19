"use client";
import Link from "next/link";
import {
  ChevronRight,
  Home,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Brand } from "../types/brand.type";
import BrandTable from "./brand-table";
import CreateBrandModal from "./create-brand-modal";
import { BrandPageSkeleton } from "./brand-page-skeleton";
// Imported hook to fetch data metrics for the dynamic counter badge
import { useBrands } from "../hooks/use-brand"; 

export default function BrandPage() {
  const { data: brands = [], isLoading } = useBrands();
  
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Brand | null>(null);

  const handleCreate = () => {
    setSelected(null);
    setOpen(true);
  };

  const handleEdit = (brand: Brand) => {
    setSelected(brand);
    setOpen(true);
  };
  if (isLoading) {
  return <BrandPageSkeleton />;
}

return (
  <div
  className="
    w-full
    min-w-0
    overflow-hidden
    space-y-5
    px-1
    pb-2
    md:px-2
    md:pb-5
  "
>
    {/* BREADCRUMBS */}

    <div className="flex items-center gap-2 text-sm">
      <Link
        href="/"
        className="
          inline-flex
          items-center
          gap-1.5
          font-medium
          text-slate-500
          transition-colors
          hover:text-teal-600
        "
      >
        <Home className="h-4 w-4" />
        Home
      </Link>

      <ChevronRight className="h-4 w-4 text-slate-300" />

      <span className="font-semibold text-teal-600">
        Brands
      </span>
    </div>

    {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="
              animate-text-shine
              bg-gradient-to-r 
              from-[#001f3f] 
              via-[#0d9488] 
              to-[#001f3f] 
              bg-clip-text 
              text-[28px] 
              font-bold 
              text-transparent
            ">
            Shop By Brands
          </h1>
          
          <p className="
              mt-1
              text-sm
              font-semibold
              text-teal-600
            ">
            Total Brands Available: {brands?.length || 0}
          </p>
        </div>

        <Button onClick={handleCreate} disabled={isLoading}>
          + Add Brand
        </Button>
      </div>

      {/* TABLE */}
      <BrandTable onEdit={handleEdit} />

      {/* MODAL */}
      <CreateBrandModal
        open={open}
        onClose={() => setOpen(false)}
        initialData={selected}
      />
    </div>
  );
}