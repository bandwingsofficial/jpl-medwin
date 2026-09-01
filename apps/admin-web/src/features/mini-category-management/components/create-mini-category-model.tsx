"use client";

import { Modal } from "@/shared/components/ui/modal";

import { MiniCategoryForm } from "./mini-category-form";

import { Category } from "@/features/category-management/types/category.type";

import { SubCategory } from "@/features/sub-category-management/types/sub-category.type";

import { MiniCategory } from "../types/mini-category.type";

interface Props {
  open: boolean;

  onClose: () => void;

  onSubmit: (data: any) => void;

  categories: Category[];

  subCategories: SubCategory[];

  isLoading?: boolean;

  // 🔥 EDIT SUPPORT
  initialData?: MiniCategory | null;
}

export function CreateMiniCategoryModal({
  open,
  onClose,
  onSubmit,
  categories,
  subCategories,
  isLoading,
  initialData,
}: Props) {
  // ✅ DON'T RENDER WHEN CLOSED
  if (!open) return null;

  return (
    <Modal
      open={open} // ✅ CRITICAL FIX
      onClose={onClose} // ✅ CRITICAL FIX
    >
      <div
        className="
          w-full
          max-w-2xl
          overflow-hidden
          rounded-xl
          bg-white
          shadow-xl
        "
      >
        <MiniCategoryForm
          categories={categories}
          subCategories={subCategories}
          onSubmit={onSubmit}
          initialData={initialData}
          isLoading={isLoading}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
}