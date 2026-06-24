"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Brand } from "../types/brand.type";
import BrandTable from "./brand-table";
import CreateBrandModal from "./create-brand-modal";

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

  return (
    <div className="p-6 space-y-6">
      
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