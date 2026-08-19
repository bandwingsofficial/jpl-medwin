"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showConfirmToast,
} from "@/shared/store/toast.store";
import { ProductFiltersBar } from "./ProductFiltersBar";

import { ProductFilters }
from "../types/product-filter.type";
import { useProduct } from "../hooks/use-product";
import { CreateProductModal } from "./create-product-modal";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { Loader } from "@/shared/components/ui/loader";
import { EmptyState } from "@/shared/components/ui/empty-state";

import {
  Pencil,
  Trash2,
  Power,
  ChevronRight,
  RotateCcw,
  ChevronLeft,
  X,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { ProductPageSkeleton } from "./product-page-skeleton";

// =========================================
// PRODUCT TABLE
// =========================================

export function ProductTable() {
 const itemsPerPage = 20;

const [filters, setFilters] =
  useState<ProductFilters>({
    page: 1,
    limit: itemsPerPage,
  });

  const {
    productsQuery,
    toggleProductStatus,
    deleteProduct,
    previewDeleteProduct,
    restoreProduct,
  } = useProduct(filters);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [openMenuId, setOpenMenuId] =
  useState<string | null>(null);

  // =========================================
  // HANDLERS
  // =========================================

 const handleFilterChange = (
  newFilters:
    Partial<ProductFilters>
) => {
  setFilters((prev) => ({
    ...prev,
    ...newFilters,
    page: 1,
  }));
};

const handleResetFilters =
  () => {
    setFilters({
      page: 1,
      limit: itemsPerPage,
    });
  };
  
  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setTimeout(() => {
      setSelectedProduct(null);
    }, 200);
  };

  const handleToggleStatus = async (product: any) => {
    try {
      const nextStatus = product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      if (nextStatus === "INACTIVE") {
        try {
          await toggleProductStatus.mutateAsync({
            productId: product.id,
            status: "INACTIVE",
          });
          showSuccess("Product deactivated successfully");
        } catch (error: any) {
          const message = error?.response?.data?.message || "";
          if (message.includes("active variants")) {
            showConfirmToast(
              `${message}\n\nDeactivate all variants also?`,
              async () => {
                try {
                  await toggleProductStatus.mutateAsync({
                    productId: product.id,
                    status: "INACTIVE",
                    force: true,
                  });
                  showSuccess("Product and variants deactivated");
                } catch (error: any) {
                  showError(error?.response?.data?.message || "Failed to deactivate");
                }
              }
            );
            return;
          }
          throw error;
        }
        return;
      }
      await toggleProductStatus.mutateAsync({ productId: product.id, status: "ACTIVE" });
      showSuccess("Product activated successfully");
    } catch (error: any) {
      showError(error?.response?.data?.message || "Failed to update status");
    }
  };
  

  const handleDelete = async (product: any) => {
    if (product.status === "ACTIVE") {
      showWarning("Deactivate product before deleting");
      return;
    }
    showConfirmToast(`Delete "${product.name}" ?`, async () => {
      try {
        showInfo(`Deleting "${product.name}"...`);
        await deleteProduct.mutateAsync({ productId: product.id });
        showSuccess("Product deleted successfully");
      } catch (error: any) {
        const message = error?.response?.data?.message || "";
        if (message.includes("Use force=true")) {
          const preview = await previewDeleteProduct.mutateAsync({ productId: product.id });
          const data = preview?.data;
          showConfirmToast(
            `Product has dependencies.\n\nVariants: ${data?.variantCount}\nImages: ${data?.imageCount}\n\nForce delete product?`,
            async () => {
              try {
                await deleteProduct.mutateAsync({ productId: product.id, force: true });
                showSuccess("Product force deleted successfully");
              } catch (err: any) {
                showError(err?.response?.data?.message || "Failed to force delete");
              }
            }
          );
          return;
        }
        throw error;
      }
    });
  };

  const handleRestore = async (product: any) => {
    try {
      await restoreProduct.mutateAsync({ productId: product.id });
      showSuccess("Product restored successfully");
    } catch (error: any) {
      showError(error?.response?.data?.message || "Failed to restore product");
    }
  };

  // =========================================
  // DATA FILTERING LOGIC
  // =========================================

  const products = productsQuery.data?.data ?? [];

const hasActiveFilters = Boolean(
  filters.search?.trim() ||
  filters.categoryId ||
  filters.subCategoryId ||
  filters.brandId ||
  filters.status
);
  // =========================================
  // PAGINATION MATH
  // =========================================
  const totalProducts = productsQuery.data?.pagination?.total || 0;
  const totalPages = productsQuery.data?.pagination?.totalPages || 1;
  const currentPage =
  filters.page || 1;

const startIndex =
  (currentPage - 1) *
    itemsPerPage +
  1;
  const paginatedProducts = products;

  // 🔥 FIX: Added loading guards so pagination changes don't snap back prematurely
  useEffect(() => {
    if (!productsQuery.isLoading && !productsQuery.isPlaceholderData) {
      if (currentPage > totalPages && totalPages > 0) {
       setFilters((prev) => ({
  ...prev,
  page: totalPages,
}));
      }
    }
  }, [currentPage, totalPages, productsQuery.isLoading, productsQuery.isPlaceholderData]);

  // =========================================
  // RENDER
  // =========================================

 if (productsQuery.isLoading && !productsQuery.isFetching) {
  return (
    <div className="flex justify-center py-8">
      <ProductPageSkeleton />
    </div>
  );
}

if (productsQuery.isError && !hasActiveFilters) {
  return <EmptyState title="Failed to load products" />;
}
  return (
    <>
      <CreateProductModal
        open={editOpen}
        onClose={handleCloseEdit}
        mode="edit"
        initialData={selectedProduct}
      />
<ProductFiltersBar
  filters={filters}
  onFilterChange={handleFilterChange}
  onReset={handleResetFilters}
/>

{hasActiveFilters && (
  <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-xs">
    <span className="mr-1 text-xs font-semibold text-gray-500">
      Filters:
    </span>

    {filters.search?.trim() && (
      <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
        Search: {filters.search}
      </span>
    )}

    {filters.categoryId && (
      <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
        Category
      </span>
    )}

    {filters.subCategoryId && (
      <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
        Sub-Category
      </span>
    )}

    {filters.brandId && (
      <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
        Brand
      </span>
    )}

    {filters.status && (
      <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
        Status: {filters.status}
      </span>
    )}
  </div>
)}

<div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden">
        {products.length === 0 ? (
          <EmptyState title="No products match your filters" />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><div className="h-10 flex items-center text-xs font-semibold whitespace-nowrap">Image</div></TableHead>
                  <TableHead><div className="text-xs font-semibold whitespace-nowrap">Product</div></TableHead>
                  <TableHead><div className="text-xs font-semibold whitespace-nowrap">Brand</div></TableHead>
                  <TableHead><div className="text-xs font-semibold whitespace-nowrap">Category</div></TableHead>
                  <TableHead><div className="text-xs font-semibold whitespace-nowrap">Price</div></TableHead>
                  <TableHead><div className="text-xs font-semibold whitespace-nowrap">Variants</div></TableHead>
                  <TableHead><div className="text-xs font-semibold whitespace-nowrap">Status</div></TableHead>
                  <TableHead><div className="text-xs font-semibold whitespace-nowrap text-right">Actions</div></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedProducts.map((p: any) => {
                  const variantCount = p.variants?.length || 0;
                  const firstVariant = p.variants?.[0];
                  const isAvailable = p.status === "ACTIVE";
                  const price = p.price?.min ? `₹${p.price.min.toLocaleString()}` : "N/A";
                  const isDeleted = !!p.deletedAt;
                  const isInactive = p.status === "INACTIVE";

                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="py-2">
                          <div className="h-11 w-11 overflow-hidden rounded-md border border-gray-100 bg-gray-50 shrink-0">
                            {p.images?.main ? (
                              <img src={p.images.main} alt={p.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">N/A</div>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="py-2 max-w-[200px]">
                          <p className="truncate text-sm font-semibold text-gray-900">{p.name}</p>
                          <p className="truncate text-[11px] text-gray-400 font-mono">{p.slug}</p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="py-2 text-sm text-gray-600 whitespace-nowrap"><p
    className="
      truncate
      text-xs
      font-bold
      bg-gradient-to-r
      from-blue-600
      via-purple-600
      to-blue-600
      bg-[length:200%_auto]
      bg-clip-text
      text-transparent
      animate-text-shine
    "
  >
   {p.brand?.name?.toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase())}
  </p></div>
                      </TableCell>

                      <TableCell>
                        <div className="py-2 leading-tight max-w-[150px]">
                          <p className="text-xs font-medium text-gray-700 truncate">
                            {p.category?.name || "N/A"}
                          </p>

                          <p className="text-[10px] text-gray-400 truncate mt-0.5">
                            {p.subCategory?.name || "N/A"}
                          </p>

                          <p className="text-[10px] text-gray-400 truncate mt-0.5">
                            {p.miniCategory?.name || "N/A"}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="py-2 whitespace-nowrap text-sm font-semibold text-gray-900">{price}</div>
                      </TableCell>

                      <TableCell>
                        <div className="py-2 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${isAvailable ? "border-green-100 bg-green-50 text-green-700" : "border-red-100 bg-red-50 text-red-600"}`}>
                            {isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="py-2 whitespace-nowrap">
                          <Link href={`/products/${p.id}/variants`} className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600 transition-colors hover:bg-gray-50">
                            <span>{variantCount} Variants</span>
                            <ChevronRight className="h-3 w-3 text-gray-400" />
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>
  <div className="relative flex items-center justify-end">
    {/* 3 DOT BUTTON */}
    <Button
      size="icon"
      variant="ghost"
      className="h-8 w-8 rounded-lg hover:bg-gray-100"
      onClick={() =>
        setOpenMenuId(
          openMenuId === p.id ? null : p.id
        )
      }
    >
      <MoreVertical className="h-4 w-4 text-gray-500" />
    </Button>

    {/* DROPDOWN */}
    {openMenuId === p.id && (
      <div
        className="
          absolute
          right-0
          top-10
          z-50
          w-36
          rounded-lg
          border
          border-gray-200
          bg-white
          p-1
          shadow-lg
        "
      >
        {/* EDIT */}
        {!isDeleted && (
          <button
            type="button"
            onClick={() => {
              setOpenMenuId(null);
              handleEdit(p);
            }}
            className="
              flex
              w-full
              items-center
              gap-2
              rounded-md
              px-3
              py-2
              text-left
              text-sm
              text-gray-700
              hover:bg-gray-100
            "
          >
            <Pencil className="h-3.5 w-3.5 text-gray-500" />
            Edit
          </button>
        )}

        {/* ACTIVATE / DEACTIVATE */}
        {!isDeleted && (
          <button
            type="button"
            disabled={toggleProductStatus.isPending}
            onClick={() => {
              setOpenMenuId(null);
              handleToggleStatus(p);
            }}
            className="
              flex
              w-full
              items-center
              gap-2
              rounded-md
              px-3
              py-2
              text-left
              text-sm
              text-gray-700
              hover:bg-gray-100
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Power className="h-3.5 w-3.5 text-gray-500" />
            {p.status === "ACTIVE"
              ? "Deactivate"
              : "Activate"}
          </button>
        )}

        {/* RESTORE */}
        {isDeleted ? (
          <button
            type="button"
            disabled={restoreProduct.isPending}
            onClick={() => {
              setOpenMenuId(null);
              handleRestore(p);
            }}
            className="
              flex
              w-full
              items-center
              gap-2
              rounded-md
              px-3
              py-2
              text-left
              text-sm
              text-gray-700
              hover:bg-gray-100
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RotateCcw className="h-3.5 w-3.5 text-gray-500" />
            Restore
          </button>
        ) : (
          /* DELETE */
          <button
            type="button"
            disabled={deleteProduct.isPending}
            onClick={() => {
              setOpenMenuId(null);
              handleDelete(p);
            }}
            className="
              flex
              w-full
              items-center
              gap-2
              rounded-md
              px-3
              py-2
              text-left
              text-sm
              text-red-600
              hover:bg-red-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Trash2 className="h-3.5 w-3.5 text-red-500" />
            Delete
          </button>
        )}
      </div>
    )}
  </div>
</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
                <span className="text-xs font-medium text-gray-500">
                  Showing {startIndex} to {Math.min(startIndex + itemsPerPage - 1, totalProducts)} of {totalProducts} Products
                </span>
                <div className="flex items-center gap-1.5">
                  
                  <Button
                    variant="primary"
                    size="icon"
                    className="h-7 w-7 rounded-md bg-white border-gray-200 hover:bg-gray-50"
                    disabled={currentPage === 1}
                    onClick={() => {
                      setFilters((prev) => ({
  ...prev,
  page: Math.max(
    (prev.page || 1) - 1,
    1
  ),
}));
                    }}
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-600" />
                  </Button>
                  
                  <div className="text-xs font-bold px-2.5 text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <Button
                    variant="primary"
                    size="icon"
                    className="h-7 w-7 rounded-md bg-white border-gray-200 hover:bg-gray-50"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setFilters((prev) => ({
  ...prev,
  page: Math.min(
    (prev.page || 1) + 1,
    totalPages
  ),
}));
                    }}
                  >
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}