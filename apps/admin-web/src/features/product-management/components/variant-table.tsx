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
} from "lucide-react";

import {
  showError,
  showInfo,
  showSuccess,
  showWarning,
} from "@/shared/store/toast.store";

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
                Attributes
              </div>
            </TableHead>

            <TableHead>
              <div className="text-xs font-semibold whitespace-nowrap">
                Pricing
              </div>
            </TableHead>

            <TableHead>
              <div className="text-xs font-semibold whitespace-nowrap">
                Stock
              </div>
            </TableHead>

            <TableHead>
              <div className="text-xs font-semibold whitespace-nowrap">
                Warranty
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

              const attributes =
                Object.entries(
                  variant.attributes || {}
                );

              const isDeleted =
                !!variant.deletedAt;

              const isInactive =
                variant.status ===
                "INACTIVE";

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

                  {/* ATTRIBUTES */}

                  <TableCell>
                    <div
                      className="
                        py-2
                        flex
                        items-center
                        gap-1.5
                        whitespace-nowrap
                      "
                    >
                      {attributes.length ? (
                        attributes.map(
                          ([key, value]) => (
                            <span
                              key={key}
                              className="
                                inline-flex
                                items-center
                                rounded-md
                                border
                                border-gray-200
                                bg-gray-50
                                px-2
                                py-1
                                text-[10px]
                                font-medium
                                text-gray-700
                              "
                            >
                              {key}: {value}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-sm text-gray-400">
                          N/A
                        </span>
                      )}
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
                      <div
                        className="
                          inline-flex
                          items-center
                          gap-2
                        "
                      >
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
                              variant.stock?.inStock
                                ? "border-green-100 bg-green-50 text-green-700"
                                : "border-red-100 bg-red-50 text-red-600"
                            }
                          `}
                        >
                          {variant.stock?.inStock
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>

                        <span
                          className="
                            text-[11px]
                            text-gray-500
                          "
                        >
                          Qty:
                          {" "}
                          {variant.stock?.quantity || 0}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* WARRANTY */}

                  <TableCell>
                    <div className="py-2 whitespace-nowrap">
                      <span
                        className="
                          text-sm
                          text-gray-700
                        "
                      >
                        {variant.warrantyMonths
                          ? `${variant.warrantyMonths} Months`
                          : "N/A"}
                      </span>
                    </div>
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

                    <div
                      className="
                        py-2
                        flex
                        items-center
                        justify-end
                        gap-1.5
                        whitespace-nowrap
                      "
                    >

                      

                      {/* STATUS */}

                      {!isDeleted && (

                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8"
                          disabled={
                            toggleVariantStatusMutation.isPending
                          }
                          onClick={() =>
                            handleToggleStatus(
                              variant
                            )
                          }
                        >
                          <Power className="h-3.5 w-3.5" />
                        </Button>

                      )}

                      {/* DELETE / RESTORE */}

                      {isDeleted ? (

                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8"
                          disabled={
                            restoreVariantMutation.isPending
                          }
                          onClick={() =>
                            handleRestoreVariant(
                              variant
                            )
                          }
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </Button>

                      ) : (

                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8"
                          disabled={
                            deleteVariantMutation.isPending
                          }
                          onClick={() =>
                            handleDeleteVariant(
                              variant
                            )
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>

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