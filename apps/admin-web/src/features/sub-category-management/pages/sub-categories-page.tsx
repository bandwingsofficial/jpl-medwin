"use client";

import { useState } from "react";

import { Button } from "@/shared/components/ui/button";

import { SubCategoryTable } from "../components/sub-category-table";

import { CreateSubCategoryModal } from "../components/create-sub-category-modal";

import {
  useSubCategories,
  useCreateSubCategory,
  useUpdateSubCategory,
  useDeleteSubCategory,
  useToggleSubCategoryStatus,
} from "../hooks/use-sub-category";

import { useCategories } from "@/features/category-management/hooks/use-category";

import { SubCategory } from "../types/sub-category.type";

import {
  showError,
  showWarning,
  showConfirmToast,
  showSuccess,
} from "@/shared/store/toast.store";

export default function SubCategoriesPage() {

  const { data } =
    useSubCategories();

  const {
    data: categories,
  } = useCategories();

  const createMutation =
    useCreateSubCategory();

  const updateMutation =
    useUpdateSubCategory();

  const deleteMutation =
    useDeleteSubCategory();

  const statusMutation =
    useToggleSubCategoryStatus();

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    selected,
    setSelected,
  ] = useState<SubCategory | null>(
    null
  );

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    statusMutation.isPending;

  // =========================
  // CREATE / UPDATE
  // =========================

  const handleSubmit =
    async (
      formData: any
    ) => {

      try {

        if (selected) {

          await updateMutation.mutateAsync({
            id: selected.id,

            payload:
              formData,
          });

        } else {

          await createMutation.mutateAsync(
            formData
          );
        }

        setOpen(false);

        setSelected(
          null
        );

      } catch (e: any) {

        console.error(e);

        showError(
          e?.message ||
            "Save failed"
        );
      }
    };

  // =========================
  // OPEN CREATE MODAL
  // =========================

  const handleCreate =
    () => {

      setSelected(
        null
      );

      setOpen(true);
    };

  // =========================
  // EDIT
  // =========================

  const handleEdit =
    (
      item: SubCategory
    ) => {

      setSelected(item);

      setOpen(true);
    };

  // =========================
  // STATUS TOGGLE
  // =========================

  const handleToggleStatus =
    async (
      item: SubCategory
    ) => {

      try {

        const parent =
          categories?.find(
            (c) =>
              c.id ===
              item.categoryId
          );

        const isParentInactive =
          parent?.status ===
          "INACTIVE";

        // 🚫 BLOCK ACTIVATION

        if (
          item.status ===
            "INACTIVE" &&
          isParentInactive
        ) {

          showError(
            "Cannot activate sub-category. Parent category is inactive."
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

      } catch (e) {

        console.error(e);

        showError(
          "Status update failed"
        );
      }
    };

  // =========================
  // DELETE
  // =========================

  const handleDelete =
    async (
      item: SubCategory
    ) => {

      if (
        item.status ===
        "ACTIVE"
      ) {

        showError(
          "Deactivate first"
        );

        return;
      }

      showConfirmToast(

        `Are you sure you want to delete "${item.name}" ?`,

        async () => {

          try {

            showWarning(
              `Deleting "${item.name}"...`
            );

            await deleteMutation.mutateAsync(
              item.id
            );

            showSuccess(
              `"${item.name}" deleted successfully`
            );

          } catch (error: any) {

            console.error(error);

            showError(

              error?.response?.data
                ?.message ||

              error?.message ||

              "Delete failed"
            );
          }
        }
      );
    };

  return (

    <div
      className="
        min-h-screen
        bg-gray-50
        p-6
      "
    >

      {/* HEADER */}

      <div
        className="
          mb-8
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
            Sub Categories
          </h1>

          <p
            className="
              mt-1
              text-sm
              font-semibold
              text-teal-600
            "
          >
            Total SubCategories Available: {data?.length || 0}
          </p>

        </div>

        <Button
          type="button"
          onClick={
            handleCreate
          }
          disabled={
            isLoading
          }
          className="
            h-11
            rounded-xl
            px-5
            shadow-sm
          "
        >
          + Add SubCategory
        </Button>

      </div>

      {/* TABLE */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          bg-white
        "
      >

        <SubCategoryTable
          data={data || []}
          categories={
            categories || []
          }
          onEdit={
            handleEdit
          }
          onDelete={
            handleDelete
          }
          onToggleStatus={
            handleToggleStatus
          }
        />

      </div>

      {/* MODAL */}

      <CreateSubCategoryModal
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
          categories || []
        }
        isLoading={
          isLoading
        }
        initialData={
          selected
        }
      />

    </div>
  );
}