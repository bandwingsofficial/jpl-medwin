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
  const [selectedProductId, setSelectedProductId] =
    useState("");

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

  async function handleAssign() {
    if (!selectedProductId) {
      showError(
        "Please select a product"
      );

      return;
    }

    try {
      await assignMutation.mutateAsync({
        collectionId,
        payload: {
          productId:
            selectedProductId,
        },
      });

      showSuccess(
        "Product assigned successfully"
      );

      setSelectedProductId("");

      onClose();

    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to assign product";

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
            Assign Product
          </DialogTitle>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Select a product and assign it
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
            Product
          </label>

          <select
            value={selectedProductId}
            onChange={(e) =>
              setSelectedProductId(
                e.target.value
              )
            }
            disabled={isLoading}
            className="
              w-full
              h-12
              rounded-xl
              border
              border-gray-300
              bg-white
              px-4
              text-sm
              text-gray-900
              outline-none
              focus:ring-2
              focus:ring-teal-500
              focus:border-teal-500
            "
          >
            <option value="">
              {isLoading
                ? "Loading products..."
                : "Select Product"}
            </option>

            {options.map(
              (option) => (
                <option
                  key={option.id}
                  value={option.id}
                >
                  {option.name}
                </option>
              )
            )}
          </select>

          {!isLoading &&
            options.length === 0 && (
              <p
                className="
                  mt-2
                  text-sm
                  text-red-500
                "
              >
                No products available.
              </p>
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
            Assign Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}