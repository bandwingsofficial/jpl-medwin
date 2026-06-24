"use client";

import { Modal } from "@/shared/components/ui/modal";

import { CategoryForm } from "./category-form";

import { Category } from "../types/category.type";

interface Props {
  open: boolean;

  onClose: () => void;

  onSubmit: (data: any) => void;

  initialData?: Category | null;

  isLoading?: boolean;
}

export function CreateCategoryModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: Props) {
  // ✅ DON'T RENDER WHEN CLOSED
  if (!open) return null;

  return (
    <Modal
      open={open} // ✅ CRITICAL FIX
      onClose={onClose} // ✅ CRITICAL FIX
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <CategoryForm
          initialData={initialData}
          onSubmit={onSubmit}
          isLoading={isLoading}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
}