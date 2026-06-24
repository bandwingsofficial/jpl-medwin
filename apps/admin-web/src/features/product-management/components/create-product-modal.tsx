"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Modal } from "@/shared/components/ui/modal";

import { ProductForm } from "./product-form";

import {
  Product,
} from "@/features/product-management/types/product.type";

// =========================================
// TYPES
// =========================================

interface Props {
  open: boolean;

  onClose: () => void;

  mode?: "create" | "edit";

  initialData?: Product | null;
}

// =========================================
// CREATE / UPDATE PRODUCT MODAL
// =========================================

export function CreateProductModal({
  open,
  onClose,
  mode = "create",
  initialData = null,
}: Props) {

  // =========================================
  // LOCAL STATE
  // =========================================

  const [
    mounted,
    setMounted,
  ] = useState(false);

  // =========================================
  // EFFECTS
  // =========================================

  useEffect(() => {

    setMounted(true);

  }, []);

  // =========================================
  // MODE
  // =========================================

  const isEditMode =
    mode === "edit";

  // =========================================
  // FORCE FORM RESET
  // IMPORTANT FOR EDIT SWITCHING
  // =========================================

  const formKey =
    useMemo(() => {

      if (
        isEditMode &&
        initialData?.id
      ) {

        return `edit-${initialData.id}`;
      }

      return "create-product";

    }, [
      isEditMode,
      initialData,
    ]);

  // =========================================
  // TITLES
  // =========================================

  const modalTitle =
    isEditMode
      ? "Update Product"
      : "Create New Product";

  const modalDescription =
    isEditMode
      ? "Update product details, media, variants and pricing."
      : "Create product with variants, pricing and media.";

  // =========================================
  // PREVENT SSR ISSUES
  // =========================================

  if (!mounted) {
    return null;
  }

  // =========================================
  // HANDLE CLOSE
  // =========================================

  const handleClose = () => {

    onClose();

  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="
        max-w-7xl
        w-full
        h-[95vh]
        flex
        flex-col
        overflow-hidden
      "
    >
      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div
        className="
          sticky
          top-0
          z-30
          flex
          items-center
          justify-between
          border-b
          border-gray-200
          bg-white
          px-6
          py-5
          rounded-t-2xl
          flex-shrink-0
          shadow-sm
        "
      >
        {/* LEFT */}

        <div className="space-y-1">

          <h2
            className="
              text-2xl
              font-bold
              tracking-tight
              text-gray-900
            "
          >
            {modalTitle}
          </h2>

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            {modalDescription}
          </p>

        </div>

        {/* RIGHT */}

        <button
          type="button"
          onClick={handleClose}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-gray-200
            bg-white
            text-xl
            text-gray-500
            transition-all
            duration-200
            hover:border-gray-300
            hover:bg-gray-100
            hover:text-gray-700
            active:scale-95
          "
        >
          ×
        </button>
      </div>

      {/* ===================================== */}
      {/* BODY */}
      {/* ===================================== */}

      <div
        className="
          flex-1
          overflow-y-auto
          bg-gray-50/40
          px-6
          py-6
          min-h-0
        "
      >
        <ProductForm
          key={formKey}
          mode={mode}
          initialData={initialData}
          onSuccess={handleClose}
        />
      </div>
    </Modal>
  );
}