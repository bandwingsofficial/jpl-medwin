"use client";

import { Brand } from "../types/brand.type";
import BrandForm from "./brand-form";

export default function CreateBrandModal({
  open,
  onClose,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  initialData: Brand | null;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL CONTAINER */}
      <div className="relative w-full max-w-2xl mx-4">
        <BrandForm initialData={initialData} onClose={onClose} />
      </div>
    </div>
  );
}