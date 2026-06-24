"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";

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

  if (productsQuery.isLoading) return <div className="flex justify-center py-8"><Loader /></div>;
  if (productsQuery.isError) return <EmptyState title="Failed to load products" />;

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
  onFilterChange={
    handleFilterChange
  }
  onReset={
    handleResetFilters
  }
/>
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
                  <TableHead><div className="text-xs font-semibold whitespace-nowrap">Stock</div></TableHead>
                  <TableHead><div className="text-xs font-semibold whitespace-nowrap">Variants</div></TableHead>
                  <TableHead><div className="text-xs font-semibold whitespace-nowrap">Warranty</div></TableHead>
                  <TableHead><div className="text-xs font-semibold whitespace-nowrap">Status</div></TableHead>
                  <TableHead><div className="text-xs font-semibold whitespace-nowrap text-right">Actions</div></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedProducts.map((p: any) => {
                  const variantCount = p.variants?.length || 0;
                  const firstVariant = p.variants?.[0];
                  const inStock = p.stock?.inStock === true;
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
                        <div className="py-2 text-sm text-gray-600 whitespace-nowrap">{p.brand?.name || "N/A"}</div>
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
                          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${inStock ? "border-green-100 bg-green-50 text-green-700" : "border-red-100 bg-red-50 text-red-600"}`}>
                            {inStock ? "In Stock" : "Out of Stock"}
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
                        <div className="py-2 whitespace-nowrap text-sm text-gray-600">
                          {firstVariant?.warrantyMonths ? `${firstVariant.warrantyMonths} Months` : "N/A"}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="py-2 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${isDeleted || isInactive ? "border-red-100 bg-red-50 text-red-600" : "border-green-100 bg-green-50 text-green-700"}`}>
                            {isDeleted ? "DELETED" : p.status}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="py-2 flex items-center justify-end gap-1.5 whitespace-nowrap">
                          {!isDeleted && (
                            <Button size="icon" variant="secondary" className="h-8 w-8 hover:bg-gray-100" onClick={() => handleEdit(p)}>
                              <Pencil className="h-3.5 w-3.5 text-gray-500" />
                            </Button>
                          )}
                          {!isDeleted && (
                            <Button size="icon" variant="secondary" className="h-8 w-8 hover:bg-gray-100" disabled={toggleProductStatus.isPending} onClick={() => handleToggleStatus(p)}>
                              <Power className="h-3.5 w-3.5 text-gray-500" />
                            </Button>
                          )}
                          {isDeleted ? (
                            <Button size="icon" variant="secondary" className="h-8 w-8 hover:bg-gray-100" disabled={restoreProduct.isPending} onClick={() => handleRestore(p)}>
                              <RotateCcw className="h-3.5 w-3.5 text-gray-500" />
                            </Button>
                          ) : (
                            <Button size="icon" variant="secondary" className="h-8 w-8 hover:bg-red-50 hover:text-red-600 group" disabled={deleteProduct.isPending} onClick={() => handleDelete(p)}>
                              <Trash2 className="h-3.5 w-3.5 text-gray-500 group-hover:text-red-600" />
                            </Button>
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