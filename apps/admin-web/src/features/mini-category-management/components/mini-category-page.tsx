"use client";

import { useState } from "react";

import { Button } from "@/shared/components/ui/button";

import { MiniCategoryTable } from "./mini-category-table";

import { CreateMiniCategoryModal } from "./create-mini-category-model";

import {
  useMiniCategories,
  useCreateMiniCategory,
  useUpdateMiniCategory,
  useDeleteMiniCategory,
  useToggleMiniCategoryStatus,
} from "../hooks/use-mini-category";

import { useCategories } from "@/features/category-management/hooks/use-category";

import { useSubCategories } from "@/features/sub-category-management/hooks/use-sub-category";

import { MiniCategory } from "../types/mini-category.type";

import {
  showError,
  showSuccess,
  showWarning,
  showInfo,
} from "@/shared/store/toast.store";

export function MiniCategoryPage() {

  // =========================================
  // DATA
  // =========================================

  const {
    data = [],
    isLoading: isFetching,
  } = useMiniCategories();

  const {
    data: categories = [],
  } = useCategories();

  const {
    data: subCategories = [],
  } = useSubCategories();

  // =========================================
  // MUTATIONS
  // =========================================

  const createMutation =
    useCreateMiniCategory();

  const updateMutation =
    useUpdateMiniCategory();

  const deleteMutation =
    useDeleteMiniCategory();

  const statusMutation =
    useToggleMiniCategoryStatus();

  // =========================================
  // STATE
  // =========================================

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    selected,
    setSelected,
  ] = useState<MiniCategory | null>(
    null
  );

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    statusMutation.isPending;

  // =========================================
  // CREATE / UPDATE
  // =========================================

  const handleSubmit =
    async (
      formData: any
    ) => {

      if (
        isMutating
      ) {
        return;
      }

      try {

        // UPDATE

        if (selected) {

          await updateMutation.mutateAsync({
            id: selected.id,

            payload:
              formData,
          });

          showSuccess(
            "Mini category updated successfully"
          );

        } else {

          // CREATE

          await createMutation.mutateAsync(
            formData
          );

          showSuccess(
            "Mini category created successfully"
          );
        }

        // RESET

        setOpen(false);

        setSelected(
          null
        );

      } catch (e: any) {

        console.error(
          e
        );

        showError(
          e?.response?.data?.message ||
            "Save failed"
        );
      }
    };

  // =========================================
  // EDIT
  // =========================================

  const handleEdit =
    (
      item: MiniCategory
    ) => {

      setSelected(
        item
      );

      setOpen(true);

      showInfo(
        `Editing "${item.name}"`
      );
    };

  // =========================================
  // STATUS
  // =========================================

  const handleToggleStatus =
    async (
      item: MiniCategory
    ) => {

      if (
        statusMutation.isPending
      ) {
        return;
      }

      try {

        const parentCategory =
          categories.find(
            (c) =>
              c.id ===
              item.categoryId
          );

        const parentSub =
          subCategories.find(
            (s) =>
              s.id ===
              item.subCategoryId
          );

        const isBlocked =
          parentCategory?.status ===
            "INACTIVE" ||
          parentSub?.status ===
            "INACTIVE";

        // BLOCK INVALID ACTIVATION

        if (
          item.status ===
            "INACTIVE" &&
          isBlocked
        ) {

          showWarning(
            "Cannot activate. Parent Category or SubCategory is inactive."
          );

          return;
        }

        const newStatus =
          item.status ===
          "ACTIVE"
            ? "INACTIVE"
            : "ACTIVE";

        await statusMutation.mutateAsync({
          id: item.id,

          status:
            newStatus,
        });

        showSuccess(
          `Mini category ${newStatus.toLowerCase()} successfully`
        );

      } catch (e: any) {

        console.error(
          e
        );

        showError(
          e?.response?.data?.message ||
            "Status update failed"
        );
      }
    };

  // =========================================
  // DELETE
  // =========================================

  const handleDelete =
    async (
      item: MiniCategory
    ) => {

      if (
        deleteMutation.isPending
      ) {
        return;
      }

      // ACTIVE CHECK

      if (
        item.status ===
        "ACTIVE"
      ) {

        showWarning(
          "Deactivate first before deleting"
        );

        return;
      }

      try {

        // DELETE WARNING

        showWarning(
          `Deleting "${item.name}"...`
        );

        await deleteMutation.mutateAsync(
          item.id
        );

        showSuccess(
          "Mini category deleted successfully"
        );

      } catch (e: any) {

        console.error(
          e
        );

        showError(
          e?.response?.data?.message ||
            "Delete failed"
        );
      }
    };

  // =========================================
  // UI
  // =========================================

  return (

    <div
      className="
        p-6
        space-y-6
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >

        <div>

          <h1
            className="
              animate-text-shine
              bg-gradient-to-r 
              from-[#001f3f] 
              via-[#0d9488] 
              to-[#001f3f] 
              bg-clip-text 
              text-[28px] 
              font-bold 
              text-transparent
            "
          >
            Mini Categories
          </h1>

          <p
            className="
              mt-1
              text-sm
              font-semibold
              text-teal-600
            "
          >
            Total MiniCategories Available: {data?.length || 0}
          </p>

        </div>

        <Button
          disabled={
            isMutating
          }
          onClick={() => {

            setSelected(
              null
            );

            setOpen(true);

            showInfo(
              "Create new mini category"
            );
          }}
        >
          + Add Mini Category
        </Button>

      </div>

      {/* TABLE */}

      {isFetching ? (

        <div
          className="
            text-sm
            text-gray-500
          "
        >
          Loading...
        </div>

      ) : (

        <MiniCategoryTable
          data={data}
          categories={categories}
          subCategories={subCategories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />

      )}

      {/* MODAL */}

      <CreateMiniCategoryModal
        open={open}
        onClose={() => {

          setOpen(false);

          setSelected(
            null
          );
        }}
        onSubmit={
          handleSubmit
        }
        categories={
          categories
        }
        subCategories={
          subCategories
        }
        isLoading={
          isMutating
        }
        initialData={
          selected
        }
      />

    </div>
  );
}