"use client";

import { useEffect, useMemo } from "react";

import { Modal } from "@/shared/components/ui/modal";
import { ProductForm } from "./product-form";
import { Product } from "@/features/product-management/types/product.type";
import { useProductById } from "../hooks/use-product";

interface Props {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  initialData?: Product | null;
}

export function CreateProductModal({
  open,
  onClose,
  mode = "create",
  initialData = null,
}: Props) {
  const isEditMode = mode === "edit";
  const productId = isEditMode ? initialData?.id : undefined;

  const productDetailQuery = useProductById(open && productId ? productId : undefined);

  const resolvedInitialData =
    isEditMode && productDetailQuery.data?.data
      ? productDetailQuery.data.data
      : initialData;

  const formKey = useMemo(() => {
    if (isEditMode && resolvedInitialData?.id) {
      return `edit-${resolvedInitialData.id}`;
    }

    return "create-product";
  }, [isEditMode, resolvedInitialData?.id]);

  if (!open) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="max-w-7xl w-full h-[95vh] flex flex-col overflow-hidden"
    >
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5 rounded-t-2xl flex-shrink-0 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {isEditMode ? "Update Product" : "Create New Product"}
          </h2>
          <p className="text-sm text-gray-500">
            {isEditMode
              ? "Update product details, media, variants and pricing."
              : "Create product with variants, pricing and media."}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-xl text-gray-500 transition-all duration-200 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-700 active:scale-95"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50/40 px-6 py-6 min-h-0">
        {isEditMode && productDetailQuery.isLoading ? (
          <div className="py-16 text-center text-sm text-gray-500">Loading product details...</div>
        ) : isEditMode && productDetailQuery.isError ? (
          <div className="py-16 text-center text-sm text-red-500">Failed to load product details.</div>
        ) : (
          <ProductForm
            key={formKey}
            mode={mode}
            initialData={resolvedInitialData}
            onSuccess={onClose}
          />
        )}
      </div>
    </Modal>
  );
}
