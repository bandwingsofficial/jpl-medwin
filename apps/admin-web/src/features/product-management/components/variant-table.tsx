"use client";

import Link from "next/link";

import {
  ProductVariant,
} from "../types/variant.type";

import {
  useVariants,
} from "../hooks/use-variant";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { Badge } from "@/shared/components/ui/badge";

import { Button } from "@/shared/components/ui/button";

import {
  Pencil,
  Power,
  Trash2,
  ChevronRight,
  RotateCcw,
  MoreVertical,
  Eye,
} from "lucide-react";

import {
  showError,
  showInfo,
  showSuccess,
  showWarning,
} from "@/shared/store/toast.store";
import { useState } from "react";

// =========================================
// TYPES
// =========================================

interface VariantTableProps {
  productId: string;

  variants: ProductVariant[];
}

// =========================================
// COMPONENT
// =========================================

export function VariantTable(
  props: VariantTableProps
) {

  const {
    productId,
    variants,
  } = props;

  // =========================================
  // HOOKS
  // =========================================

  const {
    toggleVariantStatusMutation,
    deleteVariantMutation,
    previewDeleteVariantMutation,
    restoreVariantMutation,
  } = useVariants({
    productId,
  });

  const [openMenuId, setOpenMenuId] =
  useState<string | null>(null);
  // =========================================
  // TOGGLE STATUS
  // =========================================

  const handleToggleStatus =
    async (
      variant: ProductVariant
    ) => {

      try {

        const nextStatus =
          variant.status ===
          "ACTIVE"
            ? "INACTIVE"
            : "ACTIVE";

        // =====================================
        // INFO TOAST
        // =====================================

        showInfo(
          nextStatus ===
            "ACTIVE"
            ? "Activating variant..."
            : "Deactivating variant..."
        );

        // =====================================
        // TOGGLE REQUEST
        // =====================================

        await toggleVariantStatusMutation.mutateAsync(
          {
            productId,

            variantId:
              variant.id,

            status:
              nextStatus,
          }
        );

        // =====================================
        // SUCCESS TOAST
        // =====================================

        showSuccess(
          nextStatus ===
            "ACTIVE"
            ? "Variant activated successfully"
            : "Variant deactivated successfully"
        );

      } catch (error: any) {

        console.error(
          "TOGGLE VARIANT STATUS ERROR:",
          error
        );

        const message =
          error?.response?.data
            ?.message || "";

        // =====================================
        // PRODUCT INACTIVE VALIDATION
        // =====================================

        if (
          message
            .toLowerCase()
            .includes(
              "activate main product"
            ) ||
          message
            .toLowerCase()
            .includes(
              "product is inactive"
            ) ||
          message
            .toLowerCase()
            .includes(
              "parent product"
            )
        ) {

          showWarning(
            "First activate the main product, then activate the variant."
          );

          return;
        }

        // =====================================
        // GENERIC ERROR
        // =====================================

        showError(
          message ||
            "Failed to update variant status"
        );
      }
    };

  // =========================================
  // DELETE VARIANT
  // =========================================

  const handleDeleteVariant =
    async (
      variant: ProductVariant
    ) => {

      try {

        // =====================================
        // ACTIVE VALIDATION
        // =====================================

        if (
          variant.status ===
          "ACTIVE"
        ) {

          showWarning(
            "Deactivate variant before deleting"
          );

          return;
        }

        // =====================================
        // DELETE WARNING
        // =====================================

        showWarning(
          `Deleting "${variant.name}" variant...`
        );

        // =====================================
        // NORMAL DELETE
        // =====================================

        await deleteVariantMutation.mutateAsync(
          {
            productId,

            variantId:
              variant.id,
          }
        );

        showSuccess(
          "Variant deleted successfully"
        );

      } catch (error: any) {

        console.error(
          "DELETE VARIANT ERROR:",
          error
        );

        const message =
          error?.response?.data
            ?.message;

        // =====================================
        // FORCE DELETE FLOW
        // =====================================

        if (
          message?.includes(
            "Use force=true"
          )
        ) {

          try {

            // =================================
            // PREVIEW DELETE
            // =================================

            const preview =
              await previewDeleteVariantMutation.mutateAsync(
                {
                  productId,

                  variantId:
                    variant.id,
                }
              );

            // =================================
            // WARNING
            // =================================

            showWarning(
              `Force deleting variant with ${preview?.data?.imageCount} images`
            );

            // =================================
            // FORCE DELETE
            // =================================

            await deleteVariantMutation.mutateAsync(
              {
                productId,

                variantId:
                  variant.id,

                force: true,
              }
            );

            showSuccess(
              "Variant force deleted successfully"
            );

          } catch (
            previewError
          ) {

            console.error(
              "PREVIEW DELETE ERROR:",
              previewError
            );

            showError(
              "Failed to force delete variant"
            );
          }

        } else {

          showError(
            message ||
              "Failed to delete variant"
          );
        }
      }
    };

  // =========================================
  // RESTORE VARIANT
  // =========================================

  const handleRestoreVariant =
    async (
      variant: ProductVariant
    ) => {

      try {

        showInfo(
          "Restoring variant..."
        );

        await restoreVariantMutation.mutateAsync(
          {
            productId,

            variantId:
              variant.id,
          }
        );

        showSuccess(
          "Variant restored successfully"
        );

      } catch (error: any) {

        console.error(
          "RESTORE VARIANT ERROR:",
          error
        );

        showError(
          error?.response?.data
            ?.message ||
            "Failed to restore variant"
        );
      }
    };

  return (
    <div
      className="
        overflow-x-auto
        rounded-lg
        border
        bg-white
      "
    >
      <Table>

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <TableHeader>

          <TableRow>

            <TableHead>
              <div className="h-10 flex items-center text-xs font-semibold whitespace-nowrap">
                Image
              </div>
            </TableHead>

            <TableHead>
              <div className="text-xs font-semibold whitespace-nowrap">
                Variant
              </div>
            </TableHead>

            <TableHead>
              <div className="text-xs font-semibold whitespace-nowrap">
                SKU
              </div>
            </TableHead>


            <TableHead>
              <div className="text-xs font-semibold whitespace-nowrap">
                Pricing
              </div>
            </TableHead>

            <TableHead>
              <div className="text-xs font-semibold whitespace-nowrap">
                Availability
              </div>
            </TableHead>

             <TableHead>
              <div className="text-xs font-semibold whitespace-nowrap">
                Stock
              </div>
            </TableHead>


            <TableHead>
              <div className="text-xs font-semibold whitespace-nowrap">
                Status
              </div>
            </TableHead>

            <TableHead>
              <div className="text-xs font-semibold whitespace-nowrap text-right">
                Actions
              </div>
            </TableHead>

          </TableRow>

        </TableHeader>

        {/* ========================================= */}
        {/* BODY */}
        {/* ========================================= */}

        <TableBody>

          {variants.map(
            (variant) => {

              const isDeleted = !!variant.deletedAt;

const isInactive = variant.status === "INACTIVE";

const stockQuantity = variant.stock?.quantity ?? 0;

const isAvailable =
  variant.status === "ACTIVE" &&
  stockQuantity > 0;
              return (

                <TableRow
                  key={variant.id}
                >

                  {/* KEEPING ENTIRE TABLE UI SAME */}

                  {/* IMAGE */}

                  <TableCell>
                    <div className="py-2">
                      <div
                        className="
                          h-11
                          w-11
                          overflow-hidden
                          rounded-md
                          border
                          bg-gray-50
                        "
                      >
                        {variant.images?.main ? (
                          <img
                            src={
                              variant.images.main
                            }
                            alt={
                              variant.name
                            }
                            className="
                              h-full
                              w-full
                              object-cover
                            "
                          />
                        ) : (
                          <div
                            className="
                              flex
                              h-full
                              w-full
                              items-center
                              justify-center
                              text-[10px]
                              text-gray-400
                            "
                          >
                            N/A
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* VARIANT */}

                  <TableCell>
                    <div className="py-2 min-w-[180px]">
                      <p
                        className="
                          truncate
                          text-sm
                          font-semibold
                          text-gray-900
                        "
                      >
                        {variant.name}
                      </p>

                      <p
                        className="
                          truncate
                          text-[11px]
                          text-gray-500
                        "
                      >
                        {variant.slug}
                      </p>
                    </div>
                  </TableCell>

                  {/* SKU */}

                  <TableCell>
                    <div className="py-2 whitespace-nowrap">
                      <span
                        className="
                          text-sm
                          font-medium
                          text-gray-700
                        "
                      >
                        {variant.sku}
                      </span>
                    </div>
                  </TableCell>


                  {/* PRICING */}

                  <TableCell>
                    <div className="py-2 whitespace-nowrap">
                      <p
                        className="
                          text-sm
                          font-semibold
                          text-gray-900
                        "
                      >
                        ₹
                        {variant.pricing?.sellingPrice?.toLocaleString()}
                      </p>

                      <p
                        className="
                          text-[11px]
                          text-gray-500
                        "
                      >
                        MRP:
                        {" "}
                        ₹
                        {variant.pricing?.mrp?.toLocaleString()}
                      </p>
                    </div>
                  </TableCell>

                  {/* STOCK */}

                  <TableCell>
  <div className="py-2 whitespace-nowrap">
    <div className="inline-flex items-center gap-2">
      {/* AVAILABILITY */}
      <span
        className={`
          inline-flex
          items-center
          rounded-md
          border
          px-2
          py-1
          text-[11px]
          font-medium
          ${
            isAvailable
              ? "border-green-100 bg-green-50 text-green-700"
              : "border-red-100 bg-red-50 text-red-600"
          }
        `}
      >
        {isAvailable ? "Available" : "Out of Stock"}
      </span>
    </div>
  </div>
</TableCell>

<TableCell>
   {/* QUANTITY */}
      <span className="text-[11px] text-gray-500">
        Qty: {stockQuantity}
      </span>
</TableCell>


                  {/* STATUS */}

                  <TableCell>
                    <div className="py-2 whitespace-nowrap">
                      <span
                        className={`
                          inline-flex
                          items-center
                          rounded-md
                          border
                          px-2
                          py-1
                          text-[11px]
                          font-medium

                          ${
                            isDeleted || isInactive
                              ? "border-red-100 bg-red-50 text-red-600"
                              : "border-green-100 bg-green-50 text-green-700"
                          }
                        `}
                      >
                        {isDeleted
                          ? "DELETED"
                          : variant.status}
                      </span>
                    </div>
                  </TableCell>

                  {/* ACTIONS */}

<TableCell>
  <div className="relative flex items-center justify-end">
    {/* 3 DOT BUTTON */}

    <Button
      size="icon"
      variant="ghost"
      className="
        h-8
        w-8
        rounded-lg
        hover:bg-gray-100
      "
      onClick={() =>
        setOpenMenuId(
          openMenuId === variant.id
            ? null
            : variant.id
        )
      }
    >
      <MoreVertical className="h-4 w-4 text-gray-500" />
    </Button>

    {/* DROPDOWN */}

    {openMenuId === variant.id && (
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
        {/* VIEW */}

<button
  type="button"
  onClick={() => {
    setOpenMenuId(null);

    window.location.href =
      `/products/${productId}/variants/${variant.id}`;
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
  <Eye className="h-3.5 w-3.5 text-gray-500" />

  View
</button>
        {/* ACTIVATE / DEACTIVATE */}

        {!isDeleted && (
          <button
            type="button"
            disabled={
              toggleVariantStatusMutation.isPending
            }
            onClick={() => {
              setOpenMenuId(null);
              handleToggleStatus(variant);
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

            {variant.status === "ACTIVE"
              ? "Deactivate"
              : "Activate"}
          </button>
        )}

        {/* RESTORE */}

        {isDeleted ? (
          <button
            type="button"
            disabled={
              restoreVariantMutation.isPending
            }
            onClick={() => {
              setOpenMenuId(null);
              handleRestoreVariant(variant);
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
            disabled={
              deleteVariantMutation.isPending
            }
            onClick={() => {
              setOpenMenuId(null);
              handleDeleteVariant(variant);
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
            }
          )}

        </TableBody>

      </Table>
    </div>
  );
}