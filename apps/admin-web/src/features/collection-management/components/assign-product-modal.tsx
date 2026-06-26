"use client";

import { useState, useMemo, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { Button } from "@/shared/components/ui/button";

import {
  useAssignProduct,
  useCollection,
  useRemoveProduct,
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
  // Keeps track of newly selected product IDs only
  const [selectedProductIds, setSelectedProductIds] =
    useState<string[]>([]);
    
  // State for immediate input feedback
  const [searchQuery, setSearchQuery] = useState("");
  // State for the debounced search keyword used to filter the list
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const {
    data: products = [],
    isLoading: isProductsLoading,
  } = useProductsForCollection();

  // Fetching the collection details to know which products are already selected
  const {
    data: collectionData,
    isLoading: isCollectionLoading,
  } = useCollection(collectionId);

  const assignMutation = useAssignProduct();
  const removeMutation = useRemoveProduct();

  // Combine loading states
  const isLoading = isProductsLoading || isCollectionLoading;

  // Track the IDs that are already assigned to this collection
  const assignedProductIds = useMemo(() => {
    if (!collectionData?.products || !Array.isArray(collectionData.products)) {
      return new Set<string>();
    }
    return new Set<string>(
      collectionData.products.map((p: any) => p.id || p.productId).filter(Boolean)
    );
  }, [collectionData]);

  // 300ms Debounce implementation
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Reset search and selections when modal closes/opens
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setDebouncedSearchQuery("");
      setSelectedProductIds([]);
    }
  }, [open]);

  const options = useMemo(() => {
    const productList = Array.isArray(products)
      ? products
      : [];

    return productList
      .map((product: any) => ({
        id: product.id,
        name: product.name,
      }))
      .filter((product) =>
        product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
  }, [products, debouncedSearchQuery]);

  const handleToggleProduct = (id: string, isAlreadyAssigned: boolean) => {
    if (isAlreadyAssigned) return; // Prevention check
    
    setSelectedProductIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  async function handleRemoveProduct(productId: string) {
    try {
      await removeMutation.mutateAsync({
        collectionId,
        productId,
      });
      showSuccess("Product removed successfully");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to remove product";
      showError(message);
    }
  }

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
          {/* SEARCH INPUT BAR */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full
                px-3
                py-2
                text-sm
                border
                border-gray-300
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-teal-500
                focus:border-teal-500
                placeholder-gray-400
              "
            />
          </div>

          <label
            className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-2
            "
          >
            Products ({selectedProductIds.length} selected to add)
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
                const isAlreadyAssigned = assignedProductIds.has(option.id);
                const isChecked = isAlreadyAssigned || selectedProductIds.includes(option.id);
                
                return (
                  <div
                    key={option.id}
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      px-4
                      py-3
                      hover:bg-slate-50
                      transition-colors
                    "
                  >
                    <label
                      className={`
                        flex
                        items-center
                        gap-3
                        text-sm
                        text-gray-900
                        flex-1
                        select-none
                        ${isAlreadyAssigned ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isAlreadyAssigned}
                        onChange={() => handleToggleProduct(option.id, isAlreadyAssigned)}
                        className="
                          h-4
                          w-4
                          rounded
                          border-gray-300
                          text-teal-600
                          focus:ring-teal-500
                          disabled:bg-gray-200
                          disabled:text-gray-400
                          disabled:border-gray-300
                        "
                      />
                      <span className="font-medium">
                        {option.name}
                      </span>
                    </label>

                    {isAlreadyAssigned && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveProduct(option.id)}
                        className="h-7 px-3 text-xs"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
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