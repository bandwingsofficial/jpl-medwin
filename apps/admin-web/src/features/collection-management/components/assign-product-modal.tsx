"use client";

import { useState, useMemo } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { Button } from "@/shared/components/ui/button";

import {
  useAssignProduct,
} from "@/features/collection-management/hooks/use-collections";

import {
  useProductsForCollection,
} from "@/features/collection-management/hooks/use-products-for-collection";

import {
  showError,
  showSuccess,
} from "@/shared/store/toast.store";

interface Props {
  open: boolean;
  collectionId: string;
  onClose: () => void;
}

export function AssignProductModal({
  open,
  collectionId,
  onClose,
}: Props) {
  const [selectedProductIds, setSelectedProductIds] =
    useState<string[]>([]);

  const {
    data: products = [],
    isLoading,
  } = useProductsForCollection();

  const assignMutation =
    useAssignProduct();

  const options = useMemo(() => {
    const productList = Array.isArray(products)
      ? products
      : [];

    return productList.map(
      (product: any) => ({
        id: product.id,
        name: product.name,
      })
    );
  }, [products]);

  const handleToggleProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  async function handleAssign() {
    if (selectedProductIds.length === 0) {
      showError(
        "Please select at least one product"
      );

      return;
    }

    try {
      // Fires individual single-product requests in parallel to match your API type definition
      await Promise.all(
        selectedProductIds.map((id) =>
          assignMutation.mutateAsync({
            collectionId,
            payload: {
              productId: id, // Kept as productId to satisfy the backend & TS types
            },
          })
        )
      );

      showSuccess(
        "Products assigned successfully"
      );

      setSelectedProductIds([]);

      onClose();

    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to assign products";

      showError(message);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="
          max-w-lg
          bg-white
          border
          border-gray-200
          shadow-xl
          rounded-2xl
          p-0
          overflow-hidden
        "
      >
        {/* HEADER */}

        <DialogHeader
          className="
            px-6
            py-5
            border-b
            bg-white
          "
        >
          <DialogTitle
            className="
              text-2xl
              font-bold
              text-gray-900
            "
          >
            Assign Products
          </DialogTitle>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Select one or more products and assign them
            to this collection.
          </p>
        </DialogHeader>

        {/* BODY */}

        <div className="px-6 py-6">
          <label
            className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
            "
          >
            Products ({selectedProductIds.length} selected)
          </label>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center border border-gray-200 rounded-xl text-sm text-gray-500 bg-gray-50">
              Loading products...
            </div>
          ) : options.length === 0 ? (
            <div className="flex h-40 items-center justify-center border border-gray-200 rounded-xl text-sm text-red-500 bg-gray-50">
              No products available.
            </div>
          ) : (
            <div 
              className="
                w-full
                max-h-60
                overflow-y-auto
                rounded-xl
                border
                border-gray-300
                bg-white
                divide-y
                divide-gray-100
              "
            >
              {options.map((option) => {
                const isChecked = selectedProductIds.includes(option.id);
                return (
                  <label
                    key={option.id}
                    className="
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-sm
                      text-gray-900
                      cursor-pointer
                      hover:bg-slate-50
                      transition-colors
                    "
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleProduct(option.id)}
                      className="
                        h-4
                        w-4
                        rounded
                        border-gray-300
                        text-teal-600
                        focus:ring-teal-500
                      "
                    />
                    <span className="font-medium select-none">
                      {option.name}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div
          className="
            px-6
            py-4
            border-t
            bg-gray-50
            flex
            justify-end
            gap-3
          "
        >
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            loading={
              assignMutation.isPending
            }
            onClick={
              handleAssign
            }
            className="
              min-w-[150px]
            "
          >
            Assign Products
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}