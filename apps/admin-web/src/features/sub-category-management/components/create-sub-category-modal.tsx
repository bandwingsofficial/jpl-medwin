"use client";

import { Modal } from "@/shared/components/ui/modal";
import { SubCategoryForm } from "./sub-category-form";
import { Category } from "@/features/category-management/types/category.type";
import { SubCategory } from "../types/sub-category.type";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  categories: Category[];
  isLoading?: boolean;
  initialData?: SubCategory | null;
}

export function CreateSubCategoryModal({
  open,
  onClose,
  onSubmit,
  categories,
  isLoading,
  initialData,
}: Props) {
 
  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div
        className="
          relative
          w-full
          max-w-2xl
          rounded-2xl
          bg-white
          shadow-2xl
          overflow-hidden
        "
      >
        {/* 👉 FIX: Removed the duplicate layout text text block header. 
             Only an absolute positioned, clean close button remains to prevent conflicting headers. 
        */}
        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            right-4
            top-4
            z-50
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            text-gray-400
            bg-white/80
            backdrop-blur-sm
            border
            border-gray-100
            transition-all
            hover:bg-gray-50
            hover:text-gray-900
            active:scale-95
          "
        >
          <X className="h-4 w-4" />
        </button>

        {/* FORM CONTAINER */}
        <div className="p-6">
          <SubCategoryForm
            categories={categories}
            onSubmit={onSubmit}
            isLoading={isLoading}
            onCancel={onClose}
            initialData={initialData}
          />
        </div>
      </div>
    </Modal>
  );
}